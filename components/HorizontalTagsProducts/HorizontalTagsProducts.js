import React from "react";
import styled from "styled-components";
import ScrollSpyTabs from "./tags";
import { withComponents } from "@reactioncommerce/components-context";
import Tags from "containers/tag/withTag.js"

const HorizontalTagsProducts = (props) => {
    const {
        tags,
        currencyCode,
        isLoadingCatalogItems,
        pageInfo,
        pageSize,
        setPageSize,
        setSortBy,
        components: {HorizontalProductCard},
        sortBy,
    } = props;
console.info("Default tags", tags);
    const categoryProducts = (tags || []).map((items) => items);
 if (categoryProducts.length === 0) return <h1>NO EXISTEN NINGUN PRODUCTO EN LA TIENDA</h1>
    return (
        <div
            style={{
                fontFamily: "roboto, sans-serif",
                fontSize: 15,
                backgroundColor: "#fff"
            }}
        >
            <Tags group="menu">
              {({ tags }) => {
                  console.info("Custom Tags", tags);
                  return tags && tags.length 
                   ? (

                    <ScrollSpyTabs
                        tabsInScroll={tags.map((e) => {

                                return {
                                    text:e.displayTitle,
                                    component: (
                                        <div>Hello</div>
                                    )
                                };
                        })}
                    />
                ) : (
                    <div>NO HAY CATEGORIAS</div>
                ) 
              }}
            </Tags>
            
        </div>
    )
};

export default withComponents(HorizontalTagsProducts);
{/* <HorizontalProductCard 
    tags={e}
    currencyCode
    isLoadingCatalogItems
    pageInfo
    pageSize
    setPageSize
    setSortBy
    sortBy 
/> */}