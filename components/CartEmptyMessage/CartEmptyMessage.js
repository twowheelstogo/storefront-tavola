import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { addTypographyStyles, applyTheme, CustomPropTypes } from "@reactioncommerce/components/utils";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({ 
  BotonPrincipal:{
    backgroundColor: theme.palette.secondary.botones,    
    color: theme.palette.colors.BotonColor,
    borderColor: theme.palette.secondary.botones, 
    fontWeigth: "800",
    fontSize:"18px"
  },
});

const EmptyButton = styled.div` 
  display: flex;
  justify-content: center;  
`;

const EmptyMessage = styled.div`
  ${addTypographyStyles("CartEmptyMessage", "bodyText")}
  display: flex;
  justify-content: center;
  margin-bottom: ${applyTheme("CartEmptyMessage.textToButtonSpacing")};
`;

class CartEmptyMessage extends Component {
  static propTypes = {
    /**
     * Text to display inside the button
     */
    buttonText: PropTypes.string,
    /**
     * If you've set up a components context using
     * [@reactioncommerce/components-context](https://github.com/reactioncommerce/components-context)
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      /**
       * Pass either the Reaction Button component or your own component that
       * accepts compatible props.
       */
      Button: CustomPropTypes.component.isRequired
    }).isRequired,
    /**
     * Text to display inside the message area
     */
    messageText: PropTypes.string,
    /**
     * Onclick function to pass to the Button component. Not handled internally, directly passed
     */
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    buttonText: "Continuar comprando",
    messageText: "Tu carrito se encuentra vacío.",
    classes: {},
  };

  handleOnClick = () => {
    this.props.onClick();
  }

  static propTypes = {    
    classes: PropTypes.object,    
  };


  render() {
    const { classes,buttonText, components, messageText } = this.props;
    const { Button } = components;

    return (
      <Fragment>
        <EmptyMessage>{messageText}</EmptyMessage>
        <EmptyButton className={classes.BotonPrincipal}  >
          <Button onClick={this.handleOnClick} 
          className={classes.BotonPrincipal}          
          >{buttonText}</Button>
        </EmptyButton>
      </Fragment>
    );
  }
}

export default withComponents(withStyles(styles)(CartEmptyMessage));