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
    };
  }
  componentDidUpdate() {
    this.init();
  }
  init(opts = {}) {
    const { uiStore, catalogItems } = this.props;
    opts.catalogId = opts.catalogId || uiStore.catalogId;
    console.log("opts.catalogId", opts.catalogId);
    if (opts.catalogId && opts.catalogId !== this.state.catalogId) {
      this.setState({
        catalogId: opts.catalogId,
        product: {
          ...((catalogItems.find((catalog) => catalog.node.product.productId === opts.catalogId) || {}).node || {})
            .product,
        },
      });
    }
  }
  render() {
    const { uiStore, classes } = this.props;

    return (
      <React.Fragment>
        <SwipeableDrawer
          anchor={"right"}
          open={this.props.uiStore.isCatalogOpen}
          onClose={() => {
            this.props.uiStore.toggleCatalog({ catalogId: null });
            this.setState({ product: {}, catalogId: null });
          }}
        >
          <div className={classes.container}>
            id:{this.props.uiStore.catalogId}
            {!(this.state.product || {})._id ? (
              <div className={classes.loader}>
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
