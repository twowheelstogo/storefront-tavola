import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Typography, Grid, useMediaQuery } from "@material-ui/core";
import { withStyles, useTheme } from "@material-ui/core/styles";
import { withComponents } from "@reactioncommerce/components-context";
import Link from "components/Link";
import {
  CardContent,
  ProductPaddingHorizontal,
  Div,
  CardContainerVertical,
  StyledSubtitleVertical,
  StyledSubtitle,
  StyledTitleVertical,
  ProductMediaWrapper,
  StyledTitle,
  CardContainerHorizontal,
} from "./HorizontalProductStyle";

const styles = (theme) => ({
  imageProduct: {
    height: "100%",
    width: "180px",
    objectFit: "cover",
  },
  textPrice: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "16px",
    lineHeight: "17px",
    display: "flex",
    justifyContent: "flex-end",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "5px",
    flex: "1 1 auto",
  },
  titleWeb: {
    fontWeight: 800,
    fontSize: "24px",
    paddingTop: "40px",
    paddingBottom: "40px",
    color: "#000000",
  },
  titleMobil: {
    fontWeight: 800,
    fontSize: "24px",
    paddingTop: "40px",
    paddingBottom: "40px",
    paddingLeft: "7px",
    color: "#000000",
  },
  productPadding: {
    paddingLeft: "10px",
  },
  cardMobil: {
    paddingLeft: "7px",
    paddingRight: "7px",
    paddingBottom: "15px",
  },
  productPaddingHorizontaal: {
    paddingLeft: "56px",
    paddingBottom: "20px",
  },
  gridSpacing: {
    paddingRight: "30px",
    paddingBottom: "30px",
  },
});

const HorizontalProductCard = (props) => {
  HorizontalProductCard.propTypes = {
    classes: PropTypes.object,
    currencyCode: PropTypes.bool,
    isLoadingCatalogItems: PropTypes.bool,
    pageInfo: PropTypes.bool,
    pageSize: PropTypes.bool,
    setPageSize: PropTypes.bool,
    setSortBy: PropTypes.bool,
    sortBy: PropTypes.bool,
    catalogProducts: PropTypes.array,
  };
  const {
    catalogProducts,
    classes,
    components: { ProgressiveImage },
    uiStore,
  } = props;
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xs"));
  return (
    <Fragment>
      {matches !== true ? (
        <ProductPaddingHorizontal>
          {catalogProducts.length !== 0 && (
            <Div>
              <Grid container direction="row">
                {catalogProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={product._id} className={classes.gridSpacing}>
                    <CardContainerHorizontal
                      withBorder
                      onClick={() => props.uiStore.toggleCatalog({ open: true, catalogId: product.productId })}
                      boderColor={"2px solid rgba(151, 151, 151, 0.5)"}
                    >
                      {product.primaryImage !== null ? (
                        <img src={product.primaryImage.URLs.medium} className={classes.imageProduct}></img>
                      ) : (
                        <img src="/images/placeholder.gif" />
                      )}
                      <CardContent>
                        <Div>
                          <StyledTitle>{product.title}</StyledTitle>
                          <StyledSubtitle>{product.description}</StyledSubtitle>
                        </Div>
                        <Div>
                          <Typography className={classes.textPrice}>
                            {/*     {(product.pricing[0] || "").displayPrice} */}
                          </Typography>
                        </Div>
                      </CardContent>
                    </CardContainerHorizontal>
                  </Grid>
                ))}
              </Grid>
            </Div>
          )}
        </ProductPaddingHorizontal>
      ) : (
        <Div>
          {
            <Div>
              {catalogProducts.length !== 0 && (
                <Div>
                  <Grid container>
                    {catalogProducts.map((values) => (
                      <Grid item xs={6} className={classes.cardMobil} key={values._id}>
                        <CardContainerVertical withBorder boderColor={"2px solid rgba(151, 151, 151, 0.5)"}>
                          <Link
                            href={values.slug && "/product/[...slugOrId]"}
                            as={values.slug && `/product/${values.slug}`}
                          >
                              <ProgressiveImage
                                fit={"container"}
                                altText={"description"}
                                presrc={
                                  values.primaryImage !== null
                                    ? values.primaryImage.URLs.thumbnail
                                    : "/images/placeholder.gif"
                                }
                                srcs={
                                  values.primaryImage !== null ? values.primaryImage.URLs : "/images/placeholder.gif"
                                }
                              />
                            <CardContent>
                                <StyledTitleVertical>{values.title}</StyledTitleVertical>
                                <StyledSubtitleVertical>{values.description}</StyledSubtitleVertical>
                                <Typography className={classes.textPrice}>
                                  {/* values.pricing[0].displayPrice */}
                                </Typography>
                            </CardContent>
                          </Link>
                        </CardContainerVertical>
                      </Grid>
                    ))}
                  </Grid>
                </Div>
              )}
            </Div>
          }
        </Div>
      )}
    </Fragment>
  );
};

export default withComponents(withStyles(styles)(HorizontalProductCard));
