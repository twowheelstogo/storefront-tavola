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
      const ids = catalogItems.map((catalog) => catalog.node.product.productId);
      const product =
        ((catalogItems.find((catalog) => catalog.node.product.productId === opts.catalogId) || {}).node || {})
          .product || {};
      console.log("opts.catalogId", opts.catalogId, this.state.refresh, product, ids);
      this.setState({
        refresh: this.state.refresh + 1,
        isSaving: false,
        catalogId: opts.catalogId,
        product,
      });
    }
  }
  renderView() {
    const { uiStore, classes } = this.props;
    return (
      <div>
        <h1>catalogId:{this.props.uiStore.catalogId}</h1>
        <h1>cartCatalogId:{this.props.uiStore.cartCatalogId}</h1>
      </div>
    );
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
            console.info("Close drawer");
          }}
        >
          <div className={classes.container}>
            {(this.state.product || {})._id ? (
              this.renderView()
            ) : (
              <div className={classes.loader}>
                <PageLoading />
              </div>
            )}
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withComponents(withSnackbar(inject("uiStore")(ProductDetailDrawer))));
