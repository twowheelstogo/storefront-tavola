/* eslint-disable react/no-multi-comp */
import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import styled from "styled-components";
import Actions from "components/Actions";
import ShippingAddressCheckoutAction from "@reactioncommerce/components/ShippingAddressCheckoutAction/v1";
import FulfillmentOptionsCheckoutAction from "@reactioncommerce/components/FulfillmentOptionsCheckoutAction/v1";
import PaymentsCheckoutAction from "@reactioncommerce/components/PaymentsCheckoutAction/v1";
import FinalReviewCheckoutAction from "@reactioncommerce/components/FinalReviewCheckoutAction/v1";
import { addTypographyStyles } from "@reactioncommerce/components/utils";
import withAddressValidation from "containers/address/withAddressValidation";
import Dialog from "@material-ui/core/Dialog";
import PageLoading from "components/PageLoading";
import Router from "translations/i18nRouter";
import calculateRemainderDue from "lib/utils/calculateRemainderDue";
import { placeOrderMutation } from "../../hooks/orders/placeOrder.gql";
import FulfillmentTypeAction from "components/FulfillmentTypeAction";
import deliveryMethods from "custom/deliveryMethods";
import PaymentMethodCheckoutAction from "components/PaymentMethodCheckoutAction";
import BillingCheckoutAction from "components/BillingCheckoutAction";
import { withStyles } from "@material-ui/core/styles";
import { withComponents } from "@reactioncommerce/components-context";
import { Mutex } from "async-mutex";

const MessageDiv = styled.div`
  ${addTypographyStyles("NoPaymentMethodsMessage", "bodyText")}
`;

const NoPaymentMethodsMessage = () => <MessageDiv>No payment methods available</MessageDiv>;

NoPaymentMethodsMessage.renderComplete = () => "";

const ButtonContent = styled.div`    
  display: flex;
  justify-content:center;
`;

const styles = theme => ({
  BotonPrincipal: {
    backgroundColor: theme.palette.secondary.botones,
    color: theme.palette.colors.BotonColor,
    borderColor: theme.palette.secondary.botones,
    fontWeight: "800",
    fontSize: "24px",
    width: "65%"
  },
});

class CheckoutError {
  constructor(props) {
    this.actionCode = props.actionCode;
    this.message = props.message;
    this.title = props.title;
  }
}

class CheckoutActions extends Component {
  constructor(props) {
    super(props);
    this.mutex = new Mutex();
  }
  static propTypes = {
    addressValidation: PropTypes.func.isRequired,
    addressValidationResults: PropTypes.object,
    apolloClient: PropTypes.shape({
      mutate: PropTypes.func.isRequired
    }),
    cart: PropTypes.shape({
      account: PropTypes.object,
      checkout: PropTypes.object,
      email: PropTypes.string,
      items: PropTypes.array
    }).isRequired,
    cartStore: PropTypes.object,
    authStore: PropTypes.shape({
      account: PropTypes.object.isRequired
    }),
    checkoutMutations: PropTypes.shape({
      onSetFulfillmentOption: PropTypes.func.isRequired,
      onSetShippingAddress: PropTypes.func.isRequired
    }),
    clearAuthenticatedUsersCart: PropTypes.func.isRequired,
    orderEmailAddress: PropTypes.string.isRequired,
    paymentMethods: PropTypes.array
  };

  state = {
    actionAlerts: {
      1: null,
      2: null,
      3: null,
      4: null
    },
    hasPaymentError: false,
    isPlacingOrder: false,
    invoiceInputs: {
      partnerId: -1,
      isCf: true,
      nit: "0",
      name: "CF",
      address: "",
      country: "",
      depto: "",
      city: ""
    },
    paymentInputs: {},
  };

  setPaymentInputs = (inputs) => {
    this.setState(prev => ({
      paymentInputs: {
        ...prev.paymentInputs,
        ...inputs
      }
    }));
  }
  setInvoiceInputs = (inputs) => {
    this.setState(prev => ({
      invoiceInputs: {
        ...prev.invoiceInputs,
        ...inputs
      }
    }));
  }

  componentDidUpdate({ addressValidationResults: prevAddressValidationResults }) {
    const { addressValidationResults } = this.props;
    if (
      addressValidationResults &&
      prevAddressValidationResults &&
      !isEqual(addressValidationResults, prevAddressValidationResults)
    ) {
      this.handleValidationErrors();
    }
  }

  // setShippingMethod = async (shippingMethod) => {
  // 	const { checkoutMutations: { onSetFulfillmentOption } } = this.props;
  // 	const { checkout: { fulfillmentGroups } } = this.props.cart;
  // 	const fulfillmentOption = {
  // 		fulfillmentGroupId: fulfillmentGroups[0]._id,
  // 		fulfillmentMethodId: shippingMethod.selectedFulfillmentOption.fulfillmentMethod._id
  // 	};

