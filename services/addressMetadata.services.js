import fetch from "isomorphic-unfetch";

const getAddressMetadata = async (lat, lng, accessToken) => {
  try {
    let url = process.env.INVOICE_URL;
    url += "/api/address";
    url += `/lat/${encodeURIComponent(lat)}`;
    url += `/lng/${encodeURIComponent(lng)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `bearer ${accessToken}` },
    });
    if (res.status == 200) {
      let json = await res.json();
      return json;
    } else {
      throw new Error("");
    }
  } catch (ex) {
    return {
      administrative_area_level_1: "Guatemala",
      administrative_area_level_2: "Guatemala",
      neighborhood: "",
      street_address: "26 Avenida 4-81, Cdad. de Guatemala, Guatemala",
      sublocality: "Zona 14",
      distance: {
        text: "0 km",
        value: 0.1,
      },
    };
  }
};

const getAddressMetadataGraphql = async (apolloClient, lat, lng, accessToken, shop) => {
    let ret = {
              administrative_area_level_1: "Guatemala",
      administrative_area_level_2: "Guatemala",
      neighborhood: "",
      street_address: "26 Avenida 4-81, Cdad. de Guatemala, Guatemala",
      sublocality: "Zona 14",
      distance: {
        text: "0 km",
        value: 0.1,
        branch: "",
        branchId: "",
      },
    }
    // const res = await apolloClient.query({
    //     query: "query getBranchNear ($shopId: ID!, $point: UpdateGeoPointInput!){ metaddress(shopId:$shopId, point:$point){ administrative_area_level_1 administrative_area_level_2 neighborhood street_address sublocality distance{ text value branchId branch } } }",
    //          variables: {
    //     shopId: shop._id,
    //     point: {
    //       type: "Point",
    //       coordinates: [lng, lat],
    //     },
    //   },
    //   });
      // console.info("LOG: getAddressMetadataGraphql", res)
      // if(res && res.data){
      //     ret= {
      //         ...ret,
      //         ...res.data
      //     };
      // }
      // return ret;
//   try {
//     let url = process.env.EXTERNAL_GRAPHQL_URL;
//     let body = JSON.stringify({
//       operationName: "getBranchNear",
//       query:
//         "query getBranchNear ($shopId: ID!, $point: UpdateGeoPointInput!){ metaddress(shopId:$shopId, point:$point){ administrative_area_level_1 administrative_area_level_2 neighborhood street_address sublocality distance{ text value branchId branch } } }",
//       variables: {
//         shopId: shop._id,
//         point: {
//           type: "Point",
//           coordinates: [lng, lat],
//         },
//       },
//     });
//     const res = await fetch(url, {
//       method: "POST",
//       body,
//       headers: {
//         Authorization: `${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });
//     if (res.status == 200) {
//       let json = await res.json();
//       json.data.metaddress.distance.value = +json.data.metaddress.distance.value;
//       return json.data.metaddress;
//     } else {
//       return {
//         administrative_area_level_1: "Guatemala",
//         administrative_area_level_2: "Guatemala",
//         neighborhood: "",
//         street_address: "26 Avenida 4-81, Cdad. de Guatemala, Guatemala",
//         sublocality: "Zona 14",
//         distance: {
//           text: "0 km",
//           value: 0.1,
//           branch: "",
//           branchId: "",
//         },
//       };
//     }
//   } catch (error) {
//     return {
//       administrative_area_level_1: "Guatemala",
//       administrative_area_level_2: "Guatemala",
//       neighborhood: "",
//       street_address: "26 Avenida 4-81, Cdad. de Guatemala, Guatemala",
//       sublocality: "Zona 14",
//       distance: {
//         text: "0 km",
//         value: 0.1,
//         branch: "",
//         branchId: "",
//       },
//     };
//   }
};

export default { getAddressMetadata, getAddressMetadataGraphql };
