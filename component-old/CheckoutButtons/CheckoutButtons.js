import React, { Component } from "react";
import PropTypes from "prop-types";
// import Button from "@reactioncommerce/components/Button/v1";
import Router from "translations/i18nRouter";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import { addTypographyStyles, applyTheme } from "@reactioncommerce/components/utils";

const Div = styled.div``;

const styles = (theme) => ({
  purchasingProcess:{
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
  
  },
  buyHome:{
    backgroundColor: "#F6F6F6",
    color: '#1D0D13',
    border: '1px solid #1D0D13',
  }
})

class CheckoutButtons extends Component {
  static propTypes = {
    /**
     * Set to `true` to prevent the button from calling `onClick` when clicked
     */
    isDisabled: PropTypes.bool,
    /**
     * The NextJS route name for the primary checkout button.
     */
    primaryButtonRoute: PropTypes.string,
    /**
     * Text to display inside the button
     */
    primaryButtonText: PropTypes.string,
    /**
     * className for primary checkout button
     */
    primaryClassName: PropTypes.string
  }

  static defaultProps = {
    primaryButtonRoute: "/cart/checkout",
    primaryButtonText: "Procesar a la compra",
    secondButtonRoute: "/",
    secondButtonText: "Seguir comprando"
  };

  handleOnClick = () => {
    const { primaryButtonRoute } = this.props;
    Router.push(primaryButtonRoute);
  }

  handleOnClickSecond = () => {
    const { secondButtonRoute } = this.props;
    Router.push(secondButtonRoute)
  }

  render() {
    const {
      isDisabled,
      primaryClassName,
      primaryButtonText,
      secondButtonText,
      classes:{purchasingProcess,buyHome}
    } = this.props;
    

    return (
      <Div>
        <Div style={{paddingBottom:'10px'}}>
          <Button
            fullWidth
            className={buyHome}
            variant="contained"
            onClick={this.handleOnClickSecond}
            disableRipple
          >
            {secondButtonText}
          </Button>
        </Div>
        <Button
          fullWidth
          className={purchasingProcess}
          onClick={this.handleOnClick}
          variant="contained"
          disableRipple
        >
          {primaryButtonText}
        </Button>
      </Div>
    );
  }
}

export default withStyles(styles)(CheckoutButtons);