import React, { Component, Fragment } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";

const InputContent = styled.div`
    padding-top: 15px;
`;
class FulfillmentTypeAction extends Component {

	setSelectedDeliveryMethodName = async (method) => {
		const { submits: { onSelectFulfillmentType } } = this.props;
		await onSelectFulfillmentType(method.name);
	}

	renderDeliveryMethods() {
		const { deliveryMethods, components: { CardItems }, fulfillmentGroup } = this.props;
		return <CardItems
			items={deliveryMethods.filter((method) => method.enabled)}
			onSelect={this.setSelectedDeliveryMethodName}
			itemSelected={deliveryMethods.find((item) => item.name == fulfillmentGroup.type)} />;
	}

	render() {
		const { deliveryMethods, fulfillmentGroup } = this.props;
		const selectedDeliveryMethod = deliveryMethods.find((item) => item.name == fulfillmentGroup.type);
		return (
			<Fragment>
				{this.renderDeliveryMethods()}
				{!!selectedDeliveryMethod && !!selectedDeliveryMethod.InputComponent
					&& (
						<InputContent>
							<selectedDeliveryMethod.InputComponent {...this.props} />
						</InputContent>
					)}
			</Fragment>
		);
	}
}

export default withComponents(FulfillmentTypeAction);