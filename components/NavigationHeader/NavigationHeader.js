import React, { Component, useEffect } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import { Grid, AppBar, Toolbar, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles, useTheme } from "@material-ui/core/styles";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import { NavigationDesktop } from "components/NavigationDesktop";
import { NavigationMobile, NavigationToggleMobile } from "components/NavigationMobile";
import Hidden from "@material-ui/core/Hidden";
import inject from "hocs/inject";
import Router from "translations/i18nRouter";

const styles = (theme) => ({
  root: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  Borde: {
    borderBottom: "1px solid #979797",
  },
  Logo: {
    [theme.breakpoints.up("xs")]: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: "2%",
    },
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
    },
  },
  ContenedorMovil: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  searchbar: {
    color: "white",
    ["@media (max-width:599px)"]: {
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "10px",
      marginBottom: "6px"
    },
    ["@media (min-width:600px)"]: {
      marginTop: "1%",
    },
  },
  Espacio: {
    marginTop: "10px",
  },
  Espacio2: {
    marginTop: "20px",
  },
  Iconos: {
    ["@media (max-width:1279px) and (min-width:600px) "]: {
      display: "flex",
      justifyContent: "flex-start",
    },
    ["@media (min-width:1280px) "]: {
      display: "flex",
      justifyContent: "flex-end",
    },
    ["@media (max-width:599px) and (min-width:499px) "]: {
      marginLeft: "1%",
      marginTop: "5px"
    },
    ["@media (max-width:498px) and (min-width:450px) "]: {
      marginLeft: "2%",
      marginTop: "5px"
    },
    ["@media (max-width:449px)"]: {
      marginLeft: "3%",
      marginTop: "5px"
    }
  },
  Menu: {
    ["@media (max-width:449px)"]: {
      marginLeft: "-4%",
      marginTop: "16px"
    },
    ["@media (max-width:498px) and (min-width:450px) "]: {
      marginLeft: "-3%",
      marginTop: "16px"
    },
    ["@media (max-width:599px) and (min-width:499px) "]: {
      marginLeft: "-2%",
      marginTop: "21px"
    },
    ["@media (min-width:600px)"]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  LogoSize: {
    width: "111px",
    height: "71px",
  },
  ImageCover: {
    ["@media (min-width:600px)"]: {
      height: "480px",
      marginTop: "15px",
    },
    ["@media (max-width:599px)"]: {
      height: "327px",
      marginTop: "20px",
    },
  },
  AppBar_: {
    boxShadow: "0px 0px 0px 0px rgb(0 0 0 / 20%), 0px 0px 0px 0px rgb(0 0 0 / 14%), 0px 0px 0px 0px rgb(0 0 0 / 12%)",
    backgroundColor: theme.palette.background.theme_,
  },
  MessageCover: {
    fontWeight: "bold",
    fontSize: "36px",
    lineHeight: "42px",
    marginLeft: "auto",
    marginRight: "auto",
    ["@media (max-width:599px)"]: {
      width: "247px",
      height: "101px",
    },
  },
  GridMensaje: {
    display: "flex",
    justifyContent: "center",
    ["@media (min-width:900px)"]: {
      marginTop: "15%",
    },
    ["@media (max-width:899px) and (min-width:600px)"]: {
      marginTop: "19%",
    },
    ["@media (max-width:599px)"]: {
      marginTop: "20%",
    },
  },
  LogoDesktop: {
    width: theme.palette.Logo.WidthDesktop,
    height: theme.palette.Logo.HeightDesktop,
    cursor: "pointer"
  },
  LogoMobile: {
    width: theme.palette.Logo.WidthMobile,
    height: theme.palette.Logo.HeightMobile
  }
});


class NavigationHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", bandera: false, showAlert: false };
  }

  static propTypes = {
    classes: PropTypes.object,
    width: PropTypes.string,
    shop: PropTypes.shape({
      name: PropTypes.string,
    }),
    uiStore: PropTypes.shape({
      toggleMenuDrawerOpen: PropTypes.func,
    }),
    viewer: PropTypes.object,
    catalogItems: PropTypes.array,
  };

  static defaultProps = {
    classes: {},
  };

  hideAlert = () => this.setState({ showAlert: false });
  handleNavigationToggleClick = () => {
    this.props.uiStore.toggleMenuDrawerOpen();
  };

  handleOnClick2 = () => {
    Router.push("/");
  };

  render() {
    //urlLogo: Contiene la url de logo
    //urlLogoSize: Es un array donde estan las dimensiones del logo, [width,height], ejemplo:["10px","15px"]
    //ColoresBusqueda: color 1 es el color de letra, color 2 es color de fondo y color 3 es el del icono, array de colores,["black", "red", "blue"]
    //ColoresIcono, son los colores del icono, entrada: nombre o hexa del color,ejemplo: #FFFFF
    //MetodoBusqueda, debe de ser un metodo y debe de contener como parametro la busqueda
    //FondoColorMenu, fondo de color de las opciones del menu para version movil y escritorio
    //ColorIconoMenu, fondo del icono del menu cuando para versiones moviles
    const {
      classes,
      Logo,
      MetodoBusqueda,
      ImageCoverUrl,
      MessageCover,
      shop,
      cart,
      BanderaSlideHero,
      width,
      components: { SearchBar },
      components: { IconsActions },
      components: { SlideHero },
      withHero,
      catalogItems
    } = this.props;

    return (
      <>
        {isWidthUp("sm", width) ? (
          <>
            <Grid style={{ width: "100%" }} container spacing={5} key={1}>
              {/* Contenedor Principal */}
              <Grid item xs={11} sm={11} md={11} lg={11} key={2} className={classes.root}>
                <AppBar className={classes.AppBar_} position="static">
                  <Toolbar>
                    {/* LOGO */}
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3} key={3} className={classes.Logo}>
                      <img
                        src={Logo.urlLogo}
                        className={classes.LogoDesktop}
                        onClick={this.handleOnClick2}
                      />
                    </Grid>
                    {/* Bara de busqueda */}
                    <Grid item xs={8} sm={8} md={9} lg={9} xl={8} key={4} className={classes.searchbar}>
                      <SearchBar Metodo={MetodoBusqueda}
                        catalogItems={catalogItems}
                      />
                    </Grid>

                    {/* Iconos */}
                    <Grid item xs={2} sm={2} md={2} lg={3} xl={3} key={5} className={classes.Iconos}>
                      <IconsActions
                        width={width} cart={cart} />
                    </Grid>
                  </Toolbar>
                </AppBar>

                <Grid item xs={12} md={12} lg={12} key={6} className={classes.Borde}>
                  {/* Espacio Extra */}
                  <Grid item key={11} xs={11} md={11} lg={11} className={classes.Espacio}>
                    <h1> </h1>
                  </Grid>
                </Grid>

                {/* Espacio Extra */}
                <Grid key={7} item xs={12} md={12} lg={12} className={classes.Espacio2}>
                  <h1> </h1>
                </Grid>

                {/* Contenedor Navigation Menu */}
                <Grid item key={8} xs={12} md={12} lg={12} className={classes.Menu}>
                  <NavigationDesktop />
                </Grid>
              </Grid>
            </Grid>
            {withHero ? <SlideHero title={MessageCover} subtitle={""} background={ImageCoverUrl} type={"jpg"} /> : null}
          </>
        ) : (
          <>
            <Grid
              style={{ width: "100%" }}
              container
              columns={{ xs: 11, md: 11, lg: 11 }}
              spacing={5}
              key={1}
              className={classes.ContenedorMovil}
            >
              {/* Contenedor Principal */}

              {/* Contenedor Navigation Menu */}
              <Grid key={3} item xs={4} className={classes.Menu}>
                <Hidden mdUp>
                  <NavigationToggleMobile
                    onClick={this.handleNavigationToggleClick}
                  />
                </Hidden>
                <NavigationMobile shop={shop} Logo={Logo.urlLogo} />
              </Grid>

              {/* LOGO */}
              <Grid key={4} item xs={4} md={3} lg={3} className={classes.Logo}>
                <img src={Logo.urlLogo} className={classes.LogoMobile} />
              </Grid>

              {/* Iconos */}
              <Grid key={5} item xs={4} md={2} lg={2} className={classes.Iconos}>
                <IconsActions
                  width={width}
                  cart={cart} />
              </Grid>
            </Grid>

            {/* Bara de busqueda */}
            <Grid container style={{ width: "100%" }}>
              <Grid item key={6} xs={11} className={classes.searchbar}>
                <SearchBar size={"small"} Metodo={MetodoBusqueda}
                  catalogItems={catalogItems}
                />
              </Grid>
            </Grid>

            {/* Espacio Extra */}
            {withHero ? <SlideHero title={MessageCover} subtitle={""} background={ImageCoverUrl} type={"jpg"} /> : null}
          </>
        )}
      </>
    );
  }
}

export default withComponents(
  withWidth({ initialWidth: "md" })(withStyles(styles)(inject("uiStore")(NavigationHeader))),
);