import { useQuery } from "@apollo/client";
import useShop from "hooks/shop/useShop";
import getBranchNear from "./queryGetBranchNear.gql";

/**
 * Gets all branches
 * @returns {Array} the branches data
 */

export default function useBranchNear(lat, lng) {
  const shop = useShop();
  const { loading, data } = useQuery(getBranchNear, {
    variables: {
      shopId: shop && shop._id,
      point: {
        type: "Point",
        coordinates: [lng, lat],
      },
    },
  });
  const branches = data ? data.metaddress : [];
  return { branches, loading };
}
