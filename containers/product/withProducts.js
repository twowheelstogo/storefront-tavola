import React from "react";
import PropTypes from "prop-types";
import inject from "hocs/inject";
import { Query } from "@apollo/react-components";
import hoistNonReactStatic from "hoist-non-react-statics";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import productsQuery from "./products.gql";

/**
 * withProducts higher order query component for fetching primaryShopId and catalog data
 * @name withProducts
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and catalog as props
 */
export default function withProducts(Component) {
	class Products extends React.Component {
    static propTypes = {
    	primaryShopId: PropTypes.string,
    	routingStore: PropTypes.object.isRequired,
    	tag: PropTypes.shape({
    		_id: PropTypes.string.isRequired
    	}),
    	uiStore: PropTypes.object.isRequired
    };

    render() {
    	const { primaryShopId, routingStore, uiStore, tag } = this.props;
    	const {query:{query}} = routingStore;
    	const [sortBy, sortOrder] = uiStore.sortBy.split("-");
    	const tagIds = tag && [tag._id];
    	if (!primaryShopId||!query) {
    		return (
    			<Component
    				awaiting={true}
    				{...this.props}
    			/>
    		);
    	}
    	const variables = {
    		shopIds: [primaryShopId],
    		...paginationVariablesFromUrlParams(routingStore.query, { defaultPageLimit: uiStore.pageSize }),
    		tagIds,
    		sortBy,
    		sortByPriceCurrencyCode: uiStore.sortByCurrencyCode,
    		sortOrder,
    		query
    	};
    	return (
    		<Query errorPolicy="all" query={productsQuery} variables={variables}>
    			{({ data, fetchMore, loading }) => {
    				const { products } = data || {};
    				return (
    					<Component
    						{...this.props}
    						productsPageInfo={pagination({
    							fetchMore,
    							routingStore,
    							data,
    							queryName: "products",
    							limit: uiStore.pageSize
    						})}
    						awaiting={false}
    						products={(products && products.nodes) || []}
    						isLoadingProducts={loading}
    					/>
    				);
    			}}
    		</Query>
    	);
    }
	}

	hoistNonReactStatic(Products, Component);

	return inject("primaryShopId", "routingStore", "uiStore")(Products);
}