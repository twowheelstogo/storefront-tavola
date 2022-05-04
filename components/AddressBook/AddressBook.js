import React, { Component, useImperativeHandle, useState, useEffect } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash.isempty";
import { CustomPropTypes } from "@reactioncommerce/components/utils";
import withGoogleMaps from "containers/maps/withGoogleMap";
import { withComponents } from "@reactioncommerce/components-context";
import GoogleMapComponent from "components/GoogleMaps";
import inject from "hocs/inject";
import { StandaloneSearchBox } from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import AddressMap from "./addresMapCustom";

const NORMAL = "normal";
const REVIEW = "review";

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
      <div style={{ width: "50%", padding: "10px" }}>{props.children}</div>
    </SearchBox>
  );
};

const StandaloneWithSearchBox = (props) => {
  return (
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={() => {
        props.onPlacesChanged(props.authStore.accessToken);
      }}
    >
      {props.children}
    </StandaloneSearchBox>
  );
};

const CustomAddAddressForm = withGoogleMaps((props) => {
  const {
    components: { CustomForm, TextInput },
    onSubmit,
    googleProps,
    ...itemAddFormProps
  } = props;
  const [showForm, setShowForm] = useState(false);
  // const [mapStyle, setMapStyle] = useState({ height: "300px" });
  // const [objProps, setObjProps] = useState(props);
  // const [googleMapProps, setGoogleMapProps] = useState(googleProps);
  // const [searchAddress, setSearchAddress] = useState("");
  // const [addresValues, setAddressValues] = useState({ address: "", reference: "", description: "" });

  // console.log("props", props);

  // const setValueAddress = () => {
  //   const { neighborhood, street_address, sublocality } = googleProps.metadataMarker;
  //   let address = street_address,
  //     reference = sublocality;
  //   // console.log("street_address", street_address);
  //   if (street_address === "") {
  //     address = neighborhood;
  //   }
  //   setAddressValues({ address, reference, description: "" });
  // };

  // const getCurrentPosition = () => {
  //   navigator?.geolocation.getCurrentPosition(async ({ coords }) => {
  //     setGoogleMapProps({ ...googleProps, locationRef: { latitude: coords.latitude, longitude: coords.longitude } });
  //     // console.log("googleMapProps", googleMapProps);
  //     // console.log("searchBoxProps", objProps);
  //     await googleMapProps.onMarkerChanged(
  //       { latitude: coords.latitude, longitude: coords.longitude },
  //       objProps.authStore.accessToken
  //     );
  //   });
  // };

  // const getGeoAddress = (coords = { latitude: 0, longitude: 0 }, waittime = 500) => {
  //   // Added delay to show effect of locating current position
  //   setTimeout(() => {
  //     // coords with value an address is being assigned by search
  //     if (coords) {
  //       setGoogleMapProps({ ...googleProps, locationRef: coords });
  //     } else {
  //       getCurrentPosition();
  //     }
  //   }, waittime);
  // };

  // useEffect(() => {
  //   // console.log("testtesttestsetstsa");
  //   // console.log("googleProps", googleProps);
  //   const { latitude, longitude } = googleProps.locationRef;
  //   getGeoAddress({ latitude, longitude }, 0);
  //   // setValueAddress();
  // }, [googleProps.metadataMarker]);

  // useEffect(() => {
  //   getGeoAddress(null);
  // }, []);

  // useEffect(() => {
  //   // console.log("searchAddress", searchAddress);
  //   if (searchAddress && searchAddress.trim() !== "") {
  //     const timedId = setTimeout(() => {
  //       console.log("searching searchAddress...", searchAddress);
  //     }, 500);
  //     return () => {
  //       clearTimeout(timedId);
  //     };
  //   }
  // }, [searchAddress]);

  const handleSubmit = (value) => {
    const input = { ...value };
    if (googleProps.locationRef.latitude) {
      Object.assign(input, {
        geolocation: googleProps.locationRef,
        metaddress: { ...googleProps.metadataMarker },
      });
    }
    setShowForm(false);
    onSubmit(input);
  };

  // const handleSearchAddress = (search) => {
  //   setSearchAddress(search);
  // };

  let _formRef = null;

  useImperativeHandle(props.formRef, () => ({
    submit() {
      _formRef.submit();
    },
  }));

  return (
    <div ref={props.formRef}>
      {showForm ? (
        <div>
          <CustomForm
            {...itemAddFormProps}
            onSubmit={handleSubmit}
            onCurrentPosition={() => getGeoAddress(null)}
            // handleSearchAddress={handleSearchAddress}
            searchBoxProps={props}
            // googleMapProps={googleMapProps}
            StandaloneWithSearchBox={StandaloneWithSearchBox}
            ref={(formEl) => {
              _formRef = formEl;
            }}
            // value={addresValues}
          />
          <div
            style={{
              width: "100%",
              height: "300px",
            }}
          >
            <GoogleMapComponent
              {...googleProps}
              authStore={props.authStore}
              SearchBox={
                <PlacesWithSearchBox {...props} {...googleProps}>
                  <TextInput id="search" name="search" placeholder="Buscar una dirección" />
                </PlacesWithSearchBox>
              }
            />
          </div>
        </div>
      ) : null}
      {!showForm ? <AddressMap setShowForm={setShowForm} {...props} /> : null}
    </div>
  );
});

