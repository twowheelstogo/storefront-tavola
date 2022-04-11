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
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withComponents } from "@reactioncommerce/components-context";
import CancelIcon from "@material-ui/icons/Cancel";
import Quantityinput from "components/QuantityInput";
import ProductDetailAddToCart from "components/ProductDetailAddToCart";
import CloseIcon from "@material-ui/icons/Close";
import priceByCurrencyCode from "lib/utils/priceByCurrencyCode";
import Collapse from "rc-collapse";
import inject from "hocs/inject";
import Random from "@idigi/random";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withSnackbar } from "notistack";
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
      selectedTotal: 0.0,
      errors: [],
      cartCatalogId: props.cartCatalogId || Random.id(),
      product:
        props.catalogItems.find((catalog) => catalog.productId === props.uiStore.catalogDrawerProduct) ||
        props.product ||
        {},
    };
    console.info("catalogDrawerProduct", (props.product||{}).productId, props.uiStore.catalogDrawerProduct);
  }
  componentDidMount() {
    this.props.uiStore.selectedCartCatalog(this.state.cartCatalogId);
  }
  getPricing = (op) => {
    return { maxQty: 1, minQty: 0, maxFreeQty: 0, ...(op.pricing || [])[0] };
    // return { maxQty: 1, minQty: 0, maxFreeQty: 0, ...Object.entries((op.pricing || [])[0]||{}).filter(([_,v]) => v!==null).reduce((p, [k,v]) => ({...p, [k]:v}), {}) };
    //(option.pricing || []).find((p) => (p.currency || {}).code === currencyCode);
  };
  renderTitle = (e) => e.title || e.optionTitle || e.attributeLabel;
  determineProductPrice = () => {
    // this.props.attr => false
    // const { attr } = this.props
    const { product, uiStore, currencyCode } = this.props;
    const errors = [];
    let selectedTotal = 0.0;
    ///|\\\|///|\\\|///|\\\
    ///      Selected Options
    ///|\\\|///|\\\|///|\\\
    for (const [variantId, optionQtys] of Object.entries(uiStore.SelectedOptions)) {
      const variant = product.variants.find((v) => v.variantId === variantId);
      if (!variant) {
        console.info("Error the variant not exists");
        continue;
      }
      const vPricing = this.getPricing(variant);
      let vMaxFreeQty = vPricing.maxFreeQty || 0;
      const options = [];
      const qtyTotal = 0;
      ///|\\\|///|\\\|///|\\\
      ///      Init Options
      ///|\\\|///|\\\|///|\\\
      for (const [optionId, qty] of Object.entries(optionQtys)) {
        const option = (variant.options || []).find((o) => o.variantId === optionId);
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
      ///|\\\|///|\\\|///|\\\
      ///      Calculate Price
      ///|\\\|///|\\\|///|\\\
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
      ///|\\\|///|\\\|///|\\\
      ///      Validations
      ///|\\\|///|\\\|///|\\\
      if (vPricing.maxQty && vPricing.maxQty < qtyTotal) {
        errors.push({
          msg: `Test: for the variant ${this.renderTitle(variant)} has a max qty ${
            vPricing.maxQty
          } and the current qty is ${qtyTotal}`,
        });
      }
    }
    console.info("determineProductPrice", selectedTotal);
    // return selectedTotal;
    this.setState({ selectedTotal, errors });
    this.showNotif();
    return !errors.length;
  };
  showNotif = () => {
    if (!this.state.errors.length) return;
    const { enqueueSnackbar } = this.props;
    console.error("Errors :", enqueueSnackbar, this.state.errors);
    this.state.errors.map((e) => enqueueSnackbar(e.msg || "Errrors", { variant: "error" }));
    // call the snapbar
  };
  handleSelectOption(variant, option) {
    const { product, uiStore, currencyCode } = this.props;
    if ((uiStore.SelectedOptions[variant.variantId] || [])[option.variantId]) {
      uiStore.unSetSelectedOption(variant.variantId, option.variantId);
      if (this.qtyInput[`${variant.variantId}:${option.variantId}`])
        this.qtyInput[`${variant.variantId}:${option.variantId}`].setState({ value: 0 });
    } else {
      uiStore.setSelectedOption(variant.variantId, option.variantId);
      if (this.qtyInput[`${variant.variantId}:${option.variantId}`])
        this.qtyInput[`${variant.variantId}:${option.variantId}`].setState({ value: 1 });
    }
    console.info("handleSelectOption", uiStore.SelectedOptions);
    // ReCalculate the Selected Total
    this.determineProductPrice();
  }
  handleQtyChaged(variant, option, event) {
    console.info("Qty Changed", variant.variantId, option.variantId, (event.target || {}).value);
    this.props.uiStore.setQtySelectedOption(variant.variantId, option.variantId, (event.target || {}).value);
    this.determineProductPrice();
  }
  renderOptionInfo(e, op) {
    const pricing = this.getPricing(op);
    console.info(pricing);
    return (
      <div style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>
        <div style={{ width: "100%", display: "flex" }}>
          <Typography style={{ width: 100 }}>
            <p style={{ display: "contents" }}> {this.renderTitle(op)}</p>
          </Typography>
          <Typography style={{ display: "inline-block", marginRight: 100 }}>
            {pricing.price != 0 && <div>{pricing.displayPrice}</div>}
          </Typography>
        </div>
      </div>
    );
  }
  handleAddToCartClick = async (e) => {
    if (!this.determineProductPrice()) return;
    console.info("Sounds Working");
    const {
      addItemsToCart,
      currencyCode,
      product,
      uiStore: { openCartWithTimeout, pdpSelectedOptionId, pdpSelectedVariantId, SelectedOptions, selectedCatalogs },
      width,
    } = this.props;

    // // Get selected variant or variant option
    // const selectedVariant = variantById(product.variants, pdpSelectedVariantId);
    // const selectedOption = variantById(selectedVariant.options, pdpSelectedOptionId);
    // const selectedVariantOrOption = selectedOption || selectedVariant;

    // if (selectedVariantOrOption) {
    //   // Get the price for the currently selected variant or variant option
    //   const price = priceByCurrencyCode(currencyCode, selectedVariantOrOption.pricing);

    // Call addItemsToCart with an object matching the GraphQL `CartItemInput` schema
    const variants = product.variants.reduce(
      (p, variant) => ({
        ...p,
        [variant.variantId]: {
          ...variant,
          options: (variant.options || []).reduce((po, option) => ({ ...po, [option.variantId]: option }), {}),
        },
      }),
      {},
    );
    const req = {
      catalogs: Object.entries(selectedCatalogs).map(([cartCatalogId, catalog]) => ({
        _id: cartCatalogId,
        productId: product.productId,
        quantity: catalog.qty,
      })),
      items: Object.entries(SelectedOptions)
        .map(([variantId, options]) =>
          Object.entries(options).map(([optionId, quantity]) => ({
            cartCatalogId: this.state.cartCatalogId,
            price: {
              amount: ((variants[variantId].options[optionId] || {}).pricing || []).concat([{ price: 0 }])[0].price,
              currencyCode,
            },
            productConfiguration: {
              productId: product.productId, // Pass the productId, not to be confused with _id
              productVariantId: optionId, // Pass the variantId, not to be confused with _id
            },
            quantity,
          })),
        )
        .flat(),
    };
    console.info("addItemsToCart", req);
    await addItemsToCart(req);
    // }
    // if (isWidthUp("md", width)) {
    //   // Open the cart, and close after a 3 second delay
    //   openCartWithTimeout(3000);
    // }
  };
  DrawerViewList() {
    const { uiStore, currencyCode, classes } = this.props;
    const { product } = this.state;
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
              onClick={() => uiStore.toggleDrawerProduct(false)}
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
              <Accordion defaultExpanded={true} style={{ margin: 0 }}>
                <AccordionSummary
                  style={{ background: "#F6F6F6" }}
                  expandIcon={
                    <ExpandMoreIcon style={{ background: "#1D0D13", color: "white", borderRadius: "20px" }} />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{ color: "#1D0D13", fontSize: "18px", fontWeight: 800 }}>{`${this.renderTitle(
                    e,
                  )}`}</Typography>
                  {/*(Test: MaxQty: ${variantPricing.maxQty}. MinQty: ${
                    variantPricing.minQty })*/}
                </AccordionSummary>
                <AccordionDetails style={{ padding: "25px 20px" }}>
                  <Typography>
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
                                          type="radio"
                                          name={this.renderTitle(op)}
                                          checked={!!(uiStore.SelectedOptions[e.variantId] || {})[op.variantId]}
                                          onClick={(ev) => this.handleSelectOption(e, op, ev)}
                                        />
                                      }
                                      label={this.renderOptionInfo(e, op)}
                                    />
                                  ) : (
                                    <div>
                                      <div>{this.renderOptionInfo(e, op)}</div>
                                      <div
                                        style={{
                                          width: 110,
                                          position: "absolute",
                                          right: 0,
                                          top: "50%",
                                          marginTop: -20,
                                        }}
                                      >
                                        <Quantityinput
                                          max={optionPricing.maxQty || variantPricing.maxQty}
                                          min={optionPricing.minQty || variantPricing.minQty}
                                          ref={(qtyInput) =>
                                            (this.qtyInput[`${e.variantId}:${op.variantId}`] = qtyInput)
                                          }
                                          value={(uiStore.SelectedOptions[e.variantId] || {})[op.variantId] || 0}
                                          onChange={(ev) => this.handleQtyChaged(e, op, { target: { value: ev } })}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </FormGroup>
                                <div>
                                  {/* <h6>(test) Def Qty: {(uiStore.SelectedOptions[e.variantId] || {})[op.variantId] || 1}</h6> */}
                                  {/* <TextField
                          type="number"
                          label="Qantity"
                          variant="outlined"
                          defaultValue={(uiStore.SelectedOptions[e.variantId] || {})[op.variantId] || 1}
                          onChange={(ev) => this.handleQtyChaged(e, op, ev)}
                        /> */}
                                </div>
                              </FormControl>
                            );
                          })}
                      </div>
                    ) : (
                      <div>
                        {e.options ? (
                          <FormControl component="fieldset">
                            <RadioGroup
                              aria-label={e.variantId}
                              name={e.variantId}
                              value={
                                Object.keys({ ...uiStore.SelectedOptions[e.variantId], [e.options[0].variantId]: 1 })[0]
                              }
                              onChange={(ev, id) => {
                                console.info("Checked", id, ev);
                                e.options.map((op) =>
                                  this.handleQtyChaged(e, op, { target: { value: id === op.variantId ? 1 : 0 } }),
                                );
                                /// checked={!!(uiStore.SelectedOptions[e.variantId] || {})[op.variantId]}
                              }}
                            >
                              {e.options.map((op, index) => (
                                <React.Fragment>
                                  <FormControlLabel
                                    value={op.variantId}
                                    control={<Radio />}
                                    label={this.renderOptionInfo(e, op)}
                                  />
                                </React.Fragment>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        ) : (
                          <React.Fragment />
                        )}
                      </div>
                    )}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
          <Button
            variant="container"
            style={{
              background: "#1D0D13",
              color: "white",
              marginTop: 50,
              // position: "absolute",
              left: "15%",
              bottom: 20,
            }}
            onClick={this.handleAddToCartClick}
          >
            {" "}
            Añadir Al Carrito - {` price all cart`}
          </Button>
          {/* <ProductDetailAddToCart onClick={this.handleAddToCartClick} /> */}
        </div>
      </Fragment>
    );
  }
  render() {
    const { product, uiStore, currencyCode, classes } = this.props;
    return (
      <React.Fragment key={"right"}>
        <CardContainerHorizontal
          withBorder
          onClick={() => uiStore.setCatalogDrawerProduct(product.productId)}
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
          open={uiStore.isDrawerProductOpen}
          onClose={() => uiStore.toggleDrawerProduct(false)}
          onOpen={() => uiStore.setCatalogDrawerProduct(product.productId)}
        >
          {this.DrawerViewList()}
        </SwipeableDrawer>
      </React.Fragment>
    );
  }
  render(){
    return <div>Hello</div>;
  }
}

export default withComponents(withSnackbar(withStyles(styles)(inject("uiStore")(ProductDetailDrawer))));
