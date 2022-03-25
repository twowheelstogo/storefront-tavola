import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import inject from "hocs/inject";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import { ShoppingOutline } from "mdi-material-ui";
import Router from "translations/i18nRouter";
import Badge from "@material-ui/core/Badge";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import withCart from "containers/cart/withCart";
import { withComponents } from "@reactioncommerce/components-context";

const styles = ({ palette, zIndex }) => ({
  BotonPrincipal: {
    backgroundColor: palette.secondary.botones,
    color: palette.colors.BotonColor,
    borderColor: palette.secondary.botones,
    fontWeight: "800",
    fontSize: "18px"
  },
  Compra: {
    color: palette.colors.buttonBorderColor,
    ["@media (min-width:600px)"]: {
      width: "35px",
      height: "35px",
    },
    ["@media (max-width:599px)"]: {
      width: "25px",
      height: "25px",
    },
  },
  popper: {
    marginTop: "0.5rem",
    marginRight: "1rem",
    zIndex: zIndex.modal
  },
  cart: {
    backgroundColor: palette.common.white
  },
  emptyCart: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 360,
    height: 320,
    border: palette.borders.default
  },
  badge: {
    width: 20,
    height: 20,
    ["@media (min-width:600px)"]: {
      left: 20,
      top: 10,
    },
    ["@media (max-width:599px)"]: {
      left: 7,
      top: 5,
    },
    background: palette.primary.main,
    color: palette.primary.light,
  },
});

class MiniCart extends Component {
  static propTypes = {
    cart: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
      checkout: PropTypes.shape({
        itemTotal: PropTypes.shape({
          displayAmount: PropTypes.string
        }),
        taxTotal: PropTypes.shape({
          displayAmount: PropTypes.string
        })
      })
    }),
    classes: PropTypes.object.isRequired,
    hasMoreCartItems: PropTypes.bool,
    loadMoreCartItems: PropTypes.func,
    onChangeCartItemsQuantity: PropTypes.func,
    onRemoveCartItems: PropTypes.func,
    uiStore: PropTypes.shape({
      isCartOpen: PropTypes.bool.isRequired,
      openCart: PropTypes.func.isRequired,
      closeCart: PropTypes.func.isRequired
    })
  }

  constructor(props) {
    super(props);

    this.setPopoverAnchorEl = (element) => {
      this.anchorElement = element;
    };
  }

  state = {
    anchorElement: null
  };

  anchorElement = null

  handlePopperOpen = () => {
    const { uiStore: { openCart } } = this.props;
    openCart();
  }

  handleClick = () => Router.push("/");

  handleCheckoutButtonClick = () => {
    this.handleLeavePopper();
    Router.push("/cart/checkout");
  }

  handlePopperClose = () => {
    const { closeCart } = this.props.uiStore;
    closeCart(0);
  }

  handleEnterPopper = () => {
    const { openCart } = this.props.uiStore;
    openCart();
  }

  handleLeavePopper = () => {
    const { closeCart } = this.props.uiStore;
    closeCart();
  }

  handleOnClick = () => {
    const { closeCart } = this.props.uiStore;
    closeCart();
    Router.push("/cart");
  }

  handleItemQuantityChange = (quantity, cartItemId) => {
    const { onChangeCartItemsQuantity } = this.props;

    onChangeCartItemsQuantity({ quantity, cartItemId });
  }

  handleRemoveItem = async (itemId) => {
    const { onRemoveCartItems } = this.props;
    await onRemoveCartItems(itemId);
  };

  renderMiniCart() {
    const { cart, classes, hasMoreCartItems, loadMoreCartItems,
      components: { MiniCartComponent, CartItems, CartEmptyMessage, Button } } = this.props;

    if (cart && Array.isArray(cart.items) && cart.items.length) {
      return (
        <MiniCartComponent
          cart={cart}
          onCheckoutButtonClick={this.handleCheckoutButtonClick}
          components={{
            QuantityInput: "div",
            CartItems: (cartItemProps) => (
              <CartItems
                {...cartItemProps}
                hasMoreCartItems={hasMoreCartItems}
                onRemoveItemFromCart={this.handleRemoveItem}
                onChangeCartItemQuantity={this.handleItemQuantityChange}
                onLoadMoreCartItems={loadMoreCartItems}
              />
            ),
            CartCheckoutButton: (cartCheckoutProps) => (
              <Button
                className={classes.BotonPrincipal}
                {...cartCheckoutProps} isFullWidth>{"Proceder a la compra - " + cart.checkout.summary.itemTotal.displayAmount}</Button>
            )
          }}
        />
      );
    }

    return (
      <div className={classes.emptyCart}>
        <div>
          <CartEmptyMessage onClick={this.handleClick} />
        </div>
      </div>
    );
  }

  render() {
    const { cart, classes, uiStore } = this.props;
    const { isCartOpen } = uiStore;
    const id = (isCartOpen) ? "simple-popper" : null;

    return (
      <Fragment>
        <div ref={this.setPopoverAnchorEl}>
          <IconButton color="inherit"
            onMouseEnter={this.handlePopperOpen}
            onMouseLeave={this.handlePopperClose}
            onClick={this.handleOnClick}
          >
            {(cart && cart.totalItemQuantity > 0)
              ? (
                <Badge
                  badgeContent={cart.totalItemQuantity}
                  classes={{
                    badge: classes.badge
                  }}
                >
                  <ShoppingOutline className={classes.Compra} />
                </Badge>
              ) : (
                <ShoppingOutline className={classes.Compra} />
              )}
          </IconButton>
        </div>

        <Popper
          className={classes.popper}
          id={id}
          open={isCartOpen}
          anchorEl={this.anchorElement}
          transition
          onMouseEnter={this.handleEnterPopper}
          onMouseLeave={this.handleLeavePopper}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <div className={classes.cart}>
                {this.renderMiniCart()}
              </div>
            </Fade>
          )}
        </Popper>
      </Fragment>
    );
  }
}

export default withComponents(withStyles(styles, { name: "SkMiniCart" })(withCart(inject("uiStore")(MiniCart))));