import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import {TextField} from "@material-ui/core";
import Minus from "mdi-material-ui/Minus";
import Plus from "mdi-material-ui/Plus";
import styled from "styled-components";

const DesignGroupItems = styled.div``;

const styles = (theme) => ({
    incrementButton: {
        background: theme.palette.primary.dark,
        color: theme.palette.primary.light,
        borderRadius: "50%",
        width: "35px",
        height: "35px"
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
        value: PropTypes.number
    };

    static defaultProps = {
        classes: {},
        onChange() { }
    };

    constructor(props) {
        super(props);

        const value = props.value || 0;

        this.state = {
            initialValue: props.value,
            value
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
        const { className, classes: { incrementButton, buttonResponsive }} = this.props;
        const { value } = this.state;
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
                    >
                        <Minus style={{ fontSize: "20px"}} />
                    </ButtonBase>
                    <TextField
                        id="addToCartQuantityInput"
                        onChange={this.handleQuantityInputChange}
                        value={value}
                        InputProps={{
                            disableUnderline: true,
                            style:{paddingLeft:'50%',width:'100px'}
                        }}
                    />
                    <ButtonBase
                        variant="outlined"
                        color="default"
                        onClick={this.handleIncrementButton}
                        className={incrementButton}
                        disableRipple={true}
                        disableTouchRipple={true}
                    >
                        <Plus style={{ fontSize: "20px" }} />
                    </ButtonBase>
                </DesignGroupItems>

            </div>
        );
    }
}

export default withStyles(styles)(QuantityInput);