import React from "react";
import { compose, withProps, withHandlers, withState } from "recompose";
import { withScriptjs } from "react-google-maps";
import hoistNonReactStatic from "hoist-non-react-statics";
import { withComponents } from "@reactioncommerce/components-context";
import { AddressMetadataService } from 'services/index.js';
const enhance = compose(
	withProps({
		googleMapURL:
			"https://maps.googleapis.com/maps/api/js?key=AIzaSyBsbuaZ4GRNZkquHV2W2wyo9Zume7N_hzc&v=3.exp&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: "100%" }} />,
		containerElement: <div style={{ height: "100%" }} />,
		mapElement: <div style={{ height: "100%" }} />
	}),
	withState("metadataMarker", "setMetadataMarker", {
		administrative_area_level_1: 'Guatemala',
		administrative_area_level_2: 'Guatemala',
		neighborhood: '',
		street_address: '26 Avenida 4-81, Cdad. de Guatemala, Guatemala',
		sublocality: 'Zona 14',
		distance: {
			text: "0 km",
			value: 0.0
		}
	}),
	withState("refs", "setRefs", {}),
	withState("locationRef", "setLocation", { latitude: 14.580087573219803, longitude: -90.49675930263743 }),
	withState("places", "setPlaces", []),
	withState("address", "setAddress", {}),
	withHandlers({
		onSearchBoxMounted: ({ setRefs }) => (ref) => {
			setRefs(prev => ({
				...prev,
				searchBox: ref
			}));
		},
		onMapMounted: (({ setRefs }) => ref => {
			setRefs(prev => ({
				...prev,
				map: ref
			}));
		}),
		onPlacesChanged: ({ setPlaces, setLocation, refs, setMetadataMarker }) => async (token) => {
			const places = refs.searchBox.getPlaces();
			setPlaces(places);
			const locationRef = {
				latitude: places[0].geometry.location.lat(),
				longitude: places[0].geometry.location.lng()
			};
			setLocation(locationRef);
			let _meta = await AddressMetadataService.getAddressMetadata(locationRef.latitude, locationRef.longitude, token);
			setMetadataMarker(_meta);
		},
		onMarkerChanged: ({ setLocation, setMetadataMarker }) => async (locationRef, token) => {
			setLocation(locationRef);
			let _meta = await AddressMetadataService.getAddressMetadata(locationRef.latitude, locationRef.longitude, token);
			setMetadataMarker(_meta);
		},
		whenHasMetaAddress:({setMetadataMarker}) => async ( _meta) =>{
			setMetadataMarker(_meta);
		},
		whenHasLocation:({setLocation}) => async ( location) =>{
			setLocation(location);
		},
	}),
	withScriptjs
);
export default function withGoogleMaps(Component) {
	const WithGoogleMap = React.forwardRef((props, ref) => {
		const GoogleMapLayout = enhance(googleProps =>
			<Component
				{...props}
				ref={ref}
				googleProps={googleProps}
			/>);
		return <GoogleMapLayout />;
	});
	hoistNonReactStatic(WithGoogleMap, Component);
	return withComponents(WithGoogleMap);
}