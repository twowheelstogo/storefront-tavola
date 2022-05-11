import React from "react";
import withAddressBook from "containers/address/withAddressBook";
import inject from "hocs/inject";
import relayConnectionToArray from "lib/utils/relayConnectionToArray";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import { addTypographyStyles } from "@reactioncommerce/components/utils";

const SecureCaption = styled.div`
  ${addTypographyStyles("StripePaymentInputCaption", "captionText")}
`;

const Span = styled.span`
  vertical-align: super;
`;

class ShippingAddressCheckoutAction extends React.Component {
	handleDeleteAddress = async (id) => {
		const { onAddressDeleted } = this.props;
		await onAddressDeleted(id);
	}
	renderAddressList() {
		const {
			authStore: { account: { addressBook } },
			components: { AddressList },
			onSubmit,
			fulfillmentGroup: { shippingAddress }
		} = this.props;
		// Use relayConnectionToArray to remove edges / nodes levels from addressBook object
		const addresses = (addressBook && relayConnectionToArray(addressBook)) || [];
		// Create data object to pass to AddressBook component
		const accountAddressBook = {
			addressBook: addresses
		};
		return (
			<AddressList
				onAddressDeleted={this.handleDeleteAddress}
				account={accountAddressBook}
				onSelect={onSubmit}
				currentAddress={shippingAddress}
			/>
		);
	}
	render() {
		const {
			fulfillmentGroup: { shippingAddress },
			components: { InlineAlert },
			alert
		} = this.props;
		const date = new Date();
		date.setHours(date.getHours() + 1);
		const estimatedTime = `${date.getHours()}:${date.getMinutes()}`;

		return (
			<React.Fragment>
				{this.renderAddressList()}
				<SecureCaption>
					{shippingAddress && (<Span>{"Tu orden llegará a más tardar a las " + estimatedTime}</Span>)}
				</SecureCaption>
				{alert ? <InlineAlert {...alert} /> : ""}
			</React.Fragment>
		);
	}
}
export default withAddressBook(inject("authStore")(withComponents(ShippingAddressCheckoutAction)));