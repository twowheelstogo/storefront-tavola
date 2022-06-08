import graphQLRequest from "staticUtils/graphQLRequest";
import primaryShopQuery from "./primaryShop.js";
import config from "../../config.js";
import lodash from "lodash";
import Cookies from "js-cookie";
// import * as cookie from 'cookie'
// import SimpleSchema from "simpl-schema";
/**
 * Fetch the primary shop's information
 *
 * @param {String} language - The shop's language
 * @returns {Object} The primary shop
 */
export default async function fetchPrimaryShop(ctx) {//ctx.params.lang
  let inp = null;
  console.info(`\n\n==> { fetchPrimaryShop:ctx }\n`, lodash.get(ctx, "req.headers.cookie"), `\n`, ``);
  // try {
  //   const resl = (window.localStorage || localStorage).getItem("shopxInp");
  //   console.info(`\n\n==> { fetchPrimaryShop:localStorage }\n`, resl, `\n`, ``);
  //   inp = JSON.parse(resl);
  //   console.info(`\n\n==> { fetchPrimaryShop:localStorage:a }\n`, inp, `\n`, ``);
  // } catch (e) {
  //   // console.error(`\n\n==> { fetchPrimaryShop:localStorage:e }\n`, e, `\n`, ``);
  // }
  // try {
  //   const res = Cookies.get("shopxInp");
  //   console.info(`\n\n==> { fetchPrimaryShop:Cookies }\n`, res, `\n`, ``);
  //   inp = JSON.parse(res);
  //   console.info(`\n\n==> { fetchPrimaryShop:Cookies:a }\n`, inp, `\n`, ``);
  // } catch (e) {
  //   // console.error(`\n\n==> { fetchPrimaryShop:Cookies:e }\n`, e, `\n`, ``);

  //   inp = {};
  // }
  try {
    const res = lodash.get(ctx, "req.headers.cookie.shopxInp");
    console.info(`\n\n==> { fetchPrimaryShop:Cookies }\n`, res, `\n`, ``);
    inp = JSON.parse(res);
    // console.info(`\n\n==> { fetchPrimaryShop:Cookies:a }\n`, inp, `\n`, ``);
  } catch (e) {
    // console.error(`\n\n==> { fetchPrimaryShop:Cookies:e }\n`, e, `\n`, ``);

    inp = {};
  }
  if (!inp)
    try {
      inp = shopxInp.clean(inp);
    } catch (error) {
      inp = {};
    }
  if (!inp) inp = {};
  const opts = lodash.merge({ inp: {limit:9, debug:true, incGeo:false, shopIds: (config.SHOP_IDS || "").split(","), ...inp } }, {language:ctx.params.lang});
  for (const c of ["shopIds"]) {
    opts.inp[c] = (opts.inp[c] || []).filter((h) => h && h.trim() !== "");
    if (!opts.inp[c].length) delete opts.inp[c];
  }
  // For Test
  opts.inp.limit = 10;
  const data = await graphQLRequest(primaryShopQuery, opts);
// console.info("LOG:fetchPrimaryShop: Multiple Store", data, opts, data.shopx.shops.map((shop) => shop.name))
  return (
    (data && data.shopx && data.shopx.shops && data.shopx.shops.length && { shop: data.shopx.shops[0] }) || {
      shop: null,
    }
  );
}
