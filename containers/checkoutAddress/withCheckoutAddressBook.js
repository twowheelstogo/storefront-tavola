import React from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import useAddAccountAddressBookEntry from "hooks/address/useAddAccountAddressBookEntry";
import useRemoveAccountAddressBookEntry from "hooks/address/useRemoveAccountAddressBookEntry";
import useUpdateAccountAddressBookEntry from "hooks/address/useUpdateAccountAddressBookEntry";
import { withComponents } from "@reactioncommerce/components-context";
/**
 * @summary HOC that adds address book props
 * @param {React.Component} Component React Component to wrap
 * @return {React.Component} Wrapped component
 */
export default function withCheckoutAddressBook(Component) {
	const WithCheckoutAddressBook = React.forwardRef((props,ref)=>{
		const [addAccountAddressBookEntry] = useAddAccountAddressBookEntry();
		const [updateAccountAddressBookEntry] = useUpdateAccountAddressBookEntry();
		const [removeAccountAddressBookEntry] = useRemoveAccountAddressBookEntry();

		return (
			<Component
				{...props}
				ref={ref}
				onAddressAdded={addAccountAddressBookEntry}
				onAddressEdited={updateAccountAddressBookEntry}
				onAddressDeleted={removeAccountAddressBookEntry}
			/>
		);
	});

	hoistNonReactStatic(WithCheckoutAddressBook, Component);

	return withComponents(WithCheckoutAddressBook);
}