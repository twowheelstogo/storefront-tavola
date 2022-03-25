import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import GuestForm from "@reactioncommerce/components/GuestForm/v1";
import Button from "@reactioncommerce/components/Button/v1";
import useStores from "hooks/useStores";

// flex wrapper jss mixin

const flexWrapper = () => ({
  alignItems: "stretch",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start"
});

const styles = (theme) => ({
	loginWrapper: {
		...flexWrapper(),
		paddingBottom: theme.spacing(8),
		[theme.breakpoints.up("md")]: {
			minHeight: "400px",
			paddingBottom: 0,
			paddingRight: theme.spacing(8)
		}
	},
  loginButton: {
    marginTop: theme.spacing(3),
	backgroundColor: theme.palette.secondary.botones,    
    color: theme.palette.colors.BotonColor,
    borderColor: theme.palette.secondary.botones, 
    fontWeight: "800",
    fontSize:"18px",    
    "&:hover": {      
      backgroundColor: theme.palette.secondary.botones,    
      color: theme.palette.colors.BotonColor,
      borderColor: theme.palette.secondary.botones,   
      }
  },
  guestWrapper: {
    ...flexWrapper(),
    borderTop: `solid 1px ${theme.palette.reaction.black10}`,
    paddingTop: theme.spacing(8),
    [theme.breakpoints.up("md")]: {
      borderLeft: `solid 1px ${theme.palette.reaction.black10}`,
      borderTop: "none",
      paddingLeft: theme.spacing(8),
      paddingTop: 0
    }
  }
});

const Entry = (props) => {
  const { classes, setEmailOnAnonymousCart } = props;
  const { uiStore } = useStores();
  const { setEntryModal } = uiStore;
  return (
    <Grid container>
      <Grid item xs={12} >
        <div className={classes.loginWrapper}>      
		<Typography variant="h6" gutterBottom style={{marginLeft:"auto",marginRight:"auto"}}>
							Registrate o inicia Sesión
		</Typography>    
          <Button
            onClick={() => setEntryModal("login")}
            actionType="important"
            isFullWidth
            className={classes.loginButton}
          >
            INICIAR SESIÓN
          </Button>
          <Button
            onClick={() => setEntryModal("signup")}
            actionType="secondary"
            isFullWidth
            className={classes.loginButton}
          >
            CREAR NUEVA CUENTA
          </Button>
        </div>
      </Grid>    
    </Grid>
  );
};

Entry.defaultProps = {
  setEmailOnAnonymousCart() {}
};

Entry.propTypes = {
  classes: PropTypes.object,
  onLoginButtonClick: PropTypes.func,
  onRegisterButtonClick: PropTypes.func,
  setEmailOnAnonymousCart: PropTypes.func,
  theme: PropTypes.object
};

export default withStyles(styles, { withTheme: true })(Entry)