import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withComponents } from "@reactioncommerce/components-context";
import withCart from "containers/cart/withCart";
import inject from "hocs/inject";

const HomePage = (props) => {
  const {
    catalogItems,
    currencyCode,
    isLoadingCatalogItems,
    pageInfo,
    pageSize,
    tags,
    setPageSize,
    components: { CatalogLayout,ProductDetailDrawer},
    setSortBy,
    sortBy,
    uiStore,
  } = props;

  return (
    <Fragment>
      <CatalogLayout
        {...props}
      />
      <ProductDetailDrawer {...props} />
    </Fragment>
  );
};

HomePage.propTypes = {
  catalogItems: PropTypes.array,
  currencyCode: PropTypes.string,
  isLoadingCatalogItems: PropTypes.bool,
  tags: PropTypes.array,
  addItemsToCart: PropTypes.func,
};

export default withComponents(withCart(HomePage));
// export default withApollo()(inject("routingStore", "catalogItems", "uiStore")(withCart(HomePage)));
