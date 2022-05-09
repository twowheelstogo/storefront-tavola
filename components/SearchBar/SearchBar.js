import React, { Component } from "react";
import { TextField, InputAdornment, Box, CircularProgress, Grid } from "@material-ui/core";
import { Magnify } from "mdi-material-ui";
import Autocomplete from "@material-ui/lab/Autocomplete";
//import { withComponents } from "@reactioncommerce/components-context";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Router from "translations/i18nRouter";

const styles = (theme) => ({
  root: {
    ["@media (min-width:600px)"]: {
      marginTop: "20px",
    },
  },
  input: {
    color: "#979797",
    fontWeight: "600",
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "#E3E3E3 !important",
  },
  Magnify_: {
    color: theme.palette.colors.SearchColor,
    cursor: "pointer"
  },
  InputAdornment_: {
    borderRightColor: theme.palette.colors.SearchColor,
    borderRightStyle: "solid"
  },
  TextField_: {
    backgroundColor: "#FFFFFF",
    borderRadius: '4px'
  },
  Contenedor: {
    ["@media (max-width:599px)"]: {
      borderLeft: "2px solid #979797",
      height: "43px"
    }
  },
  Letra: {
    color: '#000'
  },
  ImageBorder: {
    border: "2px solid #fff"
  },
  ContenedorPrincipal: {
    borderBottom: "2px solid #fff",
    color: "#202124",
    '&:hover': {
      backgroundColor: '#F6F6F6'
    }
  },
  ContenedorSecundario: {
    backgroundColor: "#202124",
  },
  option: {
    backgroundColor: "#FFF",
    // Hover
    '&[data-focus="true"]': {
      backgroundColor: '#F6F6F6',
    },
    // Selected
    '&[aria-selected="true"]': {
      backgroundColor: '#F6F6F6',
    },
  }
});

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { Busqueda: "", open: false };
  }

  static propTypes = {
    classes: PropTypes.object,
    catalogItems: PropTypes.array,
  };

  static defaultProps = {
    classes: {},
  };

  searchProduct(data) {
    if (typeof data === 'object') {
      Router.push("/product/" + data["slug"] + "/" + data["tagsID"]);
    }
    else {
      //alert('nop')
    }
  }

  render() {
    const { classes, Metodo, size, catalogItems } = this.props;
    const loading = this.state.open && catalogItems.length === 0;

    const renderBox = (option) => {
      return (
        <Grid container className={classes.ContenedorPrincipal}>
          <Grid item xs={4} sm={1} md={2} lg={2} >
            <img
              className={classes.ImageBorder}
              width="80%"
              height="90%"
              src={option.photo}
            />
          </Grid>

          <Grid item xs={8} sm={11} md={10} lg={10}>
            {option.name}
            <br />
            {option.price}
          </Grid>
        </Grid>

      );
    }

    return (
      <div className={classes.root}>
        <Autocomplete
          classes={{
            option: classes.option,
            paper: classes.option
          }}
          id="country-select-demo"
          // onKeyDown={(event) => {
          //   if (event.key === 'Enter') {
          //     event.defaultMuiPrevented = true;          
          //     this.searchProduct(this.state.Busqueda);          
          //   }
          // }}
          options={catalogItems}
          loading={loading}
          onChange={(event, newValue) => {
            this.setState({ Busqueda: newValue });
          }}
          onInputChange={(event, newInputValue) => {
            this.setState({ Busqueda: newInputValue });
          }}
          getOptionLabel={(option) => option.name}
          renderOption={(option) => {
            return renderBox(option)
          }}
          open={this.state.open}
          onOpen={() => {
            this.setState({ open: true });
          }}
          onClose={() => {
            this.setState({ open: false });
          }}

          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              size={size}
              placeholder="Buscar producto..."
              fullWidth
              className={classes.TextField_}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  this.searchProduct(this.state.Busqueda);
                }
              }}
              InputProps={{
                ...params.InputProps,
                autoComplete: 'new-password',
                className: classes.input,
                classes: {
                  notchedOutline: classes.notchedOutline,
                },
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress style={{ color: "white" }} size={20} /> : null}
                    <InputAdornment position="end" className={classes.InputAdornment_}>
                      <div className={classes.Contenedor}><p style={{ color: "transparent" }}>ss</p></div>
                      <Magnify className={classes.Magnify_} onClick={() => this.searchProduct(this.state.Busqueda)} />
                    </InputAdornment>
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </div>
    );
  }
}


export default withStyles(styles)(SearchBar);