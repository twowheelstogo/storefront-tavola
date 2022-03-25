import React, { Component } from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "mdi-material-ui/Menu";
import { withStyles } from "@material-ui/core/styles";
const styles = (theme) => ({ 
  IconColor: {
    color: theme.palette.colors.buttonBorderColor,
    //color :"red"
  },
});

class NavigationToggleMobile extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    ModalMenuColores: PropTypes.object,
    classes: PropTypes.object,
  };
  

  static defaultProps = {
    classes: {},
  };

  render() {
    const { classes } = this.props;
    

    return (
      <IconButton color="inherit" onClick={this.props.onClick}>
        <MenuIcon  className={classes.IconColor}/>
      </IconButton>
    );
  }
}

export default withStyles(styles)(NavigationToggleMobile);