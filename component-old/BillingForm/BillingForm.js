import React, { Component } from "react";
import uniqueId from "lodash.uniqueid";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import { applyTheme } from "@reactioncommerce/components/utils";
import { withStyles } from "@material-ui/core/styles";
import { NitService } from 'services/index.js'
import { Button } from "@material-ui/core";

const styles = theme => ({
	input: {		
		width: "100%",
		border: "none",				
		backgroundColor:"#F9F9F9",
		color: "#000",
		bordeRadius: "4px",			
	},
	label_ : {
		marginTop:"10px"
	},
	labelColor: {
		color: "#000"
	},	
});
const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ColHalf = styled.div`
    flex: 0 1 calc(50% - 2px);
    padding:2px;
    @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
    flex: 0 1 calc(50% - 9px);
    }
`;

const ColHalfNit = styled.div`
flex: 0 1 calc(60% - 2px);
padding:2px;
@media (min-width: ${applyTheme("sm", "breakpoints")}px) {
flex: 0 1 calc(80% - 9px);
}
`;

const ColHalfButton = styled.div`
	display: flex;
    flex: 0 1 calc(40% - 2px);
	align-items: flex-end;
	justify-content: flex-end;
    padding: 15px;
    @media (min-width: ${applyTheme("sm", "breakpoints")}px) {
    flex: 0 1 calc(20% - 9px);
    }
`;

const ColFull = styled.div`
  flex: 1 1 100%;
`;

const ButtonSearchNit = styled.div`
  margin-top: 31px;
`;

