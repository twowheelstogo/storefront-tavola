import graphQLRequest from "staticUtils/graphQLRequest";
import gqls from "./gqls.js";
import lodash from "lodash";
export default async function fetchApp(ctx, query = "shops") {
  let inp = {};

  const opts = lodash.merge(
    {
      inp: {
        // incGeo: process.env.SHOPX_GEO_ENABLED,
        // incLocation: process.env.SHOPX_LOCATION_ENABLED,
        // shopIds: (process.env.SHOP_IDS || "").split(","),
        // ...inp,
      },
    },
    // ctx.params,
  );
  // for (const c of ["shopIds"]) {
  //   opts.inp[c] = (opts.inp[c] || []).filter((h) => h && h.trim() !== "");
  //   if (!opts.inp[c].length) delete opts.inp[c];
  // }
  const data = await graphQLRequest(gqls[query], opts);
  // console.info(`\n\n==> { data }\n`, data, `\n`, ``);
  return data.app;
  // console.info(`\n\n==> { data }\n`, data, `\n`, ``);

  // return (
  //   (data && data.shopx && data.shopx.shops && data.shopx.shops.length && { shop: data.shopx.shops[0] }) || {
  //     shop: null,
  //   }
  // );
}
