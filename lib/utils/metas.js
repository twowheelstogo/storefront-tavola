import lodash from "lodash";
export default function metas(metafields) {
  const res = {};
  const ns = {};
  if ((metafields || []).length)
    for (const m of metafields) {
      lodash.set(res, m.key, m.value);
      lodash.set(ns[m.namespace || "def"], m.key, m.value);
      /**
       * object = {}
       * set(object, "item1.0.end", "valueX") => object = {"item1": [{"end": "valueX"}]}
       * get(object, "item1.0.end") => "valueX"
       */
    }
  return { res, ns };
}
