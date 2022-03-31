import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withComponents } from "@reactioncommerce/components-context";

const HomePage = props => {
    const {
        catalogItems,
        currencyCode,
        isLoadingCatalogItems,
        pageInfo,
        pageSize,
        tags,
        setPageSize,
        components:{CatalogLayout},
        setSortBy,
        sortBy,
        uiStore
    } = props;
    // console.log('home page', props)
    // console.info("HomePage -> currencyCode", currencyCode)
    return (
        <Fragment>
            <CatalogLayout
                catalogItems={catalogItems}
                currencyCode={currencyCode}
                isLoadingCatalogItems={isLoadingCatalogItems}
                pageInfo={pageInfo}
                pageSize={pageSize}
                tags={tags}
                setPageSize={setPageSize}
                setSortBy={setSortBy}
                sortBy={sortBy} 
                uiStore={uiStore}
            />
        </Fragment>
    );

}

HomePage.propTypes = {
    catalogItems: PropTypes.array,
    currencyCode: PropTypes.string,
    isLoadingCatalogItems: PropTypes.bool,
    tags: PropTypes.array,
    addItemsToCart: PropTypes.func,
    // onChangeCartItemsQuantity: PropTypes.func.isRequired
};

export default withComponents(HomePage);