import React from "react";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker
} from "react-google-maps";
import _ from "lodash";

const GoogleMapComponent = withGoogleMap(props =>
{
	const {SearchBox, onMarkerChanged} = props;
	const coords = {lat:props.locationRef.latitude, lng:props.locationRef.longitude};
	return <GoogleMap
		defaultZoom={14}
		center={coords}
		ref = {props.onMapMounted}
		defaultOptions ={{
			mapTypeControl:false
		}}
	>
		{SearchBox && React.cloneElement(SearchBox,{
			controlPosition: google.maps.ControlPosition.TOP_LEFT
		})}
		<Marker
			draggable={true}
			onDragEnd = {async (obj) => { 
				const {latLng} = obj;
				const lat = latLng.lat();
				const lng = latLng.lng();
				const locationRef = {
					latitude: lat,
					longitude: lng 
				};
				onMarkerChanged(locationRef, props.authStore.accessToken);
			}}
			position={coords}
			icon={{
				url: "https://firebasestorage.googleapis.com/v0/b/twowheelstogo-572d7.appspot.com/o/resources%2FEllipse%202marker.png?alt=media&token=a64d45fc-9721-4ef0-b128-4ee52aef42e8",
				scaledSize: new window.google.maps.Size(36,36)
			}}
		/>
	</GoogleMap>;
}
);
export default GoogleMapComponent;