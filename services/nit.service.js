import fetch from "isomorphic-unfetch";
const invoiceUrl = process.env.INVOICE_URL;

const getNit = async (apolloClient, nit, accessToken) => {
    let accessTokenStorage;
  try {
     accessTokenStorage = window.localStorage.getItem("accounts:accessToken");
    console.info("accessTokenStorage", accessTokenStorage)
  } catch (ex) {
    console.error("getting nit error", ex);
  }

  try {
    const res = await fetch(`${"https://invoice.lulisgt.com"}/api/nit/${nit}`, {
      method: "GET",
      headers: { Authorization: `bearer ${accessTokenStorage||accessToken}` },
    });
    if (res.status == 200) {
      let json = await res.json();
      return { ...json, hasData: true };
    } else {
      return {
        vat: "0",
        name: "",
        street: "",
        partnerId: -1,
        hasData: false,
      };
    }
  } catch (ex) {
    console.error("getting nit error", ex);
    return {
      vat: "0",
      name: "",
      street: "",
      partnerId: -1,
      hasData: false,
    };
  }
};
export default { getNit };
