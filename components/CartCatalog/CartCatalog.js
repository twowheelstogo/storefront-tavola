import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes } from "@reactioncommerce/components/utils";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Box, Button } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import inject from "hocs/inject";
import withCart from "containers/cart/withCart";

const ItemContentQuantityInput = styled.div`
  bottom: 0;
  right: 0;
  width: 100%;
  margin: 0 auto;
  position: absolute;
  padding-bottom: 10px;
  text-align: right;
  max-width: 125px;
  padding-right:5px
`;
const Catalog = styled.div`
  display: table;
  width: 100%;
`;

const CatalogContent = styled.div`
  display: table;
`;

const CatalogContentDetail = styled.div`
  display: table-cell;
  position: relative;
`;

const CatalogContentDetailInner = styled.div``;

const CatalogContentDetailInfo = styled.div``;

const CatalogContentQuantityInput = styled.div`
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0 auto;
  position: absolute;
  padding-bottom: 10px;
`;

const CatalogContentPrice = styled.div`
  display: table-cell;
  position: relative;
  text-align: right;
  padding-bottom: 20px;
  padding-top: 20px;
  padding-left: 40px;
`;

const CatalogContentSubtotal = styled.div`
font-size: 14px; 
font-weight: 700;
}`;

const CatalogContentSubtotalTitle = styled.div`
  padding-left: 100px;
`;

class CartCatalog extends Component {
  static propTypes = {
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
       * Pass either the Reaction CartCatalogDetail component or your own component that
       * accepts compatible props.
       */
      CartCatalogDetail: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction Price component or your own component that
       * accepts compatible props.
       */
      Price: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction QuantityInput component or your own component that
       * accepts compatible props.
       */
      QuantityInput: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction StockWarning component or your own component that
       * accepts compatible props.
       */
      StockWarning: CustomPropTypes.component.isRequired,
    }).isRequired,
    /**
     * Is in a MiniCart component
     */
    isMiniCart: PropTypes.bool,
    /**
     * Hide remove button and quantity input
     */
    isReadOnly: PropTypes.bool,
    /**
     * CartCatalog data
     */
    catalog: PropTypes.shape({
      /**
       * The cart catalog ID
       */
      _id: PropTypes.string,
      /**
       * Array of additional attributes of the chosen catalog.
       */
      attributes: PropTypes.arrayOf(PropTypes.object),
      /**
       * The current compareAt price (MSRP)
       */
      compareAtPrice: PropTypes.shape({
        /**
         * The display price
         */
        displayAmount: PropTypes.string.isRequired,
      }),
      /**
       * Current stock quantity of catalog
       */
      currentQuantity: PropTypes.number,
      /**
       * Image URLs of chosen catalog
       */
      imageURLs: PropTypes.shape({
        large: PropTypes.string,
        medium: PropTypes.string,
        original: PropTypes.string,
        small: PropTypes.string,
        thumbnail: PropTypes.string,
      }),
      /**
       * Is the chosen catalog have a low quantity
       */
      isLowQuantity: PropTypes.bool,
      /**
       * Price object of chosen catalog
       */
      price: PropTypes.shape({
        /**
         * The display price
         */
        displayAmount: PropTypes.string.isRequired,
      }).isRequired,
      /**
       * Chosen catalogs slug
       */
      productSlug: PropTypes.string,
      /**
       * Chosen catalogs vendor
       */
      productVendor: PropTypes.string,
      /**
       * Chosen catalogs title
       */
      subtotal: PropTypes.shape({
        /**
         * The display subtotal
         */
        displayAmount: PropTypes.string,
      }),
      title: PropTypes.string,
      /**
       * Quantity of chosen catalog in cart
       */
      quantity: PropTypes.number,
    }),
    /**
     * On cart catalog quantity change handler
     */
    onChangeCartCatalogQuantity: PropTypes.func,
    /**
     * On remove catalog from cart handler
     */
    onRemoveCatalogFromCart: PropTypes.func,
    /**
     * Product URL path to be prepended before the slug
     */
    productURLPath: PropTypes.string,
    /**
     * Text to display inside the remove button
     */
    removeText: PropTypes.string,
    /**
     * The text for the "Total" title text.
     */
    totalText: PropTypes.string,
  };

  static defaultProps = {
    isMiniCart: false,
    isReadOnly: false,
    onChangeCartCatalogQuantity() { },
    onRemoveCatalogFromCart() { },
    removeText: "Remove",
    totalText: "Total",
  };

  state = {
    isProcessing: false,
  };

  handleChangeCartCatalogQuantity = (value) => {
    const {
      onChangeCartCatalogQuantity,
      catalog: { _id },
    } = this.props;
    onChangeCartCatalogQuantity(value, _id);
  };

  handleRemoveCatalogFromCart = () => {
    const {
      onRemoveCatalogFromCart,
      catalog: { _id },
    } = this.props;
    onRemoveCatalogFromCart(_id);
  };

  renderImage() {
    const {
      isMiniCart,
      catalog: { imageURLs, productSlug },
      productURLPath,
    } = this.props;

    const { small, thumbnail } = imageURLs || {};

    if (!small || !thumbnail) return null;

    return (
      <a href={[productURLPath, productSlug].join("")}>
        <picture>
          {isMiniCart ? "" : <source srcSet={small} media="(min-width: 768px)" />}
          <img src={thumbnail} alt="" style={{ display: "block" }} />
        </picture>
      </a>
    );
  }

  render() {
    const {
      className,
      components,
      isMiniCart,
      isReadOnly,
      productURLPath,
      catalog: { _id, title, quantity, subtotal, items, currentQuantity },
      totalText,
    } = this.props;

    const { displayAmount: displaySubtotal } = subtotal || {};
    // const { displayAmount: displayCompareAtPrice } = compareAtPrice || {};
    const { CartCatalogDetail, Price, StockWarning, CartItems, CartItem, QuantityInput, CartItemDetail } =
      components || {};
    return (
      <Catalog style={{ borderBottom: "1px solid #dcdcdc" }} className={className}>
        <Accordion style={{ margin: 0 }}>
          <AccordionSummary
            style={{ background: "#F6F6F6" }}
            expandIcon={<ExpandMoreIcon style={{ background: "#1D0D13", color: "white", borderRadius: "20px" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <div style={{ display: "flex", width: "100%" }}>
              <div style={{ width: "200px" }}>
                <Typography style={{ color: "#1D0D13", fontSize: "18px", fontWeight: 800 }}>
                  <small>{quantity} x </small>
                  {title || _id}
                </Typography>
              </div>
            </div>
            <div>{displaySubtotal}</div>
          </AccordionSummary>
          <AccordionDetails style={{ padding: "25px 20px" }}>
            <Box>


              <Box>
                {items
                  .filter((h) => !h.isHidden)
                  .map((item) => (
                    <div>
                      <CartItemDetail
                        key={item._id}
                        quantityProduct={item.quantity}
                        attributes={item.attributes}
                        isMiniCart={isMiniCart}
                        productURLPath={productURLPath}
                        productSlug={item.productSlug}
                        productVendor={item.productVendor}
                        quantity={isReadOnly ? quantity : null}
                        title={(item.attributes && item.attributes[0].label) || "No tiene nombre"}
                      />
                    </div>
                  ))}
              </Box>
            </Box>
            <div style={{ display: "flex",paddingLeft:'5px'}}>
              {!isReadOnly && (
                <div>
                  <div
                    style={{color:'#97DBAE',cursor:'pointer'}}
                    onClick={() =>
                      this.props.uiStore.toggleCatalog({ cartCatalog: this.props.catalog, cart: this.props.cart })
                    }
                  >
                    EDITER
                  </div>
                  <ItemContentQuantityInput>
                    <QuantityInput value={quantity} onChange={this.handleChangeCartCatalogQuantity} />
                  </ItemContentQuantityInput>
                </div>

              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </Catalog>
    );
  }
}

export default withComponents(inject("uiStore")(CartCatalog));
// export default withComponents(inject("uiStore")(withCart(CartCatalog)));
