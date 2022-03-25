import React, { Component, Fragment, useEffect, useState } from "react";
import Layout from "components/Layout";
import fetchPrimaryShop from "staticUtils/shop/fetchPrimaryShop";
import fetchTranslations from "staticUtils/translations/fetchTranslations";
import PropTypes from "prop-types";
import useShop from "hooks/shop/useShop";
import { applyTheme } from "@reactioncommerce/components/utils";
import { withApollo } from "lib/apollo/withApollo";
import { locales } from "translations/config";
import Head from "next/head";
import styled from "styled-components";
import { Grid, useMediaQuery, Divider, Button } from "@material-ui/core";
import { useTheme, withStyles } from "@material-ui/core/styles";
import RoundedButton from "components/RoundedButton";
import withGoogleMaps from "containers/maps/withGoogleMap";
import GoogleMapComponent from "components/GoogleMaps";
import { StandaloneSearchBox } from "react-google-maps/lib/components/places/StandaloneSearchBox";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import withAddressBook from "containers/address/withAddressBook";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import inject from "hocs/inject";
import relayConnectionToArray from "lib/utils/relayConnectionToArray";
import PageLoading from "components/PageLoading";
import { useRouter } from "next/router";
import CrosshairsGps  from "mdi-material-ui/CrosshairsGps";

