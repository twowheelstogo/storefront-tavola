import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash.uniqueid";
import isEmpty from "lodash.isempty";
import { Form } from "reacto-form";
import styled from "styled-components";
import GoogleMaps from "components/GoogleMaps";
import { withComponents } from "@reactioncommerce/components-context";
import { applyTheme, CustomPropTypes, getRequiredValidator } from "@reactioncommerce/components/utils";
import { GoogleMap, withScriptjs, withGoogleMap } from "react-google-maps";
import GoogleMapReact from "google-map-react";

import {
  SwipeableDrawer,
  Typography,
  IconButton,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormGroup,
  FormControl,
  Checkbox,
  TextField,
  ButtonBase,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ColFull = styled.div`
  flex: 1 1 100%;
`;

const ColHalf = styled.div`
  flex: 1 1 100%;

  @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
    flex: 0 1 calc(50% - 9px);
  }
`;

class AddressForm extends Component {
  static propTypes = {
    /**
     * The text for the "Address" label text.
     */
    address1LabelText: PropTypes.string,
    /**
     * Place holder for "Address" field.
     */
    address1PlaceholderText: PropTypes.string,
    /**
     * The text for the "Address Line 2" label text.
     */
    address2LabelText: PropTypes.string,
    /**
     * Place holder for "Address Line 2 (Optional)" field.
     */
    address2PlaceholderText: PropTypes.string,
    /**
     * The text for the "Address Name" label text.
     */
    addressNameLabelText: PropTypes.string,
    /**
     * Place holder for "Address name" field.
     */
    addressNamePlaceholder: PropTypes.string,
    /**
     * The text for the "City" label text.
     */
    cityLabelText: PropTypes.string,
    /**
     * Place holder for "City" field.
     */
    cityPlaceholderText: PropTypes.string,
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * If you've set up a components context using
     * [@reactioncommerce/components-context](https://github.com/reactioncommerce/components-context)
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      /**
       * Pass either the Reaction Checkbox component or your own component that is
       * compatible with ReactoForm.
       */
      Checkbox: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction ErrorsBlock component or your own component that is
       * compatible with ReactoForm.
       */
      ErrorsBlock: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction Field component or your own component that is
       * compatible with ReactoForm.
       */
      Field: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction TextInput component or your own component that is
       * compatible with ReactoForm.
       */
      TextInput: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction Select component or your own component that is
       * compatible with ReactoForm.
       */
      Select: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction PhoneNumberInput component or your own component that is
       * compatible with ReactoForm.
       */
      PhoneNumberInput: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction RegionInput component or your own component that is
       * compatible with ReactoForm.
       */
      RegionInput: CustomPropTypes.component.isRequired,
    }).isRequired,
    /**
     * The text for the "Country" label text.
     */
    countryLabelText: PropTypes.string,
    /**
     * Place holder for "Country" field.
     */
    countryPlaceholderText: PropTypes.string,
    /**
     * Errors array
     */
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Error message
         */
        message: PropTypes.string.isRequired,
        /**
         * Error name
         */
        name: PropTypes.string.isRequired,
      }),
    ),
    /**
     * The text for the "This is a commercial address." label text.
     */
    isCommercialLabelText: PropTypes.string,
    /**
     * Enable when using the form on a dark background, disabled by default
     */
    isOnDarkBackground: PropTypes.bool,
    /**
     * If true, typing in address fields is disabled
     */
    isReadOnly: PropTypes.bool,
    /**
     * Pass true if the address is in the process of being saved.
     * While true, typing in address fields is disabled.
     */
    isSaving: PropTypes.bool,

    /**
     * Locale options to populate the forms country and region fields
     */
    locales: PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string,
        native: PropTypes.string,
        phone: PropTypes.string,
        continent: PropTypes.string,
        capital: PropTypes.string,
        currency: PropTypes.string,
        languages: PropTypes.string,
        states: PropTypes.objectOf(PropTypes.shape({ name: PropTypes.string })),
      }),
    ),
    /**
     * Form name
     */
    name: PropTypes.string,
    /**
     * The text for the "Name" label text.
     */
    nameLabelText: PropTypes.string,
    /**
     * Place holder for "Name" field.
     */
    namePlaceholderText: PropTypes.string,
    /**
     * Cancel event callback
     */
    onCancel: PropTypes.func,
    /**
     * OnChange event callback
     */
    onChange: PropTypes.func,
    /**
     * Form submit event callback
     */
    onSubmit: PropTypes.func,
    /**
     * The text for the "Phone" label text.
     */
    phoneLabelText: PropTypes.string,
    /**
     * Place holder for "Phone" field.
     */
    phonePlaceholderText: PropTypes.string,
    /**
     * The text for the "Postal Code" label text.
     */
    postalLabelText: PropTypes.string,
    /**
     * Place holder for "Postal Code" field.
     */
    postalPlaceholderText: PropTypes.string,
    /**
     * The text for the "Region" label text..
     */
    regionLabelText: PropTypes.string,
    /**
     * Place holder for "Region" field.
     */
    regionPlaceholderText: PropTypes.string,
    /**
     * Should the AddressForm show the "Address Names" field.
     */
    shouldShowAddressNameField: PropTypes.bool,
    /**
     * Should the AddressForm show the "Is Commercial Address" field.
     */
    shouldShowIsCommercialField: PropTypes.bool,
    /**
     * Validator method
     */
    validator: PropTypes.func,
    /**
     * Address object to be edited
     */
    value: CustomPropTypes.address,
  };

  static defaultProps = {
    address1LabelText: "Address",
    address1PlaceholderText: "Address",
    address2LabelText: "Address Line 2",
    address2PlaceholderText: "Address Line 2 (Optional)",
    addressNameLabelText: "Address Name",
    addressNamePlaceholder: "Address Name",
    cityLabelText: "City",
    cityPlaceholderText: "City",
    countryLabelText: "Country",
    countryPlaceholderText: "Country",
    errors: [],
    locales: {},
    isCommercialLabelText: "This is a commercial address.",
    isOnDarkBackground: false,
    isReadOnly: false,
    isSaving: false,
    name: "address",
    nameLabelText: "Name",
    namePlaceholderText: "Name",
    phoneLabelText: "Phone",
    phonePlaceholderText: "Phone",
    postalLabelText: "Postal Code",
    postalPlaceholderText: "Postal Code",
    regionLabelText: "Region",
    regionPlaceholderText: "Region",
    onCancel() {},
    onChange() {},
    onSubmit() {},
    shouldShowAddressNameField: false,
    shouldShowIsCommercialField: true,
    validator: getRequiredValidator("country", "fullName", "address1", "city", "phone", "postal", "region"),
    value: {
      addressName: "",
      address1: "",
      address2: "",
      country: "",
      city: "",
      fullName: "",
      postal: "",
      region: "",
      phone: "",
      isCommercial: false,
    },
  };

  state = {
    // if the form has a value then try to use the value.country
    // if that is not set check to see if any locales are provided and use the first one
    // if no locales use "US"
    activeCountry:
      // eslint-disable-next-line
      this.props.value && this.props.value.country !== ""
        ? this.props.value.country
        : isEmpty(this.props.locales)
        ? "US"
        : Object.keys(this.props.locales)[0],
  };

  componentDidUpdate(prevProps) {
    const { locales: prevLocales } = prevProps;
    const { locales: nextLocales, value: nextValue } = this.props;
    const { activeCountry: prevCountry } = this.state;

    // Sometimes the AddressForm will render before locales are provided.
    // This is often the case when dynamically importing locales via a JSON file.
    // Once the file loads and the locales are provided the form needs to check
    // and correct the active country.
    if (isEmpty(prevLocales) && !isEmpty(nextLocales) && prevLocales !== nextLocales) {
      const nextCountry = Object.keys(nextLocales)[0];
      if (nextValue && nextValue.country === prevCountry) {
        return;
      } else if (nextCountry !== prevCountry) {
        // eslint-disable-next-line
        this.setState({ activeCountry: nextCountry });
      }
    }
  }

  _form = null;

  uniqueInstanceIdentifier = uniqueId("AddressForm_");

  get countryOptions() {
    const { locales } = this.props;
    if (!locales) return [];
    const options = Object.keys(locales).map((key) => ({ value: key, label: locales[key].name }));
    return options;
  }

  get regionOptions() {
    const { locales } = this.props;
    const { activeCountry } = this.state;
    const options = [];
    if (locales && locales[activeCountry] && locales[activeCountry].states) {
      Object.keys(locales[activeCountry].states).forEach((key) => {
        options.push({ value: key, label: locales[activeCountry].states[key].name });
      });
    }
    return options;
  }

  handleCountryChange = (country) => {
    if (!country) return;
    this.setState({
      activeCountry: country,
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  getValue = () => this._form.getValue();

  submit = () => {
    this._form.submit();
  };

  validate = () => this._form.validate();

  render() {
    const {
      address1LabelText,
      address1PlaceholderText,
      address2LabelText,
      address2PlaceholderText,
      addressNameLabelText,
      addressNamePlaceholder,
      value,
      className,
      cityLabelText,
      cityPlaceholderText,
      components: { Checkbox, ErrorsBlock, Field, TextInput, Select, PhoneNumberInput, RegionInput },
      countryLabelText,
      countryPlaceholderText,
      errors,
      isCommercialLabelText,
      isOnDarkBackground,
      isReadOnly,
      isSaving,
      name,
      nameLabelText,
      namePlaceholderText,
      onChange,
      phoneLabelText,
      phonePlaceholderText,
      postalLabelText,
      postalPlaceholderText,
      regionLabelText,
      regionPlaceholderText,
      shouldShowAddressNameField,
      shouldShowIsCommercialField,
      validator,
    } = this.props;

    const addressNameInputId = `addressName_${this.uniqueInstanceIdentifier}`;
    const countryInputId = `country_${this.uniqueInstanceIdentifier}`;
    const fullNameInputId = `fullName_${this.uniqueInstanceIdentifier}`;
    const address1InputId = `address1_${this.uniqueInstanceIdentifier}`;
    const address2InputId = `address2_${this.uniqueInstanceIdentifier}`;
    const cityInputId = `city_${this.uniqueInstanceIdentifier}`;
    const regionInputId = `region_${this.uniqueInstanceIdentifier}`;
    const postalInputId = `postal_${this.uniqueInstanceIdentifier}`;
    const phoneInputId = `phone_${this.uniqueInstanceIdentifier}`;
    const isCommercialInputId = `isCommercial_${this.uniqueInstanceIdentifier}`;

    const googleKey = "AIzaSyAW4Y-oSYeI1b3jsqLXgINxYtcfHkAHRhI";
    // const Map = () => {
    //   return <GoogleMap defaultZoom={10} defaultCenter={{ lat: 14.596129, lng: -90.511701 }} key={googleKey} />;
    // };
    const WrappedMap = withScriptjs(withGoogleMap(Map));
    // const Map = ({ onClick, onIdle, children, style, ...options }) => {
    //   const ref = React.useRef < HTMLDivElement > null;
    //   const [map, setMap] = React.useState();

    //   React.useEffect(() => {
    //     if (ref.current && !map) {
    //       setMap(new window.google.maps.Map(ref.current, {}));
    //     }
    //   }, [ref, map]);

    //   // because React does not do deep comparisons, a custom hook is used
    //   // see discussion in https://github.com/googlemaps/js-samples/issues/946
    //   useDeepCompareEffectForMaps(() => {
    //     if (map) {
    //       map.setOptions(options);
    //     }
    //   }, [map, options]);

    //   React.useEffect(() => {
    //     if (map) {
    //       ["click", "idle"].forEach((eventName) => google.maps.event.clearListeners(map, eventName));

    //       if (onClick) {
    //         map.addListener("click", onClick);
    //       }

    //       if (onIdle) {
    //         map.addListener("idle", () => onIdle(map));
    //       }
    //     }
    //   }, [map, onClick, onIdle]);

    //   return (
    //     <>
    //       <div ref={ref} style={style} />
    //       {React.Children.map(children, (child) => {
    //         if (React.isValidElement(child)) {
    //           // set the map prop on the child component
    //           return React.cloneElement(child, { map });
    //         }
    //       })}
    //     </>
    //   );
    // };
    const AnyReactComponent = ({ text }) => <div>{text}</div>;

    return (
      <div>
        <Form
          className={className}
          ref={(formEl) => {
            this._form = formEl;
          }}
          errors={errors}
          name={name}
          onChange={onChange}
          // onSubmit={this.props.onSubmit}
          onSubmit={(e, d) => {
            console.info("Submit AddressForm", { e, d });
          }}
          validator={validator}
          revalidateOn="changed"
          value={value}
        >
          <Grid container>
            <Grid item md={8}>
              <Accordion defaultExpanded={true} style={{ margin: 0, width: "100%", display: "block" }}>
                <AccordionSummary
                  style={{ background: "#F6F6F6" }}
                  expandIcon={
                    <ExpandMoreIcon style={{ background: "#1D0D13", color: "white", borderRadius: "20px" }} />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{ color: "#1D0D13", fontSize: "18px", fontWeight: 800 }}>Custom Data</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ padding: "25px 20px" }}>
                  <div>
                    {shouldShowAddressNameField && (
                      <ColFull>
                        <Field name="addressName" label={addressNameLabelText} labelFor={addressNameInputId} isOptional>
                          <TextInput
                            id={addressNameInputId}
                            name="addressName"
                            // TODO: Replace addressNamePlaceholder to adressNamePlaceholderText
                            placeholder={addressNamePlaceholder}
                            isOnDarkBackground={isOnDarkBackground}
                            isReadOnly={isSaving || isReadOnly}
                          />
                        </Field>
                      </ColFull>
                    )}

                    <ColFull>
                      <Field name="country" label={countryLabelText} labelFor={countryInputId} isRequired>
                        {this.countryOptions && this.countryOptions.length > 1 ? (
                          <Select
                            id={countryInputId}
                            alphabetize
                            isSearchable
                            name="country"
                            onChange={this.handleCountryChange}
                            options={this.countryOptions}
                            placeholder={countryPlaceholderText}
                            isOnDarkBackground={isOnDarkBackground}
                            isReadOnly={isSaving || isReadOnly}
                          />
                        ) : (
                          <TextInput
                            id={countryInputId}
                            name="country"
                            placeholder={countryPlaceholderText}
                            isOnDarkBackground={isOnDarkBackground}
                            isReadOnly={isSaving || isReadOnly}
                          />
                        )}
                        <ErrorsBlock names={["country"]} />
                      </Field>
                    </ColFull>

                    <ColFull>
                      <Field name="fullName" label={nameLabelText} labelFor={fullNameInputId} isRequired>
                        <TextInput
                          id={fullNameInputId}
                          name="fullName"
                          placeholder={namePlaceholderText}
                          isOnDarkBackground={isOnDarkBackground}
                          isReadOnly={isSaving || isReadOnly}
                        />
                        <ErrorsBlock names={["fullName"]} />
                      </Field>
                    </ColFull>

                    <ColFull>
                      <Field name="address1" label={address1LabelText} labelFor={address1InputId} isRequired>
                        <TextInput
                          id={address1InputId}
                          name="address1"
                          placeholder={address1PlaceholderText}
                          isOnDarkBackground={isOnDarkBackground}
                          isReadOnly={isSaving || isReadOnly}
                        />
                        <ErrorsBlock names={["address1"]} />
                      </Field>
                    </ColFull>

                    <ColFull>
                      <Field name="address2" label={address2LabelText} labelFor={address2InputId} isOptional>
                        <TextInput
                          id={address2InputId}
                          name="address2"
                          placeholder={address2PlaceholderText}
                          isOnDarkBackground={isOnDarkBackground}
                          isReadOnly={isSaving || isReadOnly}
                        />
                      </Field>
                    </ColFull>

                    <ColFull>
                      <Field name="city" label={cityLabelText} labelFor={cityInputId}>
                        <TextInput
                          id={cityInputId}
                          name="city"
                          placeholder={cityPlaceholderText}
                          isOnDarkBackground={isOnDarkBackground}
                          isReadOnly={isSaving || isReadOnly}
                        />
                        <ErrorsBlock names={["city"]} />
                      </Field>
                    </ColFull>

                    <ColHalf>
                      <Field name="region" label={regionLabelText} labelFor={regionInputId} isRequired>
                        <RegionInput
                          id={regionInputId}
                          options={this.regionOptions}
                          isOnDarkBackground={isOnDarkBackground}
                          isReadOnly={isSaving || isReadOnly}
                          name="region"
                          placeholder={regionPlaceholderText}
                        />
                        <ErrorsBlock names={["region"]} />
                      </Field>
                    </ColHalf>
                    <ColHalf>
                      <Field name="postal" label={postalLabelText} labelFor={postalInputId} isRequired>
                        <TextInput
                          id={postalInputId}
                          name="postal"
                          placeholder={postalPlaceholderText}
                          isOnDarkBackground={isOnDarkBackground}
                          isReadOnly={isSaving || isReadOnly}
                        />
                        <ErrorsBlock names={["postal"]} />
                      </Field>
                    </ColHalf>

                    <ColFull>
                      <Field name="phone" label={phoneLabelText} labelFor={phoneInputId} isRequired>
                        <PhoneNumberInput
                          id={phoneInputId}
                          name="phone"
                          placeholder={phonePlaceholderText}
                          isOnDarkBackground={isOnDarkBackground}
                          isReadOnly={isSaving || isReadOnly}
                        />
                        <ErrorsBlock names={["phone"]} />
                      </Field>
                    </ColFull>

                    {shouldShowIsCommercialField && (
                      <ColFull>
                        <Field name="isCommercial" labelFor={isCommercialInputId}>
                          <Checkbox
                            id={isCommercialInputId}
                            name="isCommercial"
                            label={isCommercialLabelText}
                            isOnDarkBackground={isOnDarkBackground}
                            isReadOnly={isSaving || isReadOnly}
                          />
                        </Field>
                      </ColFull>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item md={2} style={{ backgroundColor: "blue" }}>
              <div style={{ width: "100vh", height: "100vh" }}>
                {/* <WrappedMap
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0_AQXohWc410j_f7QiOxEpzaNNkxaIuU&v=3.exp&libraries=geometry,drawing,places"
                  loadingElement={<div style={{ height: "100%" }} />}
                  containerElement={<div style={{ height: "100%" }} />}
                  mapElement={<div style={{ height: "100%" }} />}
                /> */}
                {/* <Wrapper apiKey={"AIzaSyB0_AQXohWc410j_f7QiOxEpzaNNkxaIuU"}>
                  <Map></Map>
                </Wrapper> */}
                <GoogleMapReact
                  bootstrapURLKeys={{ key: "AIzaSyAd6s6CP9U5tf9t7QU_TbVLoiPfbHzz5Ms" }}
                  defaultCenter={{
                    lat: 59.95,
                    lng: 30.33,
                  }}
                  defaultZoom={11}
                >
                  <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
                </GoogleMapReact>
              </div>
            </Grid>
          </Grid>
        </Form>
      </div>
    );
  }
}

export default withComponents(AddressForm);
