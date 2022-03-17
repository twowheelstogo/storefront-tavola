import React,{Fragment,Component} from "react";
import { withComponents } from "@reactioncommerce/components-context";
import PropTypes from "prop-types";
import { applyTheme, CustomPropTypes, getRequiredValidator } from "@reactioncommerce/components/utils";
import { Form } from "reacto-form";
import ShippingAddressCheckoutAction from "components/ShippingAddressCheckoutAction";
import ShippingMethodCheckoutAction from "components/ShippingMethodCheckoutAction";
import Actions from "components/Actions";
class ShippingCheckoutAction extends Component{
    static propTypes = {
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
    		RegionInput: CustomPropTypes.component.isRequired
    	}).isRequired,
    }
    renderForm(){
    	const {components:
            {Field,Select},
    	className,
    	errors,
    	name,
    	onChange,
    	onSubmit,
    	validator,
    	value} = this.props;
    	return(
    		<Form
    			className={className}
    			ref={(formEl)=>{
    				this._dateForm=formEl;
    			}}

    		>
    		</Form>
    	);
    }
    renderActions(){
    	const {actionAlerts,fulfillmentGroup,onSubmit,onSubmitShippingAddress,submits} = this.props;
    	const actions = [
    		{
    			id: "2",
    			activeLabel: "A dónde llevaremos tu orden?",
    			completeLabel: "Shipping address",
    			incompleteLabel: "Shipping address",
    			// status: fulfillmentGroup.type !== "shipping" || fulfillmentGroup.shippingAddress ? "complete" : "incomplete",
    			component: ShippingAddressCheckoutAction,
    			onSubmit: submits.onSubmitShippingAddress,
    			props: {
    				alert: actionAlerts["2"],
    				fulfillmentGroup
    			}
    		},
    		// {
    		// 	id: "3",
    		// 	activeLabel: "Elige un método de envío",
    		// 	completeLabel: "Shipping address",
    		// 	incompleteLabel: "Shipping address",
    		// 	// status: fulfillmentGroup.type !== "shipping" || fulfillmentGroup.shippingAddress ? "complete" : "incomplete",
    		// 	component: ShippingMethodCheckoutAction,
    		// 	onSubmit: submits.onSetShippingMethod,
    		// 	props: {
    		// 		alert: actionAlerts["3"],
    		// 		fulfillmentGroup
    		// 	}
    		// },
    	];
    	return <Actions actions={actions}/>;
    }
    render(){
    	const {components:{Field}} = this.props;
    	return(
    		<Fragment>
    			{this.renderActions()}
    		</Fragment>
    	);
    }
}
export default withComponents(ShippingCheckoutAction);