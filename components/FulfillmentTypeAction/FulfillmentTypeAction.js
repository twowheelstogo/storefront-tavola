import React, { Component, Fragment } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import { Button } from "@material-ui/core";

const InputContent = styled.div`
  padding-top: 15px;
`;
class FulfillmentTypeAction extends Component {
  state = {
    shippingType: "shipping",
    shipping: {},
  };

  setSelectedDeliveryMethodName = async (method) => {
    // console.info("selected method", method);
    const {
      submits: { onSelectFulfillmentType },
    } = this.props;
    await onSelectFulfillmentType(method.name);
  };

  handleShippingType = (data) => {
    let shippingType = data.name;
    this.setState({ shippingType });
  };

  renderDeliveryMethods() {
    const {
      deliveryMethods,
      components: { CartItems },
      fulfillmentGroup,
    } = this.props;
    // return <CartItems
    // 	items={deliveryMethods.filter((method) => method.enabled)}
    // 	onSelect={this.setSelectedDeliveryMethodName}
    // 	itemSelected={deliveryMethods.find((item) => item.name == fulfillmentGroup.type)} />;

    return <div> </div>;
  }

  render() {
    const { deliveryMethods, fulfillmentGroup } = this.props;
    const selectedDeliveryMethod = deliveryMethods.find((item) => item.name == fulfillmentGroup.type);
    return (
      <Fragment>
        <div>
          {deliveryMethods &&
            deliveryMethods.map((meth) => (
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
                  onClick={() => {
                    this.handleShippingType(meth);
                    // this.setSelectedDeliveryMethodName(meth)
                  }}
                >
                  <div>
                    <img style={{ backgroundColor: "pruple", maxWidth: 50, display: "block" }} src={meth.icon} />
                    <h5>{meth.displayName}</h5>
                  </div>
                </Button> 
            ))}
        </div>
        {/* <InputContent>
					<meth.InputComponent {...this.props}/>
				</InputContent> */}
        {deliveryMethods &&
          deliveryMethods.filter((m) => m.name === this.state.shippingType).map((meth) => (
            <InputContent>
                <meth.InputComponent {...this.props} />
              </InputContent>
          ))}
      </Fragment>
    );
  }
}

export default withComponents(FulfillmentTypeAction);
