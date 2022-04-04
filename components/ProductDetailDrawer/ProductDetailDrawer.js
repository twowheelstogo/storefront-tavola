import React, { Component, Fragment } from "react";
import {
  SwipeableDrawer,
  Typography,
  IconButton,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormGroup,
  FormControl,
  Checkbox,
  TextField,
  ButtonBase,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withComponents } from "@reactioncommerce/components-context";
import CancelIcon from "@material-ui/icons/Cancel";
import Quantityinput from "components/QuantityInput";
import ProductDetailAddToCart from "components/ProductDetailAddToCart";
import priceByCurrencyCode from "lib/utils/priceByCurrencyCode";
import Collapse from "rc-collapse";
import inject from "hocs/inject";

import {
  StyledSubtitle,
  StyledTitle,
  CardContainerHorizontal,
  CardContent,
  Div,
  styles,
  useStyles,
} from "./ProductDetailDrawerStyles";
const Panel = Collapse.Panel;

// <ProductDetailDrawer attr={false} />
class ProductDetailDrawer extends Component {
  // state = { right: false };
  // constructor(state) {
  //   this.super(state)
  // }
  qtyInput = {};
  constructor(props) {
    super(props);
    this.state = {
      right: false,
      selectedTotal: 0.0,
      errors: [],
    };
  }
  getPricing = (op) => {
    return { maxQty: 1, minQty: 0, maxFreeQty: 0, ...(op.pricing || [])[0] };
    // return { maxQty: 1, minQty: 0, maxFreeQty: 0, ...Object.entries((op.pricing || [])[0]||{}).filter(([_,v]) => v!==null).reduce((p, [k,v]) => ({...p, [k]:v}), {}) };
    //(option.pricing || []).find((p) => (p.currency || {}).code === currencyCode);
  };
  determineProductPrice = () => {
    // this.props.attr => false
    // const { attr } = this.props
    const { product, uiStore, currencyCode } = this.props;
    const errors = [];

    let selectedTotal = 0.0;
    for (const [variantId, optionQtys] of Object.entries(uiStore.SelectedOptions)) {
      const variant = product.variants.find((v) => v._id === variantId);
      if (!variant) {
        console.info("Error the variant not exists");
        continue;
      }
      const vPricing = this.getPricing(variant);
      let vMaxFreeQty = vPricing.maxFreeQty || 0;
      const options = [];
      const qtyTotal = 0;
      // options
      for (const [optionId, qty] of Object.entries(optionQtys)) {
        const option = (variant.options || []).find((o) => o._id === optionId);
        if (!option) {
          console.info("Error the option not exists");
          continue;
        }
        const oPricing = this.getPricing(option);
        console.info("currencyCode", currencyCode, "qty", qty, "pricing", oPricing);
        if (!oPricing) {
          console.info("Error the pricing option not exists");
          continue;
        }
        const oMaxFreeQty = oPricing.maxFreeQty || 0;
        const currentQty = qty || 1;
        qtyTotal += currentQty;
        // let finalQty = currentQty - oMaxFreeQty;
        // if (finalQty >= 1) finalQty = 1;
        // cocacol 1 freeQty free
        // 2 currentQty
        // final Qty = currentQty -freeQty
        // console.info("maxFreeQty", oMaxFreeQty, "currentQty", currentQty, "finalQty", finalQty);
        // if (oMaxFreeQty <= currentQty) {
        //   selectedTotal += (oPricing.price || 0) * finalQty;
        // }
        options.push({ oMaxFreeQty, price: oPricing.price || 0, currentQty });
      }
      // Sort
      options = options.sort((a, b) => a.price - b.price);
      for (const op of options) {
        // if (vMaxFreeQty <= 0 || op.currentQty >= vMaxFreeQty) {
        let finalQty = op.currentQty - vMaxFreeQty - op.oMaxFreeQty;
        if (finalQty <= 0) finalQty = 0;
        selectedTotal += op.price * finalQty;
        //
        vMaxFreeQty -= op.currentQty - op.oMaxFreeQty;
        if (vMaxFreeQty < 0) vMaxFreeQty = 0;
        // }
      }
      if (vPricing.maxQty && vPricing.maxQty > qtyTotal) {
        errors.push({
          msg: `Test:. for the variant ${variant.title} has a max qty ${vPricing.maxQty} and the current qty is ${qtyTotal}`,
        });
      }
    }
    console.info("determineProductPrice", selectedTotal);
    // return selectedTotal;
    this.setState({ selectedTotal, errors });
  };
  handleSelectOption(variant, option) {
    const { product, uiStore, currencyCode } = this.props;
    if ((uiStore.SelectedOptions[variant._id] || [])[option._id]) {
      uiStore.unSetSelectedOption(variant._id, option._id);
      if (this.qtyInput[`${variant._id}:${option._id}`])
        this.qtyInput[`${variant._id}:${option._id}`].setState({ value: 0 });
    } else {
      uiStore.setSelectedOption(variant._id, option._id);
      if (this.qtyInput[`${variant._id}:${option._id}`])
        this.qtyInput[`${variant._id}:${option._id}`].setState({ value: 1 });
    }
    console.info("handleSelectOption", uiStore.SelectedOptions);
    // ReCalculate the Selected Total
    this.determineProductPrice();
  }
  handleQtyChaged(variant, option, event) {
    console.info("Qty Changed", variant._id, option._id, (event.target || {}).value);
    this.props.uiStore.setQtySelectedOption(variant._id, option._id, (event.target || {}).value);
    this.determineProductPrice();
  }

  toggleDrawer(anchor, open) {
    return (event) => {
      if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
        return;
      }

      this.setState({ [anchor]: open });
    };
  }
  renderOptionInfo(e, op) {
    const pricing = this.getPricing(op);
    return (
      <div style={{ width: "100%" }}>
        <div style={{ width: "100%", display: "flex" }}>
          <Typography style={{ width: 100 }}>
            <p style={{ display: "contents" }}> {op.title}</p>
          </Typography>
          <Typography style={{ display: "inline-block" }}>
            {pricing.displayPrice}
            {/*   {pricing.maxFreeQty ? (
              <b>
                {" "}
                {pricing.maxFreeQty}{" "}
                <small>
                  <sup>Free Qty</sup>
                </small>
              </b>
            ) : (
              ""
            )} */}
          </Typography>
        </div>
        {/*    <div>
          Test: <b>MaxQty : {pricing.maxQty}</b> - <b>MinQty : {pricing.minQty}</b>
        </div> */}
      </div>
    );
  }
  DrawerViewList() {
    const { product, uiStore, currencyCode, classes } = this.props;
    // console.info("DrawerViewList ---> product", product);
    return (
      <Fragment>
        <div role="presentation" style={{ width: 400, background: "white" }}>
          <div style={{ position: "relative" }}>
            {product.primaryImage !== null ? (
              <img
                src={product.primaryImage.URLs.medium}
                style={{ width: "100%" }}
                className={`${classes.imageProduct} db`}
              ></img>
            ) : (
              <img src="/images/placeholder.gif" />
            )}
            <IconButton
              size="small"
              style={{
                position: "absolute",
                width: 40,
                height: "auto",
                color: "#FFF",
                cursor: "select",
                top: 10,
                left: 10,
              }}
              onClick={this.toggleDrawer("right", false)}
            >
              <CancelIcon />
            </IconButton>
          </div>
          <Typography variant="h4" component="h2" style={{ padding: "20px 0px 0px 20px", fontSize: 30 }}>
            {product.title}
          </Typography>
          <Typography variant="h6" style={{ padding: "5px 0px 0px 20px", fontSize: 18 }}>
            {(product.pricing[0] || "").displayPrice}
          </Typography>
          <Typography variant="h6" style={{ padding: "5px 0px 0px 20px", fontSize: 18 }}>
            (test) Selected TOTAL : {this.state.selectedTotal}
          </Typography>
          <Typography
            variant="h6"
            style={{
              padding: "10px 0px 0px 20px",
              color: "#979797",
              fontSize: 16,
            }}
          >
            {product.description}
          </Typography>

          {product.variants.map((e) => {
            const variantPricing = this.getPricing(e);
            return (
              <Collapse accordion={true}>
                <Panel
                  header={`${e.title} (Test: MaxQty: ${variantPricing.maxQty}. MinQty: ${variantPricing.minQty})`}
                  headerClass="my-header-class"
                >
                  {e.multipleOption ? (
                    <div>
                      {e.options &&
                        e.options.map((op) => {
                          const optionPricing = this.getPricing(op);
                          return (
                            <FormControl
                              className={classes.optionForm}
                              component="fieldset"
                              style={{ position: "relative", width: "100%" }}
                            >
                              <FormGroup>
                                {(optionPricing.maxQty || 1) <= 1 && (variantPricing.maxQty || 1) <= 1 ? (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        name={op.title}
                                        checked={!!(uiStore.SelectedOptions[e._id] || {})[op._id]}
                                        onClick={(ev) => this.handleSelectOption(e, op, ev)}
                                      />
                                    }
                                    label={this.renderOptionInfo(e, op)}
                                  />
                                ) : (
                                  <div>
                                    <div>{this.renderOptionInfo(e, op)}</div>
                                    <div
                                      style={{ width: 110, position: "absolute", right: 0, top: "50%", marginTop: -20 }}
                                    >
                                      <Quantityinput
                                        max={optionPricing.maxQty || variantPricing.maxQty}
                                        min={optionPricing.minQty || variantPricing.minQty}
                                        ref={(qtyInput) => (this.qtyInput[`${e._id}:${op._id}`] = qtyInput)}
                                        value={(uiStore.SelectedOptions[e._id] || {})[op._id] || 0}
                                        onChange={(ev) => this.handleQtyChaged(e, op, { target: { value: ev } })}
                                      />
                                    </div>
                                  </div>
                                )}
                              </FormGroup>
                              <div>
                                {/* <h6>(test) Def Qty: {(uiStore.SelectedOptions[e._id] || {})[op._id] || 1}</h6> */}
                                {/* <TextField
                          type="number"
                          label="Qantity"
                          variant="outlined"
                          defaultValue={(uiStore.SelectedOptions[e._id] || {})[op._id] || 1}
                          onChange={(ev) => this.handleQtyChaged(e, op, ev)}
                        /> */}
                              </div>
                            </FormControl>
                          );
                        })}
                    </div>
                  ) : (
                    <div>
                      {e.options &&
                        e.options.map((op) => (
                          <FormControl component="fieldset">
                            <RadioGroup aria-label="gender" name="gender1">
                              <FormControlLabel value={op.title} control={<Radio />} label={op.title} />
                            </RadioGroup>
                          </FormControl>
                        ))}
                    </div>
                  )}
                </Panel>
              </Collapse>
            );
          })}
          <Button
            variant="container"
            style={{
              background: "#1D0D13",
              color: "white",
              position: "absolute",
              left: "15%",
              bottom: 20,
            }}
          >
            {" "}
            Añadir Al Carrito - {` price all cart`}
          </Button>
          <ProductDetailAddToCart />
        </div>
      </Fragment>
    );
  }
  handleAddToCartClick = async (quantity) => {
  	const {
  		addItemsToCart,
  		currencyCode,
  		product,
  		uiStore: { openCartWithTimeout, pdpSelectedOptionId, pdpSelectedVariantId },
  		width
  	} = this.props;

  	// Get selected variant or variant option
  	const selectedVariant = variantById(product.variants, pdpSelectedVariantId);
  	const selectedOption = variantById(selectedVariant.options, pdpSelectedOptionId);
  	const selectedVariantOrOption = selectedOption || selectedVariant;

  	if (selectedVariantOrOption) {
  		// Get the price for the currently selected variant or variant option
  		const price = priceByCurrencyCode(currencyCode, selectedVariantOrOption.pricing);

  		// Call addItemsToCart with an object matching the GraphQL `CartItemInput` schema
  		await addItemsToCart([
  			{
  				price: {
  					amount: price.price,
  					currencyCode
  				},
  				productConfiguration: {
  					productId: product.productId, // Pass the productId, not to be confused with _id
  					productVariantId: selectedVariantOrOption.variantId // Pass the variantId, not to be confused with _id
  				},
  				quantity
  			}
  		]);
  	}
  	if (isWidthUp("md", width)) {
  		// Open the cart, and close after a 3 second delay
  		openCartWithTimeout(3000);
  	}
  };
  render() {
    const { product, uiStore, currencyCode, classes } = this.props;
    return (
      <React.Fragment key={"right"}>
        <CardContainerHorizontal
          withBorder
          onClick={this.toggleDrawer("right", true)}
          boderColor={"2px solid rgba(151, 151, 151, 0.5)"}
        >
          {product.primaryImage !== null ? (
            <img src={product.primaryImage.URLs.medium} className={classes.imageProduct}></img>
          ) : (
            <img src="/images/placeholder.gif" />
          )}
          <CardContent>
            <Div>
              <StyledTitle>{product.title}</StyledTitle>
              <StyledSubtitle>{product.description}</StyledSubtitle>
            </Div>
            <Div>
              <Typography className={classes.textPrice}>
                {/*     {(product.pricing[0] || "").displayPrice} */}
              </Typography>
            </Div>
          </CardContent>
        </CardContainerHorizontal>
        <SwipeableDrawer
          anchor={"right"}
          open={this.state["right"]}
          onClose={this.toggleDrawer("right", false)}
          onOpen={this.toggleDrawer("right", true)}
        >
          {this.DrawerViewList()}
        </SwipeableDrawer>
      </React.Fragment>
    );
  }
}

export default withComponents(withStyles(styles)(inject("uiStore")(ProductDetailDrawer)));
