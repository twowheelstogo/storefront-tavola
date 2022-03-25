import React, { Component, useImperativeHandle, useRef } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash.isempty";
import { addressToString, CustomPropTypes } from "@reactioncommerce/components/utils";
import withGoogleMaps from "containers/maps/withGoogleMap";
import { withComponents } from "@reactioncommerce/components-context";
import GoogleMapComponent from "components/GoogleMaps";
import inject from "hocs/inject";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";

const NORMAL = "normal";
const REVIEW = "review";

const PlacesWithSearchBox = (props) => {
	return <SearchBox
		ref={props.onSearchBoxMounted}
		bounds={props.bounds}
		onPlacesChanged={() => {
			props.onPlacesChanged(props.authStore.accessToken);
		}}
		controlPosition={google.maps.ControlPosition.TOP_LEFT}
	>
		<div style={{ width: "50%", padding: "10px" }}>
			{props.children}
		</div>
	</SearchBox>;
};

const CustomAddAddressForm = withGoogleMaps((props) => {
	// this.demo = "Hola mundo";
	const { components: { CustomForm, TextInput }, onSubmit, googleProps, ...itemAddFormProps } = props;

	const handleSubmit = (value) => {

		const input = { ...value };
		if (googleProps.locationRef.latitude) {
			Object.assign(input, {
				geolocation: googleProps.locationRef,
				metaddress: { ...googleProps.metadataMarker }
			});
		}
		onSubmit(input);
	};

	let _formRef = null;

	useImperativeHandle(props.formRef, () => ({
		submit() {
			_formRef.submit();
		}
	}));

	return (
		<div
			ref={props.formRef}
		>
			<CustomForm
				{...itemAddFormProps}
				onSubmit={handleSubmit}

				ref={(formEl) => {
					_formRef = formEl;
				}}
			/>
			<div style={{
				width: "100%",
				height: "300px"
			}}>
				<GoogleMapComponent
					{...googleProps}
					authStore={props.authStore}
					SearchBox={
						<PlacesWithSearchBox
							{...props}
							{...googleProps}>
							<TextInput
								id="search"
								name="search"
								placeholder="buscar una dirección"
							/>
						</PlacesWithSearchBox>
					}
				/>
			</div>
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
			addressBook: CustomPropTypes.addressBook
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
			AddressReview: CustomPropTypes.component.isRequired
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
		value: PropTypes.object
	};

	static defaultProps = {
		account: {
			addressBook: []
		},
		addNewItemButtonText: "Agregar nueva dirección",
		deleteItemButtonText: "Eliminar dirección",
		entryFormSubmitButtonText: "Guardar cambios",
		isSaving: false,
		onAddressAdded(values) {
		},
		onAddressDeleted(values) {
		},
		onAddressEdited(values) {
		},
		validatedValue: {},
		value: {}
	};

	state = {
		status: this.currentStatus
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
		const { account: { addressBook } } = this.props;
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
			googleProps
		} = this.props;

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
				authStore: this.props.authStore
			},
			label: address.description
		}));
		const itemAddFormProps = {
			isSaving,
			onSubmit: this.handleAddAddress,
			components: { CustomForm: AddressForm, TextInput },
			authStore: this.props.authStore
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
				ref={(instance) => { this._accordionFormList = instance; }}
			/>
		);
	}

	renderAddressReview() {
		const { components: { AddressReview }, value, validatedValue } = this.props;
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
			<div className={className}>
				{status === REVIEW ? this.renderAddressReview() : this.renderAccordionFormList()}
			</div>
		);
	}
}

export default withComponents(inject("authStore")(AddressBook));