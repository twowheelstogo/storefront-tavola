import { createContext, useState } from "react";
import PropTypes from "prop-types";
import getAccountsHandler from "../lib/accountsServer.js";

/**
 * Splits the user's full name into first and last name
 *
 * @param {Object} account - the users account
 * @returns {Object} users first and last name as object properties
 */
function splitNames(account) {
  let firstName = "";
  let lastName = "";
  const { name } = account;
  const nameParts = name && name.split(" ");
  if (Array.isArray(nameParts)) {
    [firstName, lastName] = nameParts;
  }

  return {
    firstName,
    lastName,
  };
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accountId, setAccountId] = useState(null);
  const [account, _setAccount] = useState({});
  const [state, setState] = useState({ loading: true });
  const { accountsClient } = getAccountsHandler();

  const setAccount = (newAccount) => {
    setAccountId(newAccount?._id ?? null);
    if (newAccount) {
      _setAccount({ ...splitNames(newAccount), ...newAccount });
    } else {
      _setAccount({});
    }
  };

  const fetchUser = async () => {
    const accountsUser = await accountsClient.getUser();
    setState({ loading: false, user: accountsUser });
  };

  const loginWithService = async (service, credentials) => {
    await accountsClient.loginWithService(service, credentials);
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        accountId,
        account,
        setAccount,
        isAuthenticated: !!accountId,
        loginWithService,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