class BillingFormAction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			hasData: false,
			partnerId: -1,
			searchNit: false
		}
	}
	static defaultProps = {
		placeholderProps: "Ingrese...",
		isOnDarkBackground: false,
		nitBillingLabelText: "Nit",
		nameBillingLabelText: "Nombre",
		addresBillingLabelText: "Dirección",
		cfBillingLabelText: "Consumidor final",
		deptoLabelText: "Departamento",
		cityLabelText: "Municipio"
	}

	uniqueInstanceIdentifier = uniqueId("BillingForm_");
	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}
	async handleOnChangeNit(value) {
		const { onChange, isCf, authStore } = this.props;
		if (value == null || value == "") {
			return;
		}
		if (this._isMounted) {
			if (isCf) {
				return;
			}
			this.setState({ loading: true, hasData: false, partnerId: -1, searchNit: true });
			let nitRes = await NitService.getNit(value, authStore.accessToken);
			onChange({
				isCf: false,
				nit: nitRes.vat,
				name: nitRes.name,
				address: nitRes.street,
				partnerId: nitRes.partnerId
			});
			this.setState({ loading: false, hasData: nitRes.hasData, partnerId: nitRes.partnerId, searchNit: false });
		}
	}
	handleOnChange(key, value = "") {
		if (value == undefined) {
			return;
		}
		const { onChange } = this.props;
		let _json = {};
		if (key === "isCf") {
			if (value === true) {
				_json = {
					isCf: true,
					nit: "",
					name: "CF",
					address: "guatemala",
					partnerId: -1
				};
				this.setState({
					loading: true,
					hasData: false,
					partnerId: -1,
					searchNit: false
				});
			} else {
				_json = {
					isCf: true,
					nit: "",
					name: "",
					address: "guatemala",
					partnerId: -1
				};
			}
		}
		_json[key] = value;
		onChange(_json);
	}
	getHiddenStyles() {
		const { loading } = this.state;
		const { isCf } = this.props;
		if (isCf) {
			return { "display": "none" };
		}
	}
	getHiddenSearchStyles() {
		const { searchNit } = this.state;
		const { isCf } = this.props;
		if (isCf) {
			return { "display": "none" };
		}
		return (searchNit) ? {} : { "display": "none" };
	}
	getHiddenNit() {
		const { isCf } = this.props;
		return (isCf) ? { "display": "none" } : {};
	}
	render() {
		if (!this._isMounted) {
			return (<p>Cargando...</p>);
		}
		const {
			components: { Field, TextInput, Checkbox, InlineAlert },
			isReadOnly,
			isSaving,
			placeholderProps,
			isOnDarkBackground,
			nameBillingLabelText,
			nitBillingLabelText,
			addresBillingLabelText,
			cfBillingLabelText,
			classes,
			isCf,
			nitValue,
			nameValue,
			addressValue,
			deptoValue,
			cityValue,
			alert,
			deptoLabelText,
			cityLabelText
		} = this.props;
		const nitbillingForm = `nitbilling_${this.uniqueInstanceIdentifier}`;
		const namebillingForm = `namebiiling_${this.uniqueInstanceIdentifier}`;
		const addresbillingForm = `addresbilling_${this.uniqueInstanceIdentifier}`;
		const deptobillingForm = `deptobilling_${this.uniqueInstanceIdentifier}`;
		const citybillingForm = `citybilling_${this.uniqueInstanceIdentifier}`;
		return (
			<div>
				{alert ? <InlineAlert {...alert} /> : ""}
				<Grid>
					<ColFull>
						<Checkbox label={cfBillingLabelText} name="isCf" value={isCf} onChange={(val) => { this.handleOnChange("isCf", val) }} />
					</ColFull>
					<ColHalf style={this.getHiddenStyles()}>
						<Field name="nit"  labelFor={nitbillingForm} >
						<label className={classes.labelColor}>Nit</label>
						<div className={classes.label_}></div>
							<TextInput								
								id={nitbillingForm}
								name='nit'
								placeholder={placeholderProps}
								isOnDarkBackground={isOnDarkBackground}
								isReadOnly={isCf || isSaving || isReadOnly}
								onChange={(val) => this.handleOnChangeNit(val)}
								value={nitValue}
							/>
						</Field>
						</ColHalf>
					{/* <ColHalfButton style={this.getHiddenNit()}>
						<Button isFullWidth>
							Buscar
						</Button>
					</ColHalfButton> */}
					<ColHalf style={this.getHiddenStyles()}>
						<Field name="name"  labelFor={namebillingForm} >
						<label className={classes.labelColor}>Nombre de facturación</label>
						<div className={classes.label_}></div>
							<TextInput								
								id={namebillingForm}
								name='name'
								placeholder={placeholderProps}
								isOnDarkBackground={isOnDarkBackground}
								isReadOnly={isCf || isSaving || isReadOnly || this.state.hasData}
								onChange={(val) => this.handleOnChange('name', val)}
								value={nameValue}
							/>
						</Field>
						</ColHalf>
					<ColFull style={this.getHiddenStyles()}>
						<Field name="address" labelFor={addresbillingForm} isOptional >
						<label className={classes.labelColor}>Dirección de facturación</label>
						<div className={classes.label_}></div>
							<TextInput
								id={addresbillingForm}
								name='address'
								placeholder={placeholderProps}
								isOnDarkBackground={isOnDarkBackground}
								isReadOnly={isCf || isSaving || isReadOnly || (this.state.partnerId != -1)}
								onChange={(val) => this.handleOnChange('address', val)}
								value={addressValue}
							/>
						</Field>
					</ColFull>
					{/* <ColHalf style={this.getHiddenStyles()}>
						<Field name="depto" label={deptoLabelText} labelFor={deptobillingForm}>
							<TextInput
								
								id={deptobillingForm}
								name='depto'
								placeholder={placeholderProps}
								isOnDarkBackground={isOnDarkBackground}
								isReadOnly={isCf || isSaving || isReadOnly}
								onChange={(val) => this.handleOnChange(val)}
								value={deptoValue}
							/>
						</Field>
					</ColHalf>
					<ColHalf style={this.getHiddenStyles()}>
						<Field name="city" label={cityLabelText} labelFor={citybillingForm}>
							<TextInput
								
								id={citybillingForm}
								name='city'
								placeholder={placeholderProps}
								isOnDarkBackground={isOnDarkBackground}
								isReadOnly={isCf || isSaving || isReadOnly}
								onChange={(val) => this.handleOnChange(val)}
								value={cityValue}
							/>
						</Field>
					</ColHalf>  */}
				</Grid>
			</div>
		);
	}
}
export default withStyles(styles)(withComponents(BillingFormAction));