import lodash from "lodash";
export default function initMetas(res, input, prefix) {
  res.metafields = res.metafields || []
  for (const [k, obj] of Object.entries(input)) {
    for (const [kobj, vobj] of Object.entries(obj)) {
      const key = `${prefix ? `${prefix}.`:""}${k}.${kobj}`;
      const found = res.metafields.find((m) => m.key === key);
      if(typeof vobj === "object" && !Array.isArray(vobj)){
        res.metafields.push(...initMetas({}, vobj, key).metafields);
      }else{
        const str = typeof vobj !== "string" && vobj !== null ? JSON.stringify(vobj) :vobj;
        if (found) {
          found.value = str;
        } else {
          res.metafields.push({ key, value: str });
        }
      }
    }
  }
  return res;
}
