import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes } from "@reactioncommerce/components/utils";

const Item = styled.div`
display: table;
width: 100%;
`;

const ItemContent = styled.div`
display: table;
`;

const ItemContentDetail = styled.div`
display: table-cell;
position: relative;
`;

const ItemContentDetailInner = styled.div``;

const ItemContentDetailInfo = styled.div``;

const ItemContentQuantityInput = styled.div`
bottom: 0;
left: 0;
width: 100%;
margin: 0 auto;
position: absolute;
padding-bottom: 10px;
`;

const ItemContentPrice = styled.div`
display: table-cell;
position: relative;
text-align: right;
padding-bottom: 20px;
padding-top:20px;
padding-left:40px;
`;

const ItemContentSubtotal = styled.div`
font-size: 14px; 
font-weight: 700;
}`;

const ItemContentSubtotalTitle = styled.div`
padding-left:100px
`;


class CartItem extends Component {
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
             * Pass either the Reaction CartItemDetail component or your own component that
             * accepts compatible props.
             */
            CartItemDetail: CustomPropTypes.component.isRequired,
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
            StockWarning: CustomPropTypes.component.isRequired
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
         * CartItem data
         */
        item: PropTypes.shape({
            /**
             * The cart item ID
             */
            _id: PropTypes.string,
            /**
             * Array of additional attributes of the chosen item.
             */
            attributes: PropTypes.arrayOf(PropTypes.object),
            /**
             * The current compareAt price (MSRP)
             */
            compareAtPrice: PropTypes.shape({
                /**
                 * The display price
                 */
                displayAmount: PropTypes.string.isRequired
            }),
            /**
             * Current stock quantity of item
             */
            currentQuantity: PropTypes.number,
            /**
             * Image URLs of chosen item
             */
            imageURLs: PropTypes.shape({
                large: PropTypes.string,
                medium: PropTypes.string,
                original: PropTypes.string,
                small: PropTypes.string,
                thumbnail: PropTypes.string
            }),
            /**
             * Is the chosen item have a low quantity
             */
            isLowQuantity: PropTypes.bool,
            /**
             * Price object of chosen item
             */
            price: PropTypes.shape({
                /**
                 * The display price
                 */
                displayAmount: PropTypes.string.isRequired
            }).isRequired,
            /**
             * Chosen items slug
             */
            productSlug: PropTypes.string,
            /**
             * Chosen items vendor
             */
            productVendor: PropTypes.string,
            /**
             * Chosen items title
             */
            subtotal: PropTypes.shape({
                /**
                 * The display subtotal
                 */
                displayAmount: PropTypes.string
            }),
            title: PropTypes.string,
            /**
             * Quantity of chosen item in cart
             */
            quantity: PropTypes.number
        }).isRequired,
        /**
         * On cart item quantity change handler
         */
        onChangeCartItemQuantity: PropTypes.func,
        /**
         * On remove item from cart handler
         */
        onRemoveItemFromCart: PropTypes.func,
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
        totalText: PropTypes.string
    };

    static defaultProps = {
        isMiniCart: false,
        isReadOnly: false,
        onChangeCartItemQuantity() { },
        onRemoveItemFromCart() { },
        removeText: "Remove",
        totalText: "Total"
    };

    state = {
        isProcessing: false
    };

    handleChangeCartItemQuantity = (value) => {
        const { onChangeCartItemQuantity, item: { _id } } = this.props;
        onChangeCartItemQuantity(value, _id);
    };

    handleRemoveItemFromCart = () => {
        const { onRemoveItemFromCart, item: { _id } } = this.props;
        onRemoveItemFromCart(_id);
    };

    renderImage() {
        const { isMiniCart, item: { imageURLs, productSlug }, productURLPath } = this.props;

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
            item: {
                attributes,
                compareAtPrice,
                currentQuantity,
                productSlug,
                productVendor,
                title,
                quantity,
                isLowQuantity,
                price: { displayAmount: displayPrice },
                subtotal
            },
            totalText
        } = this.props;

        const { displayAmount: displaySubtotal } = subtotal || {};
        const { displayAmount: displayCompareAtPrice } = compareAtPrice || {};
        const {
            CartItemDetail,
            Price,
            QuantityInput,
            StockWarning
        } = components || {};

        return (
            <Item style={{ borderBottom: '1px solid #dcdcdc'}} className={className}>
                {this.renderImage()}
                <ItemContent>
                    <ItemContentDetail>
                        <ItemContentDetailInner>
                            <ItemContentDetailInfo isMiniCart={isMiniCart}>
                                <CartItemDetail
                                    attributes={attributes}
                                    isMiniCart={isMiniCart}
                                    productURLPath={productURLPath}
                                    productSlug={productSlug}
                                    productVendor={productVendor}
                                    quantity={isReadOnly ? quantity : null}
                                    title={title}
                                />
                                <StockWarning
                                    inventoryQuantity={currentQuantity}
                                    isLowInventoryQuantity={isLowQuantity}
                                />
                            
                            </ItemContentDetailInfo>
                        </ItemContentDetailInner>
                       
                    </ItemContentDetail>
                </ItemContent>
                <ItemContentPrice isMiniCart={isMiniCart}>
                    <ItemContentSubtotalTitle>
                        <Price
                            displayPrice={displayPrice}
                            displayCompareAtPrice={displayCompareAtPrice}
                            hasPriceBottom={isMiniCart}
                        />
                    </ItemContentSubtotalTitle>
                    {quantity !== 1 ?
                        <ItemContentSubtotal isMiniCart={isMiniCart}>
                            <ItemContentSubtotalTitle>{totalText} ({quantity}): {displaySubtotal}</ItemContentSubtotalTitle>
                        </ItemContentSubtotal>
                        :
                        null
                    }
                    {!isReadOnly &&
                        <ItemContentQuantityInput>
                            <QuantityInput
                                value={quantity}
                                onChange={this.handleChangeCartItemQuantity}
                            />
                        </ItemContentQuantityInput>
                    }
                </ItemContentPrice>
            </Item>

        );
    }
}

export default withComponents(CartItem);