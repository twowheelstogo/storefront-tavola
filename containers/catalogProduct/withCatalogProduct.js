import React, { Fragment } from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import inject from "hocs/inject";
import { Query } from "@apollo/react-components";
import hoistNonReactStatic from "hoist-non-react-statics";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import CatalogProductsQuery from "./catalogProducts.gql";
import { withApollo } from "lib/apollo/withApollo";

export  function withCatalogProducts(Component, { tagId, isVisible = true } = {}) {
  class CatalogProductsInner extends React.Component {
    render() {
      return (
        <CatalogProducts tagId={tagId}>
          {(result) => {
            return <Component {...result} />;
          }}
        </CatalogProducts>
      );
    }
  }
  hoistNonReactStatic(CatalogProductsInner, Component);
  return CatalogProductsInner;
}
 class CatalogProducts extends React.Component {
  static propTypes = {
    primaryShopId: PropTypes.string.isRequired,
    routingStore: PropTypes.object.isRequired,
    tagId: PropTypes.string,
    uiStore: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
  };

  render() {
    const { primaryShopId, routingStore, uiStore, tagId = "home" } = this.props;
    const variables = {
      shopId: primaryShopId,
      ...paginationVariablesFromUrlParams(routingStore.query, { defaultPageLimit: uiStore.pageSize }),
      metakey: tagId,
    };

    return (
      <Query errorPolicy="all" query={CatalogProductsQuery} variables={variables}>
        {({ data, fetchMore, loading }) => {
          const result = {
            ...this.props,
            pageInfo: pagination({
              fetchMore,
              routingStore,
              data,
              queryName: "CatalogProducts",
              limit: uiStore.pageSize,
            }),
            catalogProducts:( (data || {}).catalogProducts || {}).nodes  || [],
            isLoading: loading,
          };
          return <Fragment>{this.props.children(result)}</Fragment>;
        }}
      </Query>
    );
  }
}
export  default withApollo()(inject("primaryShopId", "routingStore", "uiStore")(CatalogProducts));
