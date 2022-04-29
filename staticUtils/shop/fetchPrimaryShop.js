import graphQLRequest from "staticUtils/graphQLRequest";
import primaryShopQuery from "./primaryShop.js";
import getConfig from "next/config";
import lodash from "lodash";
const { SHOP_IDS = "" } = getConfig().publicRuntimeConfig;
/**
 * Fetch the primary shop's information
 *
 * @param {String} language - The shop's language
 * @returns {Object} The primary shop
 */
export default async function fetchPrimaryShop(o) {
  let inp = {};
  try {
    inp = JSON.parse(localStorage.getItem("shopxInp"));
  } catch (e) {
    inp={}
    console.info("fetchPrimaryShop: error:", e)
  }

  opts = lodash({ language, inp: { shopIds: SHOP_IDS.split(","), ...inp } }, o);
  console.info(`\n\n==> { fetchPrimaryShop:opts }\n`, opts, `\n`, ``);
  const data = await graphQLRequest(primaryShopQuery, opts);
  console.info(`\n\n==> { fetchPrimaryShop:data }\n`, data, `\n`, ``);

  return (data && data.primaryShop && { shop: data.primaryShop }) || { shop: null };
}
