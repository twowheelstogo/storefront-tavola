import React, { Fragment, Component } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import { addTypographyStyles } from "@reactioncommerce/components/utils";

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SecureCaption = styled.div`
  ${addTypographyStyles("StripePaymentInputCaption", "captionText")}
`;

const Span = styled.span`
  vertical-align: super;
`;

const IconLockSpan = styled.span`
  display: inline-block;
  height: 20px;
  width: 20px;
`;

class PickupCheckoutAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingDetails: false,
    };
  }
  renderPickupLocations() {
    return <div>PickupLocations</div>;
  }
  _form = null;

  handleSubmit = async (value) => {
    const {
      submits: { onSubmitSetFulfillment },
    } = this.props;
	const nowSplit = new Date().toISOString().split(":")
    const time = new Date(`${value.pickupDate}T${value.pickupTime}:${nowSplit[nowSplit.length-1]}`);
	// console.info("LOG: PickupCheckoutAction : value", value, time)
    this.setState({
      isLoadingDetails: true,
    });

    await onSubmitSetFulfillment({type:"pickup", picktimes: [{ time }] });

    this.setState({
      isLoadingDetails: false,
    });
  };

  renderForm() {
    const {
      components: { PickupForm },
      fulfillmentGroup: { picktimes },
    } = this.props;
    const time = (picktimes || []).concat([{ time: new Date() }])[0].time || new Date();
    // const values = data.pickupDetails && data.pickupDetails.datetime.split(" ");
    let [pickupDate, pickupTime] = new Date(time).toISOString().split("T");
	pickupTime = pickupTime.substring(0,5);
	// console.info("LOG: PickupCheckoutAction : time", time, pickupTime)
    return (
      <PickupForm
        ref={(formEl) => (this._form = formEl)}
        onSubmit={this.handleSubmit}
        value={{ pickupDate, pickupTime }}
      />
    );
  }
  render() {
    const {
      components: { Button },
    } = this.props;
    return (
      <Fragment>
        <Grid>
          {this.renderForm()}
          <SecureCaption>
            {/*schedule date and time of collection no less than 20 minutes of delivery */}
            <Span>{"Agenda fecha y hora de pickup no menor a 20 minutos de entrega"}</Span>
          </SecureCaption>
          <Button
            title="secondary"
            actionType="secondary"
            isShortHeight
            isWaiting={this.state.isLoadingDetails}
            onClick={() => this._form.submit()}
          >
            {/* SAVED DATE */}
            {"Guardar fecha"}
          </Button>
          {/* {this.renderPickupLocations()} */}
        </Grid>
      </Fragment>
    );
  }
}
export default withComponents(PickupCheckoutAction);