  // 	await onSetFulfillmentOption(fulfillmentOption);
  // };


  setFulfillmentType = async (type) => {
		const { checkoutMutations: { onSetFulfillmentType } } = this.props;
		const { checkout: { fulfillmentGroups } } = this.props.cart;
		const fulfillmentTypeInput = {
			fulfillmentGroupId: fulfillmentGroups[0]._id,
			fulfillmentType: type
		};
		await onSetFulfillmentType(fulfillmentTypeInput);
	};

  setShippingAddress = async (address) => {
    const { checkoutMutations: { onSetShippingAddress } } = this.props;
    delete address.isValid;
    const { data, error } = await onSetShippingAddress(address);

    if (data && !error && this._isMounted) {
      this.setState({
        actionAlerts: {
          1: {}
        }
      });
    }
  };

  setPickupDetails = async (details) => {
    const { checkoutMutations: { onSetPickupDetails } } = this.props;

    const { data, error } = await onSetPickupDetails(details);

    if (data && !error && this._isMounted) {
      this.setState({
        actionAlerts: {
          1: {}
        }
      });
    }
  };


  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;    
  }

  buildData = ({ step, action }) => ({
    action,
    payment_method: this.paymentMethod, // eslint-disable-line camelcase
    shipping_method: this.shippingMethod, // eslint-disable-line camelcase
    step
  });

  get shippingMethod() {
    const { checkout: { fulfillmentGroups } } = this.props.cart;
    const { selectedFulfillmentOption } = fulfillmentGroups[0];
    return selectedFulfillmentOption ? selectedFulfillmentOption.fulfillmentMethod.displayName : null;
  }

  get paymentMethod() {
    const [firstPayment] = this.props.cartStore.checkoutPayments;
    return firstPayment ? firstPayment.payment.method : null;
  }

  get getAddresses() {
    const { cart } = this.props;
    const {
      checkout: { fulfillmentGroups, summary },
      items,
    } = cart;
    const addresses = fulfillmentGroups.reduce((list, group) => {
      if (group.shippingAddress) list.push(group.shippingAddress);
      return list;
    }, []);
    return addresses;
  }

  handleInputBillingComponentSubmit = async () => {
    const { invoiceInputs } = this.state;
    const cloneInvoice = Object.assign({}, invoiceInputs);
    if (!invoiceInputs.isCf) {
      cloneInvoice.name = (cloneInvoice.name) ? cloneInvoice.name.trim() : "";
      cloneInvoice.name = formatName(cloneInvoice.name);
      cloneInvoice.nit = (cloneInvoice.nit) ? cloneInvoice.nit.trim() : "";
      cloneInvoice.address = (cloneInvoice.address) ? cloneInvoice.address.trim() : "";
      cloneInvoice.address = formatName(cloneInvoice.address);
      cloneInvoice.depto = (cloneInvoice.depto) ? cloneInvoice.depto.trim() : "";
      cloneInvoice.depto = formatName(cloneInvoice.depto);
      cloneInvoice.city = (cloneInvoice.city) ? cloneInvoice.city.trim() : "";
      cloneInvoice.city = formatName(cloneInvoice.city);

      if (cloneInvoice.nit == "") {
        throw new CheckoutError({
          actionCode: 5,
          title: "Error de facturación",
          message: "Asegúrate de haber llenado el nit a facturar"
        });
      }
      if (cloneInvoice.name == "") {
        throw new CheckoutError({
          actionCode: 5,
          title: "Error de facturación",
          message: "Asegúrate de haber llenado el nombre a facturar"
        });
      }
    }
    this.handleBillingSubmit(cloneInvoice);
  }

  handleInputComponentSubmit = async () => {
    const {
      paymentInputs: { data, displayName, billingAddress, selectedPaymentMethodName, amount = null },
    } = this.state;
    const { paymentMethods, remainingAmountDue } = this.props;
    let addresses = this.getAddresses;
    let bAddress = billingAddress || (addresses && addresses[0]) ? addresses[0] : null;
    const selectedPaymentMethod = paymentMethods.find((method) => method.name === selectedPaymentMethodName);

    console.log("selectedPaymentMethodName", selectedPaymentMethodName);
    let cappedPaymentAmount = amount;
    if (cappedPaymentAmount && typeof remainingAmountDue === "number") {
      cappedPaymentAmount = Math.min(cappedPaymentAmount, remainingAmountDue);
    }
    Object.keys(data).forEach((key) => {
      if (data[key] == null)
        throw new CheckoutError({
          actionCode: 4,
          title: "Error de pago",
          message: "Asegúrate de haber llenado todos los campos de pago",
        });
    });
    this.handlePaymentSubmit({
      displayName: displayName,
      payment: {
        amount: cappedPaymentAmount,
        billingAddress: bAddress,
        data,
        method: selectedPaymentMethodName,
      },
    });
  };

  handleValidationErrors() {
    const { addressValidationResults } = this.props;
    const { validationErrors } = addressValidationResults || [];
    const shippingAlert =
      validationErrors && validationErrors.length ? {
        alertType: validationErrors[0].type,
        title: validationErrors[0].summary,
        message: validationErrors[0].details
      } : null;
    this.setState({ actionAlerts: { 1: shippingAlert } });
  }

  setShippingMethod = async (shippingMethod) => {
    const { checkoutMutations: { onSetFulfillmentOption } } = this.props;
    const { checkout: { fulfillmentGroups } } = this.props.cart;
    const fulfillmentOption = {
      fulfillmentGroupId: fulfillmentGroups[0]._id,
      fulfillmentMethodId: shippingMethod.selectedFulfillmentOption.fulfillmentMethod._id
    };

    await onSetFulfillmentOption(fulfillmentOption);
  };

  handlePaymentSubmit = (paymentInput) => {
    this.props.cartStore.addCheckoutPayment(paymentInput);

    this.setState({
      hasPaymentError: false,
      actionAlerts: {
        3: {}
      }
    });
  };

  handlePaymentsReset = () => {
    this.props.cartStore.resetCheckoutPayments();
  }

  buildOrder = async () => {
    const { cart, cartStore, orderEmailAddress } = this.props;
    const cartId = cartStore.hasAccountCart ? cartStore.accountCartId : cartStore.anonymousCartId;
    const { checkout } = cart;

    console.log("building order");
    try {
      //await this.handleInputPickupComponentSubmit();
      //await this.handleInputShippingComponentSubmit();
      await this.handleInputComponentSubmit();
      const fulfillmentGroups = checkout.fulfillmentGroups.map((group) => {
        const { data } = group;
        let { selectedFulfillmentOption } = group;
        console.log('compra del carrito ', cart.items)
        const items = cart.items.map((item) => ({
          addedAt: item.addedAt,
          price: item.price.amount,
          productConfiguration: item.productConfiguration,
          quantity: item.quantity,
          metafields: item.metafields || [],
        }));
        if (!selectedFulfillmentOption || selectedFulfillmentOption == null) {
          throw new CheckoutError({
            message: "La dirección seleccionada está fuera del rango de envío",
            actionCode: 6,
            title: "Error de envío",
          });
        }
        return {
          data,
          items,
          selectedFulfillmentMethodId: selectedFulfillmentOption.fulfillmentMethod._id,
          shopId: group.shop._id,
          totalPrice: checkout.summary.total.amount,
          type: group.type,
        };
      });
      const order = {
        cartId,
        currencyCode: checkout.summary.total.currency.code,
        email: orderEmailAddress,
        fulfillmentGroups,
        shopId: cart.shop._id,
      };

      return this.setState({ isPlacingOrder: true }, () => this.placeOrder(order));
    } catch (error) {
      console.error(error.message)
      this.setState({
        hasPaymentError: true,
        hasBillingError: true,
        hasGiftError: true,
        isPlacingOrder: false,
        actionAlerts: {
          [error.actionCode]: {
            alertType: "error",
            title: error.title,
            message: error.message,
          },
        },
      });
    }
  };

  placeOrder = async (order) => {
    const { cartStore, clearAuthenticatedUsersCart, apolloClient } = this.props;
    console.log("placing order...")
    // Payments can have `null` amount to mean "remaining".
    let remainingAmountDue = order.fulfillmentGroups.reduce((sum, group) => sum + group.totalPrice, 0);
    const payments = cartStore.checkoutPayments.map(({ payment }) => {
      const amount = payment.amount ? Math.min(payment.amount, remainingAmountDue) : remainingAmountDue;
      remainingAmountDue -= amount;
      return { ...payment, amount };
    });
    const billing = cartStore.checkoutBilling;
    const giftNote = cartStore.checkoutGift;
    try {
      let data = null;
      await this.mutex.runExclusive(async function () {
        const resApolloClient = await apolloClient.mutate({
          mutation: placeOrderMutation,
          variables: {
            input: {
              order,
              payments,
              billing,
              giftNote,
            },
          },
        });
        data = resApolloClient.data;
      });

      // Placing the order was successful, so we should clear the
      // anonymous cart credentials from cookie since it will be
      // deleted on the server.
      cartStore.clearAnonymousCartCredentials();
      clearAuthenticatedUsersCart();

      // Also destroy the collected and cached payment input
      cartStore.resetCheckoutPayments();

      const {
        placeOrder: { orders, token },
      } = data;
      // Send user to order confirmation page
      Router.push(`/checkout/order?orderId=${orders[0].referenceId}${token ? `&token=${token}` : ""}`);
    } catch (error) {
      console.error("placing order error: ", error.message);
      if (this._isMounted) {
        this.handlePaymentsReset();
        this.setState({
          hasPaymentError: true,
          isPlacingOrder: false,
          actionAlerts: {
            4: {
              alertType: "error",
              title: "Payment method failed",
              message: error.toString().replace("Error: GraphQL error:", ""),
            },
          },
        });
      }
    }
  };

  renderPlacingOrderOverlay = () => {
    const { isPlacingOrder } = this.state;

    return (
      <Dialog fullScreen disableBackdropClick={true} disableEscapeKeyDown={true} open={isPlacingOrder}

      >
        <PageLoading delay={0} message="Placing your order..." />
      </Dialog>
    );
  };

  render() {
    const {
      addressValidation,
      addressValidationResults,
      cart,
      cartStore,
      paymentMethods,
      authStore,
      components: { Button },
      classes
    } = this.props;

    const { checkout: { fulfillmentGroups, summary }, items } = cart;
    const { actionAlerts, hasPaymentError } = this.state;
    const [fulfillmentGroup] = fulfillmentGroups;

    // Order summary
    const { fulfillmentTotal, itemTotal, surchargeTotal, taxTotal, total } = summary;
    const checkoutSummary = {
      displayShipping: fulfillmentTotal && fulfillmentTotal.displayAmount,
      displaySubtotal: itemTotal.displayAmount,
      displaySurcharge: surchargeTotal.displayAmount,
      displayTotal: total.displayAmount,
      displayTax: taxTotal && taxTotal.displayAmount,
      items
    };

    const addresses = fulfillmentGroups.reduce((list, group) => {
      if (group.shippingAddress) list.push(group.shippingAddress);
      return list;
    }, []);

    const payments = cartStore.checkoutPayments.slice();
    const remainingAmountDue = calculateRemainderDue(payments, total.amount);

    let PaymentComponent = PaymentsCheckoutAction;
    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      PaymentComponent = NoPaymentMethodsMessage;
    }

    const actions = [
      {
        id: "1",
        activeLabel: "Elige un método de entrega",
        completeLabel: "Método de entrega",
        incompleteLabel: "Método de entrega",
        status: fulfillmentGroup.type !== "shipping" || fulfillmentGroup.shippingAddress ? "complete" : "incomplete",
        component: FulfillmentTypeAction,
        onSubmit: this.setShippingAddress,
        props: {
          alert: actionAlerts["1"],
          deliveryMethods,
          fulfillmentGroup,
          actionAlerts: {
            "2": actionAlerts["2"],
            "3": actionAlerts["3"],
          },
          submits: {
            onSubmitShippingAddress: this.setShippingAddress,
            // onSetShippingMethod: this.setShippingMethod,
            onSelectFulfillmentType: this.setFulfillmentType,
            onSubmitPickupDetails: this.setPickupDetails
          }
        }
      },
      {
        id: "4",
        activeLabel: "Elige cómo pagarás tu orden",
        completeLabel: "Payment information",
        incompleteLabel: "Payment information",
        status: remainingAmountDue === 0 && !hasPaymentError ? "complete" : "incomplete",
        component: PaymentMethodCheckoutAction,
        onSubmit: this.handlePaymentSubmit,
        props: {
          addresses,
          alert: actionAlerts["4"],
          onReset: this.handlePaymentsReset,
          payments,
          paymentMethods,
          remainingAmountDue,
          summary,
					onChange: this.setPaymentInputs,          
        }
      },
      {
        id: "5",
        activeLabel: "Datos de facturación",
        completeLabel: "Datos de facturación",
        incompleteLabel: "Datos de facturación",
        status: remainingAmountDue === 0 && !hasPaymentError ? "complete" : "incomplete",
        component: BillingCheckoutAction,
        onSubmit: this.handleBillingSubmit,
        props: {
          alert: actionAlerts["5"],
          onChange: this.setInvoiceInputs,
          authStore,
          isCf: this.state.invoiceInputs.isCf,
          nitValue: this.state.invoiceInputs.nit,
          nameValue: this.state.invoiceInputs.name,
          addressValue: this.state.invoiceInputs.address
        }
      },
    ];
    return (
      <Fragment>
        {this.renderPlacingOrderOverlay()}
        <Actions actions={actions} />

        <ButtonContent>
          <Button
            className={classes.BotonPrincipal}
            isFullWidth
            onClick={this.buildOrder}
          >
            Realizar Compra
          </Button>
        </ButtonContent>
      </Fragment>
    );
  }
}

export default withComponents(withStyles(styles)(withAddressValidation(CheckoutActions)));