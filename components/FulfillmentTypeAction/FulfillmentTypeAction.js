import React, { Component, Fragment } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import Button from "@material-ui/core/Button"
const InputContent = styled.div`
    padding-top: 15px;
`;
class FulfillmentTypeAction extends Component {

	state = {
		shippingType: "shipping",
	};

	handleShippingType = (shippingType) => {
		this.setState({ shippingType });
	};

	setSelectedDeliveryMethodName = async (method) => {
		const { submits: { onSelectFulfillmentType } } = this.props;
		await onSelectFulfillmentType(method.name);
	}

	renderDeliveryMethods() {
		const { deliveryMethods, components: { CartItems }, fulfillmentGroup } = this.props;
		return (
			<div>
				
			</div>
		)
	}

	render() {
		const { deliveryMethods, fulfillmentGroup } = this.props;
		const selectedDeliveryMethod = deliveryMethods.find((item) => item.name == fulfillmentGroup.type);
		return (
			<div>
				{this.renderDeliveryMethods()}
				{/* 		{!!selectedDeliveryMethod && !!selectedDeliveryMethod.InputComponent
					&& (
						<InputContent>
							<selectedDeliveryMethod.InputComponent {...this.props} />
						</InputContent>
					)} */}
				{
					this.state.shippingType === "shipping" && (
						<InputContent>
							<selectedDeliveryMethod.InputComponent {...this.props} />
						</InputContent>
					)
				}
			</div>
		);
	}
}

export default withComponents(FulfillmentTypeAction);