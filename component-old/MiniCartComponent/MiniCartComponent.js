import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { addTypographyStyles, applyTheme, CustomPropTypes } from "@reactioncommerce/components/utils";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const styles = (theme) => ({
   Inicio: {
      height: "75px",
      fontSize: "24px",
      fontWeight: "800",
      lineHeight: "19px",
      width: "100%",
      display: "flex",
      alignItems: "center",
      backgroundColor: theme.palette.background.Carrito,
      color: theme.palette.colors.TextTheme,
   },
   Titulo: {
      marginLeft: "10px",
      color: theme.palette.colors.TextThemeTitle,
   },
   BotonPrincipal: {
      backgroundColor: theme.palette.secondary.botones,
      color: theme.palette.colors.BotonColor,
      borderColor: theme.palette.secondary.botones,
      height: "50px",
      fontWeight: "800",
   },
   SubTotal_: {
      fontSize: "17px",
      color: theme.palette.colors.TextTheme,
   },
   Total_: {
      fontSize: "18px",
      fontWeight: "800",
      color: theme.palette.colors.TextTheme,
      marginTop: "-5px"
   },
   Cart_: {
      backgroundColor: theme.palette.background.CartColor,
      color: theme.palette.colors.TextTheme,
   }
});

const Cart = styled.div`
  border-bottom-color: ${applyTheme("MiniCart.borderBottomColor")};
  border-bottom-style: solid;
  border-bottom-width: ${applyTheme("MiniCart.borderBottomWidth")};
  border-left-color: ${applyTheme("MiniCart.borderLeftColor")};
  border-left-style: solid;
  border-left-width: ${applyTheme("MiniCart.borderLeftWidth")};
  border-right-color: ${applyTheme("MiniCart.borderRightColor")};
  border-right-style: solid;
  border-right-width: ${applyTheme("MiniCart.borderRightWidth")};
  border-top-color: ${applyTheme("MiniCart.borderTopColor")};
  border-top-style: solid;
  border-top-width: ${applyTheme("MiniCart.borderTopWidth")};
  max-width: ${applyTheme("MiniCart.maxWidth")};
  overflow: hidden;
`;

const Items = styled.div`
  max-height: ${applyTheme("MiniCart.listHeightToBeginScrolling")};
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: ${applyTheme("MiniCart.listPaddingBottom")};
  padding-left: ${applyTheme("MiniCart.listPaddingLeft")};
  padding-right: ${applyTheme("MiniCart.listPaddingRight")};
  padding-top: ${applyTheme("MiniCart.listPaddingTop")};
`;

const Footer = styled.div`
  border-top-color: ${applyTheme("MiniCartFooter.borderTopColor")};
  border-top-style: 1px solid;
  border-top-width: ${applyTheme("MiniCartFooter.borderTopWidth")};
  box-shadow: ${({ count }) =>
      (count > 2 ? applyTheme("MiniCartFooter.boxShadow_overflow") : applyTheme("MiniCartFooter.boxShadow"))};
  padding-bottom: ${applyTheme("MiniCartFooter.paddingBottom")};
  padding-left: ${applyTheme("MiniCartFooter.paddingLeft")};
  padding-right: ${applyTheme("MiniCartFooter.paddingRight")};
  padding-top: ${applyTheme("MiniCartFooter.paddingTop")};
  position: relative;
`;

const FooterMessage = styled.span`
  ${addTypographyStyles("MiniCartFooterMessage", "captionText")} display: block;
  padding-bottom: ${applyTheme("MiniCartFooterMessage.paddingBottom")};
  padding-left: ${applyTheme("MiniCartFooterMessage.paddingLeft")};
  padding-right: ${applyTheme("MiniCartFooterMessage.paddingRight")};
  padding-top: ${applyTheme("MiniCartFooterMessage.paddingTop")};
  text-align: start;
`;

class MiniCartComponent extends Component {
   static propTypes = {
      /**
    * Cart data
    */
      cart: PropTypes.shape({
         /**
     * Cart checkout info
     */
         checkout: PropTypes.shape({
            /**
     * Checkout summary
     */
            summary: PropTypes.shape({
               /**
      * Checkout summary item total info
      */
               itemTotal: PropTypes.shape({
                  /**
      * Checkout summary item total display amount
      */
                  displayAmount: PropTypes.string
               }),
               /**
      * Checkout summary tax info
      */
               taxTotal: PropTypes.shape({
                  /**
      * Checkout summary tax display amount
      */
                  displayAmount: PropTypes.string
               })
            })
         }),
         /**
     * CartItem data. This is passed to CartItems, which may require some props.
     */
         items: PropTypes.arrayOf(PropTypes.object).isRequired
      }),
      /**
    * The text for the "Checkout" button text.
    */
      checkoutButtonText: PropTypes.string,
      /**
    * You can provide a `className` prop that will be applied to the outermost DOM element
    * rendered by this component. We do not recommend using this for styling purposes, but
    * it can be useful as a selector in some situations.
    */
      className: PropTypes.string,
      /**
    * If you've set up a components context using
    * [@reactioncommerce/components-context](https://github.com/reactioncommerce/components-context)
    * (recommended), then this prop will come from there automatically. If you have not
    * set up a components context or you want to override one of the components in a
    * single spot, you can pass in the components prop directly.
    */
      components: PropTypes.shape({
         /**
     * Pass either the Reaction Button component or your own component that
     * accepts compatible props.
     */
         Button: CustomPropTypes.component,
         /**
     * An element to show as the cart checkout button. If this isn't provided,
     * a button will be rendered using Button component.
     */
         CartCheckoutButton: CustomPropTypes.component,
         /**
     * Pass either the Reaction CartItems component or your own component that
     * accepts compatible props.
     */
         CartItems: CustomPropTypes.component.isRequired,
         /**
     * Pass either the Reaction MiniCartSummary component or your own component that
     * accepts compatible props.
     */
         MiniCartSummary: CustomPropTypes.component.isRequired
      }),
      /**
    * The text for the "Shipping and tax calculated in checkout" message text.
    */
      footerMessageText: PropTypes.string,
      /**
    * On cart item quantity change handler
    */
      onChangeCartItemQuantity: PropTypes.func,
      /**
    * On default checkout button click. Not used if a custom button is supplied by `components.CartCheckoutButton`
    */
      onCheckoutButtonClick: PropTypes.func,
      /**
    * On remove item from cart handler
    */
      onRemoveItemFromCart: PropTypes.func,
      /**
    * Product URL path to be prepended before the slug
    */
      productURLPath: PropTypes.string
   };

   static defaultProps = {
      onChangeCartItemQuantity() { },
      onCheckoutButtonClick() { },
      onRemoveItemFromCart() { },
      checkoutButtonText: "Checkout",
      footerMessageText: "Envío calculado en el proceso de compra"
   };

   static propTypes = {
      classes: PropTypes.object,
   };

   static defaultProps = {
      classes: {},
   };


   render() {
      const {
         cart: { checkout: { summary }, items },
         className,
         classes,
         checkoutButtonText,
         components: { Button, CartCheckoutButton, CartItems, MiniCartSummary },
         footerMessageText,
         onCheckoutButtonClick,
         ...props
      } = this.props;

      return (
         <Cart className={classes.Cart_}>
            <div className={classes.Inicio}>
               <div className={classes.Titulo}>Mi Carrito</div>
            </div>

            <Items>
               <CartItems items={items} {...props} isMiniCart />
               {/* <CartItem*/}
            </Items>
            <Footer count={items.length}>
               <Grid xs={12} md={12} lg={12}>
                  <Grid xs={12} md={12} lg={12} container style={{ marginLeft: "auto", marginRight: "auto" }}>

                     <Grid item xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "flex-start" }}>
                        <p className={classes.SubTotal_}>Subtotal</p>
                     </Grid>
                     <Grid item xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <p className={classes.SubTotal_}>{summary.itemTotal.displayAmount}</p> </Grid>


                     <Grid item xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "flex-start" }}>
                        <p className={classes.Total_}>Total</p>
                     </Grid>
                     <Grid item xs={6} md={6} lg={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <p className={classes.Total_}>{summary.total.displayAmount}</p> </Grid>
                  </Grid>

               </Grid>
               {/* {"Total " + summary.total.displayAmount} */}
               {(CartCheckoutButton && <CartCheckoutButton onClick={onCheckoutButtonClick} />) || (
                  <Button actionType="important" isFullWidth onClick={onCheckoutButtonClick}>
                     {checkoutButtonText}
                  </Button>
               )}
               <FooterMessage>{footerMessageText}</FooterMessage>
            </Footer>
         </Cart>
      );
   }
}

export default withComponents(withStyles(styles)(MiniCartComponent));