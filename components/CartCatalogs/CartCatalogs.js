import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@reactioncommerce/components/Button/v1";
import { withComponents } from "@reactioncommerce/components-context";
// import CartItemsList from "@reactioncommerce/components/CartItems/v1";

const styles = (theme) => ({
  loadMore: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  cfXPgA: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});

class CartCatalogs extends Component {
  static propTypes = {
    classes: PropTypes.object,
    hasMoreCartCatalogs: PropTypes.bool,
    isMiniCart: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    catalogs: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        quantity: PropTypes.number,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            _id: PropTypes.string,
            attributes: PropTypes.arrayOf(PropTypes.object),
            currencyQuantity: PropTypes.number,
            imageUrl: PropTypes.string,
            isLowInventoryQuantity: PropTypes.bool,
            price: PropTypes.shape({
              displayPrice: PropTypes.string,
              compareAtPrice: PropTypes.string,
            }),
            productSlug: PropTypes.string,
            title: PropTypes.string,
            quantity: PropTypes.number,
          }),
        ).isRequired,
      }),
    ).isRequired,
    onChangeCartCatalogQuantity: PropTypes.func.isRequired,
    onLoadMoreCartCatalogs: PropTypes.func,
    onRemoveCatalogFromCart: PropTypes.func.isRequired,
    productURLPath: PropTypes.string,
  };

  static defaultProps = {
    onChangeCartCatalogQuantity() {},
    onRemoveCatalogFromCart() {},
  };

  handleCatalogQuantityChange = (quantity, _id) => {
    const { onChangeCartCatalogQuantity } = this.props;

    onChangeCartCatalogQuantity(quantity, _id);
  };

  handleRemoveCatalog = (_id) => {
    const { onRemoveCatalogFromCart } = this.props;

    onRemoveCatalogFromCart(_id);
  };

  render() {
    const {
      classes,
      catalogs,
      isMiniCart,
      isReadOnly,
      hasMoreCartCatalogs,
      onLoadMoreCartCatalogs,
      components: { CartCatalogsList },
    } = this.props;
    return (
      <Fragment>
        <CartCatalogsList
          components={this.props.components}
          isMiniCart={isMiniCart}
          isReadOnly={isReadOnly}
          catalogs={catalogs}
          onChangeCartCatalogQuantity={this.handleCatalogQuantityChange}
          onRemoveCatalogFromCart={this.handleRemoveCatalog}
          productURLPath="/api/detectLanguage/product/"
        />
        {hasMoreCartCatalogs && (
          <div className={classes.loadMore}>
            <Button isShortHeight={isMiniCart} isTextOnly onClick={onLoadMoreCartCatalogs}>
              {"Load More"}
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default withComponents(withStyles(styles)(CartCatalogs));
