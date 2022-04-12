import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes } from "@reactioncommerce/components/utils";

const Catalogs = styled.div``;

class CartCatalogsList extends Component {
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
       * Pass either the Reaction `CartCatalog` component or your own component
       * that takes `catalogs`, `isMiniCart`, `onChangeCartCatalogQuantity`, and
       * `onRemoveCatalogFromCart` props and uses them to render a single cart item.
       */
      CartCatalog: CustomPropTypes.component.isRequired,
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
     * CartCatalog data. Only the `_id` prop is required by this component. Each item is passed to
     * CartCatalog, which may require additional props.
     */
    catalogs: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * The cart item ID
         */
        _id: PropTypes.string.isRequired,
      }),
    ).isRequired,
    /**
     * On cart item quantity change handler
     */
    onChangeCartCatalogQuantity: PropTypes.func,
    /**
     * On remove item from cart handler
     */
    onRemoveCatalogFromCart: PropTypes.func,
    /**
     * Product URL path to be prepended before the slug. Should end with with "/"
     */
    productURLPath: PropTypes.string,
  };

  static defaultProps = {
    isMiniCart: false,
    isReadOnly: false,
    onChangeCartCatalogQuantity() {},
    onRemoveCatalogFromCart() {},
  };

  render() {
    const {
      className,
      catalogs,
      components: { CartCatalog, ...components },
      ...props
    } = this.props;
    // 
    return (
      <Catalogs className={className}>
        {catalogs.map((catalog) => (
          <CartCatalog key={catalog._id} catalog={catalog} components={components} {...props} />
        ))}
      </Catalogs>
    );
  }
}

export default withComponents(CartCatalogsList);
