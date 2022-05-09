import { useQuery } from "@apollo/client";
import useShop from "hooks/shop/useShop";
import getBranchesQuery from "./queries.gql";

/**
 * Gets all branches
 * @returns {Array} the branches data
 */

export default function useBranch() {
  const shop = useShop();
  const { loading, data } = useQuery(getBranchesQuery, {
    variables: {
      shopId: shop && shop._id,
    },
  });
  const branches = data ? data.branchWithoutPagination : [];
  return { branches, loading };
}
