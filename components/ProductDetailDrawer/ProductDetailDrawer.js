import React, { Fragment } from "react";
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

function ProductDetailDrawer({ values, uiStore, currencyCode, product }) {
  console.info("uistore", uiStore.SelectedOptions);

  const determineProductPrice = () => {
    let selectedTotal = 0.0;
    for (const [variantId, optionIds] of Object.entries(
      uiStore.SelectedOptions
    )) {
      const variant = product.variants.find((v) => v._id === variantId);
      if (!variant) {
        console.info("Error the variant not exists");
        continue;
      }
      for (const option of variant.options || []) {
        if (!optionIds.includes(option._id)) continue;

        // pricing[currencyCode]
        console.info("determineProductPrice", option);
        // priceByCurrencyCode
      }
    }
  };
  const handleSelectOption = (variant, option) => {
    if ((uiStore.SelectedOptions[variant._id] ||[]).includes(option._id)) {
      uiStore.unSetSelectedOption(variant._id, option._id);
    } else {
      uiStore.setSelectedOption(variant._id, option._id);
    }
    console.info("handleSelectOption", uiStore.SelectedOptions);
    // ReCalculate the Selected Total
    determineProductPrice();
  };

  const classes = useStyles();
  const [state, setState] = React.useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const DrawerViewList = ({ values}) => {
    console.log(values); 
    return (
      <Fragment>
        <div role="presentation" style={{ width: 400, background: "white" }}>
          <div style={{ position: "relative" }}>
            {values.primaryImage !== null ? (
              <img
                src={values.primaryImage.URLs.medium}
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
              onClick={toggleDrawer("right", false)}
            >
              <CancelIcon />
            </IconButton>
          </div>
          <Typography variant="h4" component="h2" style={{ padding: "20px 0px 0px 20px", fontSize: 30 }}>
            {values.title}
          </Typography>
          <Typography variant="h6" style={{ padding: "5px 0px 0px 20px", fontSize: 18 }}>
            {values.pricing[0].displayPrice}
          </Typography>
          <Typography variant="h6" style={{ padding: "10px 0px 0px 20px", color: "#979797", fontSize: 16 }}>
            {values.description}
          </Typography>

          {values.variants.map((e) => (
            <Collapse accordion={true}>
              <Panel header={`${e.title}`} headerClass="my-header-class">
                {e.multipleOption ? (
                  <div>
                    {e.options &&
                      e.options.map((op) => (
                        <FormControl component="fieldset">
                          <FormGroup>
                            <FormControlLabel control={<Checkbox name={op.title} onClick={(ev) =>handleSelectOption(e, op,ev)}/>} label={op.title} />
                          </FormGroup>
                        </FormControl>
                      ))}
                  </div>
                ) : (
                  <div>
                    {e.options &&
                      e.options.map((op) => (
                        <FormControl component="fieldset">
                          <RadioGroup aria-label="gender" name="gender1" >
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
            style={{ background: "#1D0D13", color: "white", position: "absolute", left: "15%", bottom: 20 }}
          >
            {" "}
            Añadir Al Carrito - {` price all cart`}
          </Button>
          <ProductDetailAddToCart />
        </div>
      </Fragment>
    );
  };

 /*  console.info("Load", uiStore); */
  return (
    <React.Fragment key={"right"}>
      <CardContainerHorizontal
        withBorder
        onClick={toggleDrawer("right", true)}
        boderColor={"2px solid rgba(151, 151, 151, 0.5)"}
      >
        {values.primaryImage !== null ? (
          <img src={values.primaryImage.URLs.medium} className={classes.imageProduct}></img>
        ) : (
          <img src="/images/placeholder.gif" />
        )}
        <CardContent>
          <Div>
            <StyledTitle>{values.title}</StyledTitle>
            <StyledSubtitle>{values.description}</StyledSubtitle>
          </Div>
          <Div>
            <Typography className={classes.textPrice}>{values.pricing[0].displayPrice}</Typography>
          </Div>
        </CardContent>
      </CardContainerHorizontal>
      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        <DrawerViewList values={values} />
      </SwipeableDrawer>
    </React.Fragment>
  );
}

export default withComponents(withStyles(styles)(ProductDetailDrawer));
