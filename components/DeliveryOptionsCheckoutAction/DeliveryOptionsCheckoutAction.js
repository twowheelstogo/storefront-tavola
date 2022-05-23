import React, { Component, Fragment } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
const InputContent = styled.div`
  padding-top: 15px;
`;
class DeliveryOptionsCheckoutAction extends Component {
  setSelectedDeliveryMethodName = async (method) => {
    const {
      submits: { onSubmitSetFulfillment },
    } = this.props;
    // console.log("setSelectedDeliveryMethodName---->", { type: method.name, fulfillmentId: this.props.fulfillmentGroup._id });
    await onSubmitSetFulfillment({ type: method.name, fulfillmentId: this.props.fulfillmentGroup._id });
  };
  renderDeliveryMethods() {
    const {
      deliveryMethods,
      components: { CardItemList },
      fulfillmentGroup,
    } = this.props;
    return (
      <CardItemList
        items={deliveryMethods.filter((method) => method.enabled)}
        onSelect={this.setSelectedDeliveryMethodName}
        itemSelected={deliveryMethods.find((item) => item.name == fulfillmentGroup.type)}
      />
    );
  }
  render() {
    const { deliveryMethods, fulfillmentGroup } = this.props;
    const selectedDeliveryMethod = deliveryMethods.find((item) => item.name == fulfillmentGroup.type);
    return (
      <Fragment>
        {this.renderDeliveryMethods()}
        {!!selectedDeliveryMethod && !!selectedDeliveryMethod.InputComponent && (
          <InputContent>
            <selectedDeliveryMethod.InputComponent {...this.props} />
          </InputContent>
        )}
      </Fragment>
    );
  }
}

export default withComponents(DeliveryOptionsCheckoutAction);
