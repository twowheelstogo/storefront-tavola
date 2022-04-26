import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash.isempty";
import { withComponents } from "@reactioncommerce/components-context";
import { addressToString, CustomPropTypes } from "@reactioncommerce/components/utils";
const NORMAL = "normal";
const REVIEW = "review";

class AddressBook extends Component {
  static propTypes = {
    /**
     * User account data.
     */
    account: PropTypes.shape({
      /**
       * Users saved addresses
       */
      addressBook: CustomPropTypes.addressBook,
    }),
    /**
     * The text for the "Add a new address" text, if it is shown.
     */
    addNewItemButtonText: PropTypes.string,
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * If you've set up a components context using @reactioncommerce/components-context
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      /**
       * Pass either the Reaction AccordionFormList component or your own component that
       * accepts compatible props.
       */
      AccordionFormList: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction AddressForm component or your own component that
       * accepts compatible props.
       */
      AddressForm: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction AddressReview component or your own component that
       * accepts compatible props.
       */
      AddressReview: CustomPropTypes.component.isRequired,
    }).isRequired,
    /**
     * The text for the "Delete address" text, if it is shown.
     */
    deleteItemButtonText: PropTypes.string,
    /**
     * The text for the "Save Changes" text, if it is shown.
     */
    entryFormSubmitButtonText: PropTypes.string,
    /**
     * Is data being saved
     */
    isSaving: PropTypes.bool,
    /**
     * Handles new address added to address book
     */
    onAddressAdded: PropTypes.func,
    /**
     * Handles address deletion from address book
     */
    onAddressDeleted: PropTypes.func,
    /**
     * Handles editing address in address book
     */
    onAddressEdited: PropTypes.func,
    /**
     * Validated entered value for the AddressReview
     */
    validatedValue: PropTypes.object,
    /**
     * Value for the AddressFrom
     */
    value: PropTypes.object,
  };

  static defaultProps = {
    account: {
      addressBook: [],
    },
    addNewItemButtonText: "Add a new address",
    deleteItemButtonText: "Delete address",
    entryFormSubmitButtonText: "Save Changes",
    isSaving: false,
    onAddressAdded() {},
    onAddressDeleted() {},
    onAddressEdited() {},
    validatedValue: {},
    value: {},
  };

  state = {
    status: this.currentStatus,
  };

  _addressReview = null;
  _accordionFormList = null;

  //
  // Helper Methods
  //
  get currentStatus() {
    // eslint-disable-next-line
    return isEmpty(this.props.validatedValue) ? NORMAL : REVIEW;
  }

  get hasAddress() {
    const {
      account: { addressBook },
    } = this.props;
    return !isEmpty(addressBook);
  }

  //
  // Handler Methods
  //
  handleAddAddress = async (value) => {
    const { onAddressAdded } = this.props;
    await onAddressAdded(value);
    if (this._accordionFormList) {
      this._accordionFormList.showList();
    }
  };

  handleDeleteAddress = async (id) => {
    const { onAddressDeleted } = this.props;
    await onAddressDeleted(id);
  };

  handleEditAddress = async (value, _id) => {
    const { onAddressEdited } = this.props;
    await onAddressEdited(_id, value);
    if (this._accordionFormList) {
      this._accordionFormList.toggleAccordionForItem(_id);
    }
  };

  //
  // Render Methods
  //
  renderAccordionFormList() {
    const {
      account: { addressBook },
      addNewItemButtonText,
      components: { AccordionFormListCustom, AddressForm },
      deleteItemButtonText,
      entryFormSubmitButtonText,
      isSaving,
    } = this.props;

    const items = addressBook.map((input) => {
      console.info("addressBook inputs", input);
      input = {
        country: "gt",
        city: ".",
        postal: ".",
        address1: ".",
        fullName: "...",
        region: ".",
        phone: "+3200000000",
        ...input,
      };

      const { _id, ...address } = input;
      return {
        id: _id,
        detail: addressToString(address),
        address: input,
        itemEditFormProps: {
          isOnDarkBackground: true,
          isSaving,
          onSubmit: (value) => {
            this.handleEditAddress(value, _id);
          },
          value: address,
        },
        label: address.fullName,
      };
    });

    const itemAddFormProps = {
      isSaving,
      onSubmit: this.handleAddAddress,
    };

    return (
      <div>
        <AccordionFormListCustom
          {...this.props}
          addNewItemButtonText={addNewItemButtonText}
          components={{ ItemAddForm: AddressForm, ItemEditForm: AddressForm }}
          deleteItemButtonText={deleteItemButtonText}
          entryFormSubmitButtonText={entryFormSubmitButtonText}
          itemAddFormProps={itemAddFormProps}
          items={items}
          onItemDeleted={this.handleDeleteAddress}
          ref={(instance) => {
            this._accordionFormList = instance;
          }}
        />
      </div>
    );
  }

  renderAddressReview() {
    const {
      components: { AddressReview },
      value,
      validatedValue,
    } = this.props;
    return (
      <AddressReview
        {...this.props}
        ref={(el) => {
          this._addressReview = el;
        }}
        addressEntered={value}
        addressSuggestion={validatedValue}
      />
    );
  }

  render() {
    const { className } = this.props;
    const { status } = this.state;
    return (
      <div style={{ width: "100%" }} className={className}>
        {status === REVIEW ? this.renderAddressReview() : this.renderAccordionFormList()}
      </div>
    );
  }
}

export default withComponents(AddressBook);