class AddressBook extends Component {
  static propTypes = {
    /**
     * User account data.
     */
    account: PropTypes.shape({
      /**
       * Users saved addresses
       */
      addressBook: CustomPropTypes.addressBook,
    }),
    /**
     * The text for the "Add a new address" text, if it is shown.
     */
    addNewItemButtonText: PropTypes.string,
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * If you've set up a components context using @reactioncommerce/components-context
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      /**
       * Pass either the Reaction AccordionFormList component or your own component that
       * accepts compatible props.
       */
      AccordionFormList: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction AddressForm component or your own component that
       * accepts compatible props.
       */
      AddressForm: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction AddressReview component or your own component that
       * accepts compatible props.
       */
      AddressReview: CustomPropTypes.component.isRequired,
    }).isRequired,
    /**
     * The text for the "Delete address" text, if it is shown.
     */
    deleteItemButtonText: PropTypes.string,
    /**
     * The text for the "Save Changes" text, if it is shown.
     */
    entryFormSubmitButtonText: PropTypes.string,
    /**
     * Is data being saved
     */
    isSaving: PropTypes.bool,
    /**
     * Handles new address added to address book
     */
    onAddressAdded: PropTypes.func,
    /**
     * Handles address deletion from address book
     */
    onAddressDeleted: PropTypes.func,
    /**
     * Handles editing address in address book
     */
    onAddressEdited: PropTypes.func,
    /**
     * Validated entered value for the AddressReview
     */
    validatedValue: PropTypes.object,
    /**
     * Value for the AddressFrom
     */
    value: PropTypes.object,
  };

  static defaultProps = {
    account: {
      addressBook: [],
    },
    addNewItemButtonText: "Agregar nueva dirección",
    deleteItemButtonText: "Eliminar dirección",
    entryFormSubmitButtonText: "Guardar cambios",
    isSaving: false,
    onAddressAdded(values) {},
    onAddressDeleted(values) {},
    onAddressEdited(values) {},
    validatedValue: {},
    value: {},
  };

  state = {
    status: this.currentStatus,
  };

  _addressReview = null;
  _accordionFormList = null;

  //
  // Helper Methods
  //
  get currentStatus() {
    // eslint-disable-next-line
    return isEmpty(this.props.validatedValue) ? NORMAL : REVIEW;
  }

  get hasAddress() {
    const {
      account: { addressBook },
    } = this.props;
    return !isEmpty(addressBook);
  }

  //
  // Handler Methods
  //
  handleAddAddress = async (value) => {
    const { onAddressAdded } = this.props;
    await onAddressAdded(value);
    if (this._accordionFormList) {
      this._accordionFormList.showList();
    }
  };

  handleDeleteAddress = async (id) => {
    const { onAddressDeleted } = this.props;
    await onAddressDeleted(id);
  };

  handleEditAddress = async (value, _id) => {
    const { onAddressEdited } = this.props;
    await onAddressEdited(_id, value);
    if (this._accordionFormList) {
      this._accordionFormList.toggleAccordionForItem(_id);
    }
  };

  //
  // Render Methods
  //
  renderAccordionFormList() {
    const {
      account: { addressBook },
      addNewItemButtonText,
      components: { AccordionFormList, AddressForm, TextInput },
      deleteItemButtonText,
      entryFormSubmitButtonText,
      isSaving,
      googleProps,
    } = this.props;
    // console.log("this.props_test", this.props);
    const items = addressBook.map(({ _id, ...address }) => ({
      id: _id,
      detail: `${address.address}, ${address.reference}`,
      itemEditFormProps: {
        isOnDarkBackground: true,
        isSaving,
        onSubmit: (value) => {
          this.handleEditAddress(value, _id);
        },
        value: address,
        components: { CustomForm: AddressForm, TextInput },
        authStore: this.props.authStore,
      },
      label: address.description,
    }));

    const itemAddFormProps = {
      isSaving,
      onSubmit: this.handleAddAddress,
      components: { CustomForm: AddressForm, TextInput },
      authStore: this.props.authStore,
    };

    return (
      <AccordionFormList
        addNewItemButtonText={addNewItemButtonText}
        components={{ ItemAddForm: CustomAddAddressForm, ItemEditForm: CustomAddAddressForm }}
        deleteItemButtonText={deleteItemButtonText}
        entryFormSubmitButtonText={entryFormSubmitButtonText}
        itemAddFormProps={itemAddFormProps}
        items={items}
        googleProps={googleProps}
        onItemDeleted={this.handleDeleteAddress}
        ref={(instance) => {
          this._accordionFormList = instance;
        }}
        hiddeButtons={false}
      />
    );
  }

  renderAddressReview() {
    const {
      components: { AddressReview },
      value,
      validatedValue,
    } = this.props;
    return (
      <AddressReview
        ref={(el) => {
          this._addressReview = el;
        }}
        addressEntered={value}
        addressSuggestion={validatedValue}
      />
    );
  }

  render() {
    const { className } = this.props;
    const { status } = this.state;
    return (
      <div className={className}>{status === REVIEW ? this.renderAddressReview() : this.renderAccordionFormList()}</div>
    );
  }
}

export default withComponents(inject("authStore")(AddressBook));
