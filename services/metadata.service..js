import fetch from "isomorphic-unfetch";

const updateMetadataAddressBook = async (metaddress, addressId, accessToken) => {
  let url = process.env.EXTERNAL_GRAPHQL_URL;
  let body = JSON.stringify({
    operationName: "updateMetadataAddressBook",
    query:
      "mutation updateMetadataAddressBook($metaddress: MetaddressInput, $addressId: ID){ updateMetadataAddressBook(metaddress: $metaddress, addressId: $addressId){ _id description address reference receiver phone geolocation{ latitude longitude } metaddress{ administrative_area_level_1 administrative_area_level_2 neighborhood street_address sublocality distance{ text value branchId branch } } } }",
    variables: {
      metaddress,
      addressId,
    },
  });
  const res = await fetch(url, {
    method: "POST",
    body,
    headers: {
      Authorization: `${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (res.status == 200) {
    let json = await res.json();
    return json.data.updateMetadataAddressBook;
  } else {
    throw new Error("error ");
  }
};

export default { updateMetadataAddressBook };
