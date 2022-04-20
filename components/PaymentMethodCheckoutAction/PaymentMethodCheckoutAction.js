import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withComponents } from "@reactioncommerce/components-context";
import { CustomPropTypes } from "@reactioncommerce/components/utils";
import styled from "styled-components";

const InputContent = styled.div`
    padding-top: 15px;
`;
class PaymentMethodCheckoutAction extends Component {
	constructor(props) {
		super(props);
		let selectedPaymentMethodName = null;
		const { paymentMethods, addresses } = props;
		if (Array.isArray(paymentMethods)) {
			const [method] = paymentMethods;
			if (method) {
				selectedPaymentMethodName = method.name;
			}
		}
		this.state = {
			selectedPaymentMethodName,
			billingAddress: addresses && addresses[0] ? addresses[0] : null,
			inputIsComplete: false
		};
	}
	static propTypes = {
		paymentMethods: PropTypes.array,
		components: PropTypes.shape({
			CardItems: CustomPropTypes.component.isRequired
		})
	}
	componentDidMount() {
		const { onChange } = this.props;
		const { billingAddress, selectedPaymentMethodName } = this.state;
		// onChange({
		// 	billingAddress,selectedPaymentMethodName
		// });
	}
	setSelectedPaymentMethodName = (method) => {
		const { onReset } = this.props;
		onReset();
		this.setState({
			selectedPaymentMethodName: method.name
		});
	}
	checkIfInputsAreFilled = (inputs) => {
		const isFilled = inputs && Object.keys(inputs).every((key) => (["postalCode"].indexOf(key) > -1 ? true : inputs[key] !== null));
		return isFilled;
	}
	handleInputComponentSubmit = async ({ amount = null, data, displayName } = {}) => {
		const { onSubmit, paymentMethods, remainingAmountDue } = this.props;
		const { billingAddress, selectedPaymentMethodName } = this.state;

		const selectedPaymentMethod = paymentMethods.find((method) => method.name === selectedPaymentMethodName);

		let cappedPaymentAmount = amount;
		if (cappedPaymentAmount && typeof remainingAmountDue === "number") {
			cappedPaymentAmount = Math.min(cappedPaymentAmount, remainingAmountDue);
		}

		await onSubmit({
			displayName: displayName || selectedPaymentMethod.displayName,
			payment: {
				amount: cappedPaymentAmount,
				billingAddress,
				data,
				method: selectedPaymentMethodName
			}
		});
	}
	handleSubmit = (value) => {
		if (this.checkIfInputsAreFilled(value.data)) {
			//   this.handleInputComponentSubmit(value);
		}
	}
	handleChange = (value) => {
		const { onChange } = this.props;
		const { selectedPaymentMethodName } = this.state;
		onChange({ ...value, selectedPaymentMethodName });

	}
	renderPaymentMethods() {
		const {
			paymentMethods,
			components: { CardItems },
		} = this.props;
		const {
			selectedPaymentMethodName
		} = this.state;
		return (
			<CardItems
				items={paymentMethods}
				onSelect={this.setSelectedPaymentMethodName}
				itemSelected={paymentMethods.find((item) => item.name == selectedPaymentMethodName)}
			/>
		);
	}
	render() {
		const {
			paymentMethods,
			components: { InlineAlert },
			alert
		} = this.props;
		const {
			selectedPaymentMethodName
		} = this.state;
		const selectedPaymentMethod = paymentMethods.find((item) => item.name == selectedPaymentMethodName);
		return (
			<div id={"payment"}>
				{this.renderPaymentMethods()}
				<br></br>
				{alert ? <InlineAlert {...alert} /> : ""}
				{!!selectedPaymentMethod && selectedPaymentMethod.InputComponent
					&& (
						<InputContent>
							<selectedPaymentMethod.InputComponent
								{...this.props}
								onChange={this.handleChange}
								onSubmit={this.handleSubmit} />
						</InputContent>
					)}
			</div>
		);
	}
}
export default withComponents(PaymentMethodCheckoutAction);