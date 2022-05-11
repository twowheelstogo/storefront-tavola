import fetch from "isomorphic-unfetch";
const getIsAvailableBranch = async (accessToken, shop, branchId, date = null) => {
  try {
    let url = process.env.EXTERNAL_GRAPHQL_URL;
    let body = JSON.stringify({
      operationName: "getIsAvailable",
      query:
        "query getIsAvailable($shopId: ID, $branchId: ID, $date: DateTime){ isAvailableBranch(shopId: $shopId, branchId: $branchId, date:$date) }",
      variables: {
        shopId: shop._id,
        branchId,
        date,
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
      return json.data.isAvailableBranch;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export default { getIsAvailableBranch };
