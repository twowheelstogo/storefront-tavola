import React, { Component } from "react";
import PropTypes from "prop-types";
import inject from "hocs/inject";
import ShopLogo from "@reactioncommerce/components/ShopLogo/v1";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuList from "@material-ui/core/MenuList";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "mdi-material-ui/Close";
import Link from "components/Link";
import NavigationItemMobile from "./NavigationItemMobile";
import NavigationSubMenuMobile from "./NavigationSubMenuMobile";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    flex: "0 0 auto",
  },
  toolbarTitle: {
    position: "absolute",
    width: "100%",
    height: "auto",
    textAlign: "center",
  },
  title: {
    display: "inline-block",
    color: theme.palette.reaction.reactionBlue,
    borderBottom: `solid 5px ${theme.palette.reaction.reactionBlue200}`,
  },
  menu: {
    flex: "1 1 auto",
    overflowY: "auto",
    width: 320,
  },
  subNav: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 320,
    height: "100vh",
    backgroundColor: theme.palette.background.default,
  },  
  logo: {
    margin: theme.spacing(2, 0),
    width: 75,
    height: "auto",
  },
  Toolbar_ : {
    backgroundColor: theme.palette.background.theme_,    
    color: theme.palette.colors.TextTheme,
  },
  CloseIcon_:{
    color: theme.palette.colors.TextTheme,
  },
  Divider_:{
    backgroundColor: theme.palette.colors.TextTheme, 
    height: "3px"
  },
  MenuList_:{    
    backgroundColor: theme.palette.background.theme_,    
    color: theme.palette.colors.TextTheme,
      height: "100%",    
      "& .MuiDivider-root": {
        borderBottomStyle: "solid",
      },
  }
});

class NavigationMobile extends Component {
  static propTypes = {
    classes: PropTypes.object,
    Logo: PropTypes.string,
    navItems: PropTypes.object,
    shop: PropTypes.shape({
      name: PropTypes.string,
    }),
    uiStore: PropTypes.shape({
      closeMenuDrawer: PropTypes.func,
    }).isRequired,
    ModalMenuColores: PropTypes.object,
  };

  static defaultProps = {
    classes: {},
    navItems: {},
  };

  state = {
    navItem: null,
  };

  handleNavItemClick = (navItem) => {
    this.setState({
      navItem,
    });
  };

  handleCloseSubMenu = () => {
    this.setState({ navItem: null });
  };

  handleClose = () => {
    this.handleCloseSubMenu();
    this.props.uiStore.closeMenuDrawer();
  };

  render() {
    const { classes, navItems, uiStore, shop, Logo } = this.props;

    const renderNavItem = (navItem, index) => (
    
        <NavigationItemMobile
          key={index}
          isTopLevel
          navItem={navItem}
          onClick={this.handleNavItemClick}          
        />
 
    );

    if (navItems && navItems.items) {
      return (
        <Drawer open={uiStore.isMenuDrawerOpen} onClose={this.handleClose}>
          <div className={classes.header}>
            <Toolbar
              disableGutters
              className={classes.Toolbar_}
            >
              <div className={classes.toolbarTitle}>              
                <Link route="/">
                  <img
                    // src = 'https://firebasestorage.googleapis.com/v0/b/twg-rrhh.appspot.com/o/company-logos%2Flulis-logo%20(2).png?alt=media&token=50e9772a-81c8-43d8-ba5d-29c70ed918c4'
                    src={Logo}
                    className={classes.logo}
                  />
                </Link>
              </div>
              <IconButton onClick={this.handleClose}>
                <CloseIcon className={classes.CloseIcon_} />
              </IconButton>
            </Toolbar>
            <Divider className={classes.Divider_} />
          </div>
          <nav className={classes.menu}>
            <MenuList
              className={classes.MenuList_}              
              disablePadding              
            >
              {navItems.items.map(renderNavItem)}
            </MenuList>
          </nav>
          <Slide direction="left" in={!!this.state.navItem}>
            <nav className={classes.subNav}>
              <NavigationSubMenuMobile navItem={this.state.navItem} onBackButtonClick={this.handleCloseSubMenu} />
            </nav>
          </Slide>
        </Drawer>
      );
    }

    // If navItems.items aren't available, skip rendering of navigation
    return null;
  }
}

export default withStyles(styles)(inject("navItems", "uiStore")(NavigationMobile));