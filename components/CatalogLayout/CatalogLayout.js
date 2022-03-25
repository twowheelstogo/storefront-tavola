import React, { Fragment } from "react";
import HorizontalTagsProducts from "../HorizontalTagsProducts";

const CatalogLayout = props => {

    const {
        catalogItems,
        currencyCode,
        isLoadingCatalogItems,
        pageInfo,
        pageSize,
        tags,
        setPageSize,
        setSortBy,
        sortBy,
    } = props;


    let products = (catalogItems || []).map((items) => items.node.product);

    (tags || []).map((e) => {
        let catalogProducts = [...products]
        return e.catalogProducts = catalogProducts.filter(element => element.tagIds[0] == e._id);
    });
    return (
        <Fragment>
            <HorizontalTagsProducts 
                tags={tags}
                currencyCode={currencyCode}
                isLoadingCatalogItems={isLoadingCatalogItems}
                pageInfo={pageInfo}
                pageSize={pageSize}
                setPageSize={setPageSize}
                setSortBy={setSortBy}
                sortBy={sortBy} 
                id = "catalog"
            />
        </Fragment>
    )


}

export default CatalogLayout;