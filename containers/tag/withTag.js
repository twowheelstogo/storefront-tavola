import React, { Fragment } from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import inject from "hocs/inject";
import { Query } from "@apollo/react-components";
import hoistNonReactStatic from "hoist-non-react-statics";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import TagsQuery from "./tags.gql";
import { withApollo } from "lib/apollo/withApollo";

export function withTags(Component, { group, isVisible = true, filter } = {}) {
  class TagsInner extends React.Component {
    render() {
      return (
        <Tags group={group} filter={filter}>
          {(result) => {
            return <Component {...result} />;
          }}
        </Tags>
      );
    }
  }
  hoistNonReactStatic(TagsInner, Component);
  return TagsInner;
}
class Tags extends React.Component {
  static propTypes = {
    primaryShopId: PropTypes.string.isRequired,
    routingStore: PropTypes.object.isRequired,
    group: PropTypes.string,
    uiStore: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired,
    filter: PropTypes.string,
  };

  render() {
    const { primaryShopId, routingStore, uiStore, group = "home", filter } = this.props;
    const variables = {
      shopId: primaryShopId,
      ...paginationVariablesFromUrlParams(routingStore.query, { defaultPageLimit: uiStore.pageSize }),
      metakey: group,
      filter,
    };

    return (
      <Query errorPolicy="all" query={TagsQuery} variables={variables}>
        {({ data, fetchMore, loading }) => {
          const result = {
            ...this.props,
            pageInfo: pagination({
              fetchMore,
              routingStore,
              data,
              queryName: "Tags",
              limit: uiStore.pageSize,
            }),
            tags: ((data || {}).tags || {}).nodes || [],
            isLoading: loading,
          };
          return (
            <Fragment>
              {typeof this.props.children === "function" ? this.props.children(result) : this.props.children}
            </Fragment>
          );
        }}
      </Query>
    );
  }
}
export default withApollo()(inject("primaryShopId", "routingStore", "uiStore")(Tags));
