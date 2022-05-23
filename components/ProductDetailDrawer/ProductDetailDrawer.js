import React, { Component, Fragment, useEffect } from "react";
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
import PageLoading from "components/PageLoading";

class ProductDetailDrawer extends Component {
  refs = {};
  constructor(props) {
    super(props);
    this.state = {
      selectedTotal: 0.0,
      errors: [],
      cartCatalogId: null,
      catalogId: null,
      product: {},
      isSaving: false,
      refresh: 0,
    };
  }
  componentDidUpdate() {
    this.init();
  }
  init(opts = {}) {
    const { uiStore, catalogItems } = this.props;
    opts.catalogId = opts.catalogId || uiStore.catalogId;
    if (opts.catalogId && opts.catalogId !== this.state.catalogId) {
      const product =
        ((catalogItems.find((catalog) => catalog.node.product.productId === opts.catalogId) || {}).node || {})
          .product || {};
      ///|\\\|///|\\\|///|\\\
      ///      Set
      ///|\\\|///|\\\|///|\\\
      this.initItems(product);
      // Init Qty
      this.refs = {};
      ///|\\\|///|\\\|///|\\\
      ///      Cal
      ///|\\\|///|\\\|///|\\\
      this.determineProductPrice({
        isInit: true,
        state: {
          refresh: this.state.refresh + 1,
          isSaving: false,
          catalogId: opts.catalogId,
          product,
        },
      });
    }
  }

  getPricing = (op, def) => {
    def = { maxQty: 1, minQty: 0, maxFreeQty: 0, ...def };
    return { ...def, ...(op.pricing || [])[0] };
  };
  titlePricing = (op) => {
    const o = this.getPricing(op, { maxQty: 0 });
    const l = [];
    for (const [key, title] of [
      ["maxQty", "Cantidad Maxima"],
      ["minQty", "Cantidad Minima"],
      ["maxFreeQty", "Cantidad Gratis"],
    ]) {
      if (o[key])
        l.push(() => (
          <p style={{ color: "#979797" }}>
            <b>{` ${title}`}</b>:{` ${o[key]} `}
          </p>
        ));
    }
    if (l.length) {
      return <small style={{ fontSize: "0.8rem" }}>{l.map((c) => c())}</small>;
    }
    //
    return "";
  };
  renderTitle = (e) => e.title || e.optionTitle || e.attributeLabel;
  determineProductPrice = (opts = {}) => {
    const { uiStore, currencyCode } = this.props;
    const errors = [];
    let selectedTotal = 0.0;
    const product = opts.product || (opts.state || {}).product || this.state.product;
    ///|\\\|///|\\\|///|\\\
    ///      Selected Options
    ///|\\\|///|\\\|///|\\\
    for (const [variantId, optionQtys] of Object.entries(uiStore.qtyx())) {
      const variant = product.variants.find((v) => v.variantId === variantId);
      if (!variant) {
        console.error(`ERROR: the variant not exists variantId:${variantId} | optionQtys:${optionQtys} `);
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
          console.error("ERROR: the option not exists");
          continue;
        }
        const oPricing = this.getPricing(option);
        // console.info("currencyCode", currencyCode, "qty", qty, "pricing", oPricing);
        if (!oPricing) {
          console.error("ERROR: the pricing option not exists");
          continue;
        }
        const oMaxFreeQty = oPricing.maxFreeQty || 0;
        const currentQty = qty || 1;
        qtyTotal += currentQty;
        options.push({ oMaxFreeQty, price: oPricing.price || 0, currentQty });
      }
      // Sort
      options = options.sort((a, b) => a.price - b.price);
      ///|\\\|///|\\\|///|\\\
      ///      Calculate Price
      ///|\\\|///|\\\|///|\\\
      for (const op of options) {
        let finalQty = op.currentQty - vMaxFreeQty - op.oMaxFreeQty;
        if (finalQty <= 0) finalQty = 0;
        selectedTotal += op.price * finalQty;
        vMaxFreeQty -= op.currentQty - op.oMaxFreeQty;
        if (vMaxFreeQty < 0) vMaxFreeQty = 0;
      }
      ///|\\\|///|\\\|///|\\\
      ///      Validations
      ///|\\\|///|\\\|///|\\\

      if (qtyTotal > vPricing.maxQty) {
        // console.info("cantidad elegida", qtyTotal, vPricing.maxQty);
        errors.push({
          msg: `El producto ${this.renderTitle(variant)} solo puede elegir ${
            vPricing.maxQty
          } y estas eligiendo ${qtyTotal}`,
        });
      }
    }
    this.setState({ selectedTotal, errors, ...opts.state });
    if (!opts.isInit) {
      this.showNotif();
    }

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
    const { uiStore } = this.props;
    const key = `${variant.variantId}::${option.variantId}`;
    if (uiStore.qtys()[key]) {
      uiStore.setQtys({ key, qty: 0 });
      if (this.refs[key]) this.refs[key].setState({ value: 0 });
    } else {
      uiStore.setQtys({ key, qty: 1 });
      if (this.refs[key]) this.refs[key].setState({ value: 1 });
    }
    // ReCalculate the Selected Total
    this.determineProductPrice();
  }
  handleQtyChaged(variant, option, event) {
    this.props.uiStore.setQtys({ key: `${variant.variantId}::${option.variantId}`, qty: (event.target || {}).value });
    this.determineProductPrice();
  }
  renderOptionInfo(e, op) {
    const pricing = this.getPricing(op);
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
        {this.titlePricing(op)}
      </div>
    );
  }

  handleAddToCartClick = async (e) => {
    if (!this.determineProductPrice()) return;
    const { addItemsToCart, currencyCode, uiStore, width } = this.props;
    const qtys = { ...uiStore.qtys() };
    const cartCatalogQty = qtys._ || 1;
    delete qtys._;
    const cartCatalogId = uiStore.cartCatalogId;

    // Call addItemsToCart with an object matching the GraphQL `CartItemInput` schema
    const variants = this.state.product.variants.reduce(
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
      catalogs: [
        {
          _id: cartCatalogId,
          productId: this.state.product.productId,
          quantity: cartCatalogQty,
        },
      ],
      items: Object.entries(qtys)
        .map(([key, quantity]) => {
          const [variantId, optionId] = key.split("::");
          return {
            cartCatalogId,
            price: {
              amount: (
                ((optionId ? (variants[variantId] || {}).options[optionId] : variants[variantId]) || {}).pricing || []
              ).concat([{ price: 0 }])[0].price,
              currencyCode,
            },
            productConfiguration: {
              productId: this.state.product.productId, // Pass the productId, not to be confused with _id
              productVariantId: optionId || variantId, // Pass the variantId, not to be confused with _id
            },
            quantity,
          };
        })
        .flat(),
    };
    this.setState({ isSaving: true });

    await addItemsToCart(req);
    uiStore.afterSaved();
    this.setState({ isSaving: false });
  };
  renderContent = () => {
    const { uiStore, classes } = this.props;
    const qtys = uiStore.qtys();
    return (
      <div role="presentation" style={{ width: 400, background: "white" }}>
        <div style={{ position: "relative" }}>
          <div class={classes.imgLoader}>
            <PageLoading />
          </div>
          <div
            className={`${classes.imageProduct} bg`}
            style={{
              height: 280,
              backgroundImage: `url(${
                this.state.product.primaryImage
                  ? this.state.product.primaryImage.URLs.medium
                  : "/images/placeholder.gif"
              })`,
            }}
          ></div>
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
            onClick={() => uiStore.toggleCatalog()}
          >
            <CancelIcon />
          </IconButton>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" component="h2" style={{ padding: "20px 10px 0px 20px", fontSize: 26 }}>
            {this.state.product.title}
          </Typography>
          <Typography variant="h6" component="h6" style={{ padding: "20px 30px 0px 20px", fontSize: 18 }}>
            Total Q.{this.state.selectedTotal}
          </Typography>
        </div>
        {/* 
          <Typography variant="h6" style={{ padding: "5px 0px 0px 20px", fontSize: 18 }}>
            {(this.state.product.pricing[0] || "").displayPrice}
          </Typography> 
        */}
        <Typography variant="h6" style={{ padding: "5px 0px 0px 20px", fontSize: 18 }}></Typography>

        <Typography
          variant="h6"
          style={{
            padding: "10px 0px 10px 20px",
            color: "#979797",
            fontSize: 16,
          }}
        >
          {this.state.product.description}
        </Typography>

        {this.state.product.variants
          .filter((h) => !h.isHidden)
          .map((e) => {
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
                  <div>
                    <Typography style={{ color: "#1D0D13", fontSize: "18px", fontWeight: 800 }}>
                      {this.renderTitle(e)}
                    </Typography>
                    {this.titlePricing(e)}
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{ padding: "25px 20px" }}>
                  <Typography>
                    {e.multipleOption ? (
                      <div>
                        {e.options &&
                          e.options
                            .filter((h) => !h.isHidden)
                            .map((op) => {
                              const optionPricing = this.getPricing(op);
                              const key = `${e.variantId}::${op.variantId}`;
                              return (
                                <FormControl
                                  className={classes.optionForm}
                                  component="fieldset"
                                  style={{ position: "relative", width: "100%" }}
                                  disabled={this.state.isSaving}
                                >
                                  <FormGroup>
                                    {(optionPricing.maxQty || 1) <= 1 && (variantPricing.maxQty || 1) <= 1 ? (
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            type="radio"
                                            name={this.renderTitle(op)}
                                            checked={!!qtys[key]}
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
                                            disabled={this.state.isSaving}
                                            max={optionPricing.maxQty || variantPricing.maxQty}
                                            min={optionPricing.minQty || variantPricing.minQty}
                                            ref={(ref) => (this.refs[key] = ref)}
                                            value={qtys[key] || 0}
                                            onChange={(ev) => this.handleQtyChaged(e, op, { target: { value: ev } })}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </FormGroup>
                                </FormControl>
                              );
                            })}
                      </div>
                    ) : (
                      <div>
                        {e.options ? (
                          <FormControl component="fieldset" disabled={this.state.isSaving}>
                            <RadioGroup
                              aria-label={e.variantId}
                              name={e.variantId}
                              value={
                                [
                                  ...Object.keys(qtys)
                                    .filter((k) => k.match(e.variantId))
                                    .map((k) => k.split("::")[1]),
                                  e.options[0].variantId,
                                ][0]
                              }
                              onChange={(ev, id) => {
                                e.options.map((op) =>
                                  this.handleQtyChaged(e, op, { target: { value: id === op.variantId ? 1 : 0 } }),
                                );
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
            left: "15%",
            bottom: 20,
          }}
          onClick={this.handleAddToCartClick}
          disabled={this.state.isSaving}
        >
          Añadir Al Carrito - {` price all cart`}
        </Button>
      </div>
    );
  };
  initItems = (product, selectedItems) => {
    const { uiStore } = this.props;
    for (const variant of product.variants || []) {
      const vPrice = this.getPricing(variant, { minQty: null });
      const oCount = (variant.options || []).length;
      (variant.options || []).forEach((option, index) => {
        const oPrice = this.getPricing(variant, { minQty: null });
        const key = `${variant.variantId}::${option.variantId}`;
        const qtys = uiStore.qtys();
        const totalQty = Object.entries(qtys).reduce((p, [k, qty]) => {
          if (k.match(`${variant.variantId}::`)) p += qty || 0;
          return p;
        }, 0);
        // Qty
        let qty;
        // const minQty = oPrice.minQty || vPrice.minQty;
        // option MinQty
        if (oPrice.minQty) {
          qty = oPrice.minQty;
        }

        // is RadioButton
        if (variant.multipleOption === false && index === 0 && totalQty <= 0) {
          if (!qty) {
            qty = 1;
          }
        }
        //---
        if (vPrice.minQty && totalQty === 0 && !qty && index === 0) {
          qty = vPrice.minQty;
        }
        if (qty) {
          // if (!selectedItems[variant.variantId]) selectedItems[variant.variantId] = {};
          // if (!selectedItems[variant.variantId][option.variantId])
          //   selectedItems[variant.variantId][option.variantId] = 0;

          if ((qtys[key] || 0) < qty) {
            // selectedItems[variant.variantId][option.variantId] = qty;
            uiStore.setQtys({ key, qty });
            // console.info(`Auto Select variant::${variant.title} |  option::${option.title || option.optionTitle} |  qty::${qty}`)
          }
        }
      });
    }
    return selectedItems;
  };
  render() {
    const { uiStore, classes } = this.props;

    return (
      <React.Fragment>
        <SwipeableDrawer
          anchor={"right"}
          open={uiStore.isCatalogOpen}
          onClose={() => {
            uiStore.toggleCatalog({ catalogId: null });
            this.setState({ product: {}, catalogId: null });
            // console.info("Close drawer");
          }}
        >
          <div className={classes.container}>
            <div>{(this.state.product || {})._id ? this.renderContent() : null}</div>
            {!(this.state.product || {})._id || this.state.isSaving ? (
              <div className={`${classes.loader} ${this.state.isSaving ? classes.loaderSaving : ""}`}>
                <PageLoading />
              </div>
            ) : null}
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withComponents(withSnackbar(inject("uiStore")(ProductDetailDrawer))));
