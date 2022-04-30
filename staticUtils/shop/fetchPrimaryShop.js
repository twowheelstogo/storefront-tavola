import graphQLRequest from "staticUtils/graphQLRequest";
import primaryShopQuery from "./primaryShop.js";
import config from "../../config.js";
import lodash from "lodash";
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
    inp = {};
  }
  const opts = lodash.merge({ inp: { shopIds: (config.SHOP_IDS || "").split(","), ...inp } }, o);
  for (const c of ["shopIds"]) {
    opts.inp[c] = (opts.inp[c] || []).filter((h) => h && h.trim() !== "");
    if (!opts.inp[c].length) delete opts.inp[c];
  }
  const data = await graphQLRequest(primaryShopQuery, opts);

  return (
    (data && data.shopx && data.shopx.shops && data.shopx.shops.length && { shop: data.shopx.shops[0] }) || {
      shop: null,
    }
  );
}
