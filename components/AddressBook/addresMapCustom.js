import React, { Component, Fragment, useEffect, useState } from "react";
import { Grid, useMediaQuery, Divider, Button } from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/core/styles";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import styled from "styled-components";
import { StandaloneSearchBox } from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import { applyTheme } from "@reactioncommerce/components/utils";
import GoogleMapComponent from "components/GoogleMaps";
import PinButton from "components/PinButtonCustom";

const styles = (theme) => ({
  flexForm: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  flexMap: {
    padding: 0,
    flex: "1 1 auto",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  form: {
    width: "100%",
    maxWidth: "600px",
    alignSelf: "center",
    paddingLeft: "auto",
    paddingRight: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingTop: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    paddingBottom: theme.spacing(5),
    justifyContent: "space-between",
  },
  map: {
    width: "100%",
    height: "100%",
    textAlign: "center",
  },
  searchInput: {
    paddingBottom: theme.spacing(2),
  },
  addressItems: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
});

const GridWeb = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  height: calc((80vh - 70px) + 150px);
  width: calc(${applyTheme("md", "breakpoints")}px - 180px);
`;

const GridMobile = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: calc(${applyTheme("sm", "breakpoints")}px - 225px);
`;

// text-align: center;
//   display: block;
//   margin-left: auto;
//   margin-right: auto;
const PinLocation = styled.div`
  position: absolute;
  top: calc(80vh - 30px);
  left: 10%;
  width: 80%;
  margin: 0px -50px -15px 0px;
`;

const PlacesWithStandaloneSearchBox = (props) => {
  return (
    <div data-standalone-searchbox="">
      <StandaloneSearchBox
        ref={props.onSearchBoxMounted}
        bounds={props.bounds}
        onPlacesChanged={() => {
          props.onPlacesChanged(props.authStore.accessToken);
        }}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
      >
        {props.children}
      </StandaloneSearchBox>
    </div>
  );
};

const PlacesWithSearchBox = (props) => {
  return (
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={() => {
        props.onPlacesChanged(props.authStore.accessToken);
      }}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
    >
      <div style={{ width: "90%", padding: "10px" }}>{props.children}</div>
    </SearchBox>
  );
};

const RenderWeb = withStyles(styles)((props) => {
  const {
    classes,
    components: { TextInput },
    googleProps,
    value,
    setShowForm,
  } = props;

  const [current, setCurrent] = useState(0);

  return (
    <Fragment>
      <Grid container style={{ minHeight: "calc(80vh - 70px)" }}>
        <Grid item xs={12} md={12}>
          <div className={classes.flexMap}>
            <div className={classes.map}>
              <h4>Fijar el pin en la dirección exacta</h4>
              <p>Selecciona la ubicación en donde entregaremos tu pedido</p>
              {/* <div className={classes.searchInput}>
                <PlacesWithStandaloneSearchBox {...props} {...googleProps}>
                  <TextInput id="search" name="search" placeholder="buscar una dirección" />
                </PlacesWithStandaloneSearchBox>
              </div> */}
              <GoogleMapComponent
                authStore={props.authStore}
                {...googleProps}
                // location={value && value?.geolocation}
                SearchBox={
                  <PlacesWithSearchBox {...props} {...googleProps}>
                    <TextInput
                      id="search"
                      name="search"
                      placeholder="buscar una dirección"
                      style={{ background: "red" }}
                    />
                  </PlacesWithSearchBox>
                }
              />
              <PinLocation>
                <PinButton
                  onClick={() => {
                    setShowForm(true);
                    setCurrent(1);
                  }}
                  buttonTitle={"Fijar"}
                />
              </PinLocation>
            </div>
          </div>
        </Grid>
      </Grid>
    </Fragment>
  );
});

const RenderMobile = withStyles(styles)((props) => {
  const [current, setCurrent] = useState(0);
  const {
    googleProps,
    classes,
    components: { TextInput, AddressForm },
    value,
    setShowForm,
  } = props;
  // const {
  //   query: { addressBookId },
  // } = router;
  let form = null;
  // const [state, setState] = useState({
  //   address: value ? value.address : "ninguna",
  //   description: value ? value.description : "ninguna",
  // });
  // const handleChange = (event) => {
  //   setState({
  //     description: event.description ? event.description : "",
  //     address: event.address ? event.address : "",
  //   });
  // };
  return (
    <Fragment>
      {current == 0 && (
        <Grid container style={{ minHeight: "calc(100vh - 130px)" }}>
          <Grid item xs={12}>
            <div className={classes.flexMap}>
              <div className={classes.map}>
                <div className={classes.searchInput}>
                  <PlacesWithStandaloneSearchBox {...props} {...googleProps}>
                    <TextInput id="search" name="search" placeholder="buscar una dirección" />
                  </PlacesWithStandaloneSearchBox>
                </div>
                <div style={{ height: "500px" }}>
                  <GoogleMapComponent
                    authStore={props.authStore}
                    {...googleProps}
                    location={value && value?.geolocation}
                  />
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  paddingBottom: "20px",
                  paddingTop: "10px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
              >
                <h4>Fijar el pin en la dirección exacta</h4>
                <p>Selecciona la ubicación en donde entregaremos tu pedido</p>
                <PinButton
                  onClick={() => {
                    setCurrent(1);
                  }}
                  buttonTitle={"Fijar"}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      )}
      {current == 1 && (
        <Grid container style={{ minHeight: "calc(100vh - 130px)" }}>
          <Grid item xs={12}>
            <div className={classes.flexForm}>
              <div className={classes.form}>
                <div className={classes.addressItems}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LocationSearchingIcon />}
                    onClick={() => setCurrent(0)}
                  >
                    Cambiar la ubicación
                  </Button>
                  <h1>Form</h1>
                  {/* <RenderedForm>
                    <AddressForm
                      ref={(formEl) => {
                        form = formEl;
                      }}
                      onChange={handleChange}
                      value={value}
                      onSubmit={props.handleAddAddress}
                    />
                  </RenderedForm> */}
                </div>
                <div>
                  <PinButton
                    disabled={props.isSent}
                    onClick={() => {
                      form.submit();
                    }}
                    buttonTitle={"Guardar Cambios"}
                    // buttonSubtitle={`${state.description} - ${state.address}`}
                    buttonSubtitle="helloooo"
                  />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
});

const AddressMap = (props) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div>
      {!matches ? (
        <GridWeb>
          <RenderWeb {...props} />
        </GridWeb>
      ) : (
        <GridMobile>
          <RenderMobile {...props} />
        </GridMobile>
      )}
    </div>
  );
};

export default AddressMap;
