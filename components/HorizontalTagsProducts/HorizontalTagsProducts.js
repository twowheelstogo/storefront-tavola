import React from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
/* import ScrollSpyTabs from "./tags"; */
import { withComponents } from "@reactioncommerce/components-context";
import Tags from "containers/tag/withTag.js";
import ScrollSpyTabsNew from "./tags-new";

const HorizontalTagsProducts = (props) => {
  const {
    tags,
    currencyCode,
    isLoadingCatalogItems,
    pageInfo,
    pageSize,
    setPageSize,
    setSortBy,
    components: { HorizontalProductCard },
    sortBy,
    uiStore
  } = props;
  const categoryProducts = (tags || []).map((items) => items);
/*   console.log(categoryProducts ) */
  if (categoryProducts.length === 0)
    return (
      <Grid container justifyContent="center" alignContent="center">
        <Grid>
          <h1> NO EXISTEN NINGUN PRODUCTO EN LA TIENDA </h1>
        </Grid>
      </Grid>
    );
  return (
    <div
      style={{
        fontFamily: "roboto, sans-serif",
        fontSize: 15,
        backgroundColor: "#fff",
      }}
    >
     {
       tags ? (
        <Tags group="menu">
        {({ tags: tagsMenu }) => {
          return tagsMenu && tagsMenu.length ? (
           <ScrollSpyTabsNew {...props}  tags={tagsMenu} globalTags={tags}  />
          ) : (
            <div>NO HAY CATEGORIAS</div>
          );
        }}
      </Tags>
       ):(
         "no existen tags"
       )
     }
    </div>
  );
};

export default withComponents(HorizontalTagsProducts);
