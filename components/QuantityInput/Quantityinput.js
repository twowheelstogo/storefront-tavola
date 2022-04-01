import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import { TextField } from "@material-ui/core";
import Minus from "mdi-material-ui/Minus";
import Plus from "mdi-material-ui/Plus";
import styled from "styled-components";
import lodash from "lodash";
const DesignGroupItems = styled.div``;

const styles = (theme) => ({
  incrementButton: {
    background: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    borderRadius: "50%",
    width: "35px",
    height: "35px",
  },
});

class QuantityInput extends Component {
  static propTypes = {
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * MUI theme classes
     */
    classes: PropTypes.object,
    /**
     * On change hanlder for input
     */
    onChange: PropTypes.func,
    /**
     * Prepopulate the input's value.
     */
    defaultValue: PropTypes.number,
    /**
     * Prepopulate the input's value.
     */
    value: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
  };

  static defaultProps = {
    classes: {},
    onChange() {},
  };

  constructor(props) {
    super(props);

    const value = props.value || props.defaultValue || 0;

    this.state = {
      defaultValue: props.defaultValue,
      // initialValue: props.value,
      value,
    };
  }

  handleChanged(value) {
    const { onChange } = this.props;
    onChange(value);
  }

  handleQuantityInputChange = (event) => {
    const { value } = event.target;

    const numericValue = Math.floor(Number(value));

    if (Number.isNaN(numericValue)) return;

    this.setState({ value: numericValue });
    this.handleChanged(numericValue);
  };

  handleIncrementButton = () => {
    const value = this.state.value + 1;

    this.setState({ value });
    this.handleChanged(value);
  };

  handleDecrementButton = () => {
    const value = this.state.value - 1;

    if (value >= 0) {
      this.setState({ value });
      this.handleChanged(value);
    }
  };

  render() {
    const {
      className,
      classes: { incrementButton, buttonResponsive },
    } = this.props;
    const { value, defaultValue } = this.state;
    console.log("defaultValue ------> Quantity Input", defaultValue);
    return (
      <div>
        <DesignGroupItems>
          <ButtonBase
            color="default"
            variant="outlined"
            onClick={this.handleDecrementButton}
            className={incrementButton}
            disableRipple
            disableTouchRipple
            disabled={lodash.isInteger(this.props.min) && this.props.min >= this.state.value}
          >
            <Minus style={{ fontSize: "20px" }} />
          </ButtonBase>
         <TextField
            id="addToCartQuantityInput"
            onChange={this.handleQuantityInputChange}
            defaultValue={defaultValue}
            value={value}
            InputProps={{
              disableUnderline: true,
              style: { paddingLeft: "50%", width: "40px" },
            }}
          />  
          <ButtonBase
            variant="outlined"
            color="default"
            onClick={this.handleIncrementButton}
            className={incrementButton}
            disableRipple={true}
            disableTouchRipple={true}
            disabled={lodash.isInteger(this.props.max) && this.props.max <= this.state.value}
          >
            <Plus style={{ fontSize: "20px" }} />
          </ButtonBase>
        </DesignGroupItems>
      </div>
    );
  }
}

export default withStyles(styles)(QuantityInput);