const PlacesWithStandaloneSearchBox = (props) => {
	return <div data-standalone-searchbox="">
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
	</div>;
};
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
const styles = theme => ({
	BotonPrincipal:{
		backgroundColor: theme.palette.secondary.botones,    
		color: theme.palette.colors.BotonColor,
		borderColor: theme.palette.secondary.botones, 
		fontWeight:"800",
		fontSize:"24px"
	  },
	  BotonPrincipalMovil:{
		backgroundColor: theme.palette.secondary.botones,    
		color: theme.palette.colors.BotonColor,
		borderColor: theme.palette.secondary.botones, 
		fontWeight:"800",
		fontSize:"18px"
	  },
	  BotonSecundario:{
		backgroundColor: theme.palette.secondary.botones,    
		color: theme.palette.colors.BotonColor,
		borderColor: theme.palette.secondary.botones, 
		fontWeight:"800",
		fontSize:"10px"
	  },
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
		justifyContent: "space-between"
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
			paddingRight: theme.spacing(2)
		},
		paddingBottom: theme.spacing(5),
		justifyContent: "space-between"
	},
	map: {
		width: "100%",
		height: "100%",
	},
	searchInput: {
		padding: theme.spacing(2)
	},
	addressItems: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: "10px"
	},
	Titulo: {
	color: theme.palette.colors.TextThemes,
	}
});
const CustomTitle = styled.div`    
    font-size: 36px;
    font-weight: 600;
    text-align: center;
`;
const RenderedForm = styled.div`
    padding-top: 20px;
    @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
        padding-top: 50px;
      }
`;
const CreateAddress = props => {
	const shop = useShop();
	const theme = useTheme();
	const [currentAddressBook, setCurrentAddressBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isSent, setIsSent] = useState(false);
	const pageTitle = `Address | New | ${shop && shop.name}`;
	const matches = useMediaQuery(theme.breakpoints.down("sm"));
	const router = useRouter();
	const { authStore: { account: { addressBook } } } = props;
	const handleAddAddress = async (value) => {
		try {
			setIsSent(true);
			const { onAddressAdded, onAddressEdited } = props;
			const { query: redirect } = router;
			let meta = value;
			delete value._id;
			if (props.googleProps.locationRef.latitude != undefined) {
				meta = {
					...value,
					geolocation: props.googleProps.locationRef,
					metaddress: { ...props.googleProps.metadataMarker }
				};
			}
			if (addressBookId != null) {
				await onAddressEdited(addressBookId, meta);
			} else {
				await onAddressAdded(meta);
			}
			window.location.href = decodeURIComponent(redirect.redirect);
		} catch (ex) {
			setIsSent(false);
		}
	};

	useEffect(() => {
		const { query: { addressBookId } } = router;
		if (addressBookId == undefined) {
			setLoading(false);
			return;
		}
		const addresses = (addressBook && relayConnectionToArray(addressBook)) || [];
		let current = addresses.find((item) => item._id == addressBookId);
		if (current) {
			if (current.metaddress) {
				props.googleProps.whenHasMetaAddress(current.metaddress);
			}
			if (current.geolocation) {
				props.googleProps.whenHasLocation(current.geolocation);
			}
		}
		setCurrentAddressBook(current);
		if (current != undefined) setLoading(false);
	}, [addressBook]);
	const { query: { addressBookId } } = router;
	if (loading) return <PageLoading />;
	return (
		<Layout shop={shop} noMaxwidth>
			<Head>
				<title>{pageTitle}</title>
				<meta name="description" content={shop && shop.description} />
			</Head>
			{!matches && <RenderWeb {...props}
				handleAddAddress={handleAddAddress}
				isSent={isSent}
				value={currentAddressBook}
			/>}
			{matches && <RenderMobile {...props}
				handleAddAddress={handleAddAddress}
				isSent={isSent}
				value={currentAddressBook}
			/>}
		</Layout>
	);
};
const RenderMobile = withStyles(styles)((props) => {
	const router = useRouter();
	const [current, setCurrent] = useState(0);
	const { googleProps,
		classes,
		components: { TextInput, AddressForm,Button },
		value,
	} = props;
	const { query: { addressBookId } } = router;
	let form = null;
	const [state, setState] = useState({
		address: value ? value.address : "ninguna",
		description: value ? value.description : "ninguna"
	});
	const handleChange = (event) => {
		setState({
			description: event.description ? event.description : "",
			address: event.address ? event.address : ""
		});
	};
	return (
		<Fragment>
			{current == 0 && (
				<Grid container style={{ minHeight: "calc(100vh - 130px)" }}>
					<Grid item xs={12}>
						<div className={classes.flexMap}>
							<div className={classes.map}>
								<div className={classes.searchInput}>
									<PlacesWithStandaloneSearchBox {...props} {...googleProps}>
										<TextInput
											id="search"
											name="search"
											placeholder="buscar una dirección"
										/>
									</PlacesWithStandaloneSearchBox>
								</div>
								<div style={{ height: "500px" }}>
									<GoogleMapComponent authStore={props.authStore} {...googleProps} location={value && value?.geolocation} />
								</div>
							</div>
							<div style={{
								paddingBottom: "20px",
								paddingTop: "10px",
								paddingLeft: "10px", paddingRight: "10px"
							}}>		
								<Button
								onClick={() => { setCurrent(1); }}
								className={classes.BotonPrincipalMovil}
								isFullWidth
								>
									Guardar y continuar
									</Button>														
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
									<CustomTitle className={classes.Titulo} style={{ fontSize: "30px" }}>{addressBookId ? "Editar Dirección" : "Crear Dirección"}</CustomTitle>
									<Divider style={{ width: "80%" }} />
									<Button variant="outlined"
										size="small"
										startIcon={<LocationSearchingIcon />}
										onClick={() => setCurrent(0)}
										cl
										className={classes.BotonSecundario}
									>										
										<CrosshairsGps/>
										Cambiar la ubicación</Button>
									<RenderedForm>
										<AddressForm
											ref={(formEl) => {
												form = formEl;
											}}
											onChange={handleChange}
											value={value}
											onSubmit={props.handleAddAddress} />
									</RenderedForm>
								</div>
								<div>
									<Button
									disabled={props.isSent}
									onClick={() => { form.submit(); }}
							isFullWidth
									className={classes.BotonPrincipalMovil}
									>
									Guardar Cambios
									</Button>
									{/* <RoundedButton
										disabled={props.isSent}
										onClick={() => { form.submit(); }}
										buttonTitle={"Guardar Cambios"}
										buttonSubtitle={`${state.description} - ${state.address}`}
									/> */}
								</div>
							</div>
						</div>
					</Grid>
				</Grid>
			)}
		</Fragment>
	);
});
const RenderWeb = withStyles(styles)((props) => {
	const router = useRouter();
	const { classes, components: {
		AddressForm,
		Field,
		TextInput,
		Button
	}, googleProps, value } = props;
	const { query: { addressBookId } } = router;
	const [state, setState] = useState({
		address: value ? value.address : "ninguna",
		description: value ? value.description : "ninguna"
	});
	let form = null;
	const handleChange = (event) => {
		setState({
			description: event.description ? event.description : "",
			address: event.address ? event.address : ""
		});
	};
	return (
		<Fragment>
			<Grid container style={{ minHeight: "calc(100vh - 110px)" }}>
				<Grid item xs={12} md={6}>
					<div className={classes.flexForm}>
						<div className={classes.form}>
							<div>
								<CustomTitle className={classes.Titulo}>{addressBookId ? "Editar Dirección" : "Crear Dirección"}</CustomTitle>
								<Divider />
								<RenderedForm>
									<AddressForm
										ref={(ref) => {
											form = ref;
										}}
										onChange={handleChange}
										value={value}
										onSubmit={props.handleAddAddress}

									/>
								</RenderedForm>
							</div>
							<div>
								<Button
									isFullWidth
									disabled={props.isSent}
									onClick={() => { form.submit(); }}
									className={classes.BotonPrincipal}   
								>
									Crear Dirección
								</Button>								
							</div>
						</div>
					</div>
				</Grid>
				<Grid item xs={12} md={6}>
					<div className={classes.flexMap}>
						<div className={classes.map}>
							<GoogleMapComponent
								authStore={props.authStore}
								{...googleProps}
								location={value && value?.geolocation}
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
								} />
						</div>
					</div>
				</Grid>
			</Grid>
		</Fragment>
	);
});

export async function getStaticProps({ params: { lang } }) {
	const primaryShop = await fetchPrimaryShop(lang);
	const translations = await fetchTranslations(lang, ["common"]);
	if (!primaryShop) {
		return {
			props: {
				shop: null,
				...translations
			},
			// eslint-disable-next-line camelcase
			unstable_revalidate: 1 // Revalidate immediately
		};
	}

	return {
		props: {
			...primaryShop,
			...translations
		},
		// eslint-disable-next-line camelcase
		unstable_revalidate: 120 // Revalidate each two minutes
	};
}


/**
   *  Static paths for the cart
   *
   * @returns {Object} the paths
   */
export async function getStaticPaths() {
	return {
		paths: locales.map((locale) => ({ params: { lang: locale } })),
		fallback: false
	};
}

export default withApollo()(withGoogleMaps(withAddressBook(withStyles(styles)(inject("routingStore","authStore")(CreateAddress)))));