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
			<div style={{ display: "flex", marginRight: -10 }}>
				{deliveryMethods &&
					deliveryMethods.map((meth) => (
						<div>
							<Button
								style={{
									border: `1px solid ${this.state.shippingType === meth.name ? "#000" : "#979797"}`,
									backgroundColor: this.state.shippingType === meth.name ? "#F6F6F6" : "white",
									opacity: this.state.shippingType === meth.name ? 1 : 0.5,
									color: this.state.shippingType === meth.name ? "#000" : "#979797",
									padding: "40px 0 15px",
									marginRight: 10,
									width: "40%",
									textAlign: "center",
								}}
								onClick={() => this.handleShippingType(meth.name)}
							>
								<div>
									<img style={{ backgroundColor: "pruple", maxWidth: 50, display: "block" }} src={meth.icon} />
									<h5>{meth.displayName}</h5>
								</div>
							</Button>
						</div>

					))}
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