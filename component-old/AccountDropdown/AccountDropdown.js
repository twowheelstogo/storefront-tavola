import React, { useState, Fragment, useEffect } from "react";
import inject from "hocs/inject";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { AccountCircleOutline } from "mdi-material-ui";
//import AccountIcon from "mdi-material-ui/Account";
import Popover from "@material-ui/core/Popover";
import useViewer from "hooks/viewer/useViewer";
import Link from "components/Link";
import useStores from "hooks/useStores";
import EntryModal from "../Entry/EntryModal";
import getAccountsHandler from "../../lib/accountsServer.js";

const useStyles = makeStyles((theme) => ({  
  accountDropdown: {
    width: 320,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.TextTheme, 
    border:"1px solid white"
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.TextTheme, 
    border:"1px solid"
  },
  emailUser: {
    fontWeight: "700",
    ["@media (min-width:600px)"]: {
      marginTop: "6px"
    },
    ["@media (max-width:599px)"]: {
      marginTop: "2px"
    },
  },
  emailIcon: {
    backgroundColor: theme.palette.colors.buttonBorderColor,
    color: "#FFF",    
    display: "flex",
    justifyContent:"center",    
    ["@media (min-width:900px)"]: {
      width: "31px",
      height: "31px",
      fontSize: "18px",
    },
    ["@media (max-width:899px) and (min-width:600px)"]: {
      width: "30px",
      height: "30px",
      fontSize: "17px",
    },
    ["@media (max-width:599px)"]: {
      width: "21px",
      height: "21px",
      fontSize: "15px",
    },
    borderRadius: "20px"
  },
  Usuario: {
    color: theme.palette.colors.buttonBorderColor,
    ["@media (min-width:600px)"]: {
      width: "35px",
      height: "35px",
    },
    ["@media (max-width:599px)"]: {
      width: "25px",
      height: "25px",
    },
  },
  BotonPrincipal:{
    backgroundColor: theme.palette.secondary.botones,    
    color: theme.palette.colors.BotonColor,    
    fontWeight: "800",    
    "&:hover": {      
      backgroundColor: theme.palette.secondary.botones,    
      color: theme.palette.colors.BotonColor,
      borderColor: theme.palette.secondary.botones,   
      }
  },  
  Borde:{
    marginTop: "0.5rem",
    marginRight: "1rem",        
  },

}));

const AccountDropdown = (props) => {
  const router = useRouter();
  const { uiStore } = useStores();
  const { setEntryModal } = uiStore;
  const resetToken = router?.query?.resetToken;
  const classes = useStyles();
  const [anchorElement, setAnchorElement] = useState(null);
  const [viewer, , refetch] = useViewer();
  const { accountsClient } = getAccountsHandler();
  const isAuthenticated = viewer && viewer._id;

  useEffect(() => {
    // Open the modal in case of reset-password link
    if (!resetToken) {
      return;
    }
    setEntryModal("reset-password");
  }, [resetToken]);

  const onClose = () => {
    setAnchorElement(null);
  };

  const handleSignOut = async () => {
    await accountsClient.logout();
    await refetch();
    onClose();
  };

  const toggleOpen = (event) => {
    setAnchorElement(event.currentTarget);
  };
  
  console.log(viewer);
  
  return (
    <Fragment>
      <EntryModal onClose={onClose} resetToken={resetToken} />
      {isAuthenticated ? (
        // <ButtonBase onClick={toggleOpen}>                  
        // <ViewerInfo viewer={viewer} className={classes.Info_}/> 
        // </ButtonBase>        
        <IconButton color="inherit" onClick={toggleOpen}>
          <div className={classes.emailIcon}>
          <span className={classes.emailUser}>{viewer.emailRecords[0].address.substring(0,1).toUpperCase()}</span>
          </div>
        </IconButton>
      ) : (
        <IconButton color="inherit" onClick={toggleOpen}>
          <AccountCircleOutline className={classes.Usuario}/>
        </IconButton>
      )}

      <Popover      
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={Boolean(anchorElement)}
        onClose={onClose}
        className={classes.Borde}
      >
        <div className={classes.accountDropdown}>
          {isAuthenticated ? (
            <Fragment >
              <div className={classes.marginBottom}>
                <Link href="/profile/address">
                  <Button  className={classes.BotonPrincipal} fullWidth>
                    Perfil
                  </Button>
                </Link>
              </div>
              <div className={classes.marginBottom}>
                <Button className={classes.BotonPrincipal} fullWidth onClick={() => setEntryModal("change-password")}>
                  Cambiar Contraseña
                </Button>
              </div>              
              <Button className={classes.BotonPrincipal} fullWidth onClick={handleSignOut} variant="contained">
                Cerrar Sesión
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <div className={classes.authContent}>
                <Button className={classes.BotonPrincipal}  fullWidth onClick={() => setEntryModal("login")}>
                  Iniciar Sesión
                </Button>
              </div>
              <br/>
              <Button className={classes.BotonPrincipal} fullWidth onClick={() => setEntryModal("signup")}>
                Crear Cuenta
              </Button>
            </Fragment>
          )}
        </div>
      </Popover>
    </Fragment>
  );
};

export default inject("authStore")(AccountDropdown);