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
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withComponents } from "@reactioncommerce/components-context";
import CancelIcon from "@material-ui/icons/Cancel";
import ProductDetailAddToCart from "components/ProductDetailAddToCart";
import priceByCurrencyCode from "lib/utils/priceByCurrencyCode";
import Collapse from "rc-collapse";
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
  constructor(props) {
    super(props);
    this.state = {
      right: false,
    };
  }
  determineProductPrice() {
    // this.props.attr => false
    // const { attr } = this.props
    const { product, uiStore, currencyCode } = this.props;

    let selectedTotal = 0.0;
    for (const [variantId, optionIds] of Object.entries(uiStore.SelectedOptions)) {
      const variant = product.variants.find((v) => v._id === variantId);
      if (!variant) {
        console.info("Error the variant not exists");
        continue;
      }
      for (const option of variant.options || []) {
        if (!optionIds.includes(option._id)) continue;

        const pricing = (option.pricing || []).find((p) => (p.currency || {}).code === currencyCode);
        console.info("currencyCode", currencyCode);
        console.info("pricing", option.pricing, pricing);

        if (!pricing) {
          console.info("Error the pricing option not exists");
          continue;
        }
        selectedTotal += pricing.price || 0;

      }
    }
    console.info("determineProductPrice", selectedTotal);
    return selectedTotal;
  }
  handleSelectOption(variant, option) {
    const { product, uiStore, currencyCode } = this.props;
    if ((uiStore.SelectedOptions[variant._id] || []).includes(option._id)) {
      uiStore.unSetSelectedOption(variant._id, option._id);
    } else {
      uiStore.setSelectedOption(variant._id, option._id);
    }
    console.info("handleSelectOption", uiStore.SelectedOptions);
    // ReCalculate the Selected Total
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

  DrawerViewList() {
    const { product, uiStore, currencyCode, classes } = this.props;
    console.info("DrawerViewList ---> product", product);
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

          {product.variants.map((e) => (
            <Collapse accordion={true}>
              <Panel header={`${e.title}`} headerClass="my-header-class">
                {e.multipleOption ? (
                  <div>
                    {e.options &&
                      e.options.map((op) => (
                        <FormControl component="fieldset">
                          <FormGroup>
                            <FormControlLabel
                              style={{marginRight:100}}
                              control={
                                <Checkbox name={op.title} onClick={(ev) => this.handleSelectOption(e, op, ev)} />
                              }
                              label={
                                <div style={{display: 'flex'}}>
                                  <Typography style={{float: 'left'}}>{op.title}</Typography>
                                  <div  style={{float: 'left'}}>
                                    <Typography style={{position: 'absolute'}}>{(op.pricing[0] || "").displayPrice}</Typography>
                                  </div>
                                </div>
                              }
                            />
                          </FormGroup>
                        </FormControl>
                      ))}
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
          ))}
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

export default withComponents(withStyles(styles)(ProductDetailDrawer));
