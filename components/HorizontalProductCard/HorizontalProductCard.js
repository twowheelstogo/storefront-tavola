import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Typography, Grid, useMediaQuery } from "@material-ui/core"
import { withStyles, useTheme } from "@material-ui/core/styles";
import { withComponents } from "@reactioncommerce/components-context";
import Link from "components/Link";
import styled from "styled-components";

const ProductMediaWrapper = styled.div`
`;

const StyledTitle = styled.div`
font-size:18px;
font-weight:700;
color:#000000;
padding-left: 10px;
display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;
const StyledTitleVertical = styled.div`
font-size:18px;
font-weight:700;
color:#000000;
display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;
const StyledSubtitle = styled.div`
font-size:14px;
color:#979797;
padding-left: 10px;
display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

const StyledSubtitleVertical = styled.div`
font-size:14px;
color:#979797;
display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;

const CardContainerVertical = styled.div`
    border: ${({ withBorder, boderColor }) => withBorder ? boderColor : "none"};
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    &:hover:{
        background-color: #EEEEEE;
        transition: background-color .5s;
    }
`
const Div = styled.div``;

const CardContainerHorizontal = styled.div`
    border: ${({ withBorder, boderColor }) => withBorder ? boderColor : "none"};
    display: flex;
    height: 150px;
    cursor: pointer;
    &:hover {
        background-color: #EEEEEE;
        transition: background-color .5s;
    }
`

const ProductPaddingHorizontal = styled.div`
padding-left: 56px;
padding-bottom: 20px;
`;

const CardContent = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 5px;
flex: 1 1 auto;
`;

const styles = (theme) => ({
    imageProduct: {
        height: "100%",
        width: "150px",
        objectFit: "cover"
    },
    textPrice: {
        fontStyle: 'normal',
        fontWeight: 800,
        fontSize: '16px',
        lineHeight: '17px',
        display: "flex",
        justifyContent: "flex-end",
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '5px',
        flex: "1 1 auto",
    },
    titleWeb: {
        fontWeight: 800,
        fontSize: '24px',
        paddingTop: '40px',
        paddingBottom: '40px',
        color: '#000000'
    },
    titleMobil: {
        fontWeight: 800,
        fontSize: '24px',
        paddingTop: '40px',
        paddingBottom: '40px',
        paddingLeft: '7px',
        color: '#000000'
    },
    productPadding: {
        paddingLeft: '10px',
    },
    cardMobil: {
        paddingLeft: '7px',
        paddingRight: '7px',
        paddingBottom: '15px'
    },
    productPaddingHorizontaal: {
        paddingLeft: '56px',
        paddingBottom: '20px',
    },
    gridSpacing: {
        paddingRight: '30px',
        paddingBottom: '30px'
    }
})

const HorizontalProductCard = props => {
    // HorizontalProductCard.propTypes = {
    //     classes: PropTypes.object,
    //     currencyCode: PropTypes.string.isRequired,
    //     isLoadingCatalogItems: PropTypes.bool,
    //     pageInfo: PropTypes.shape({
    //         startCursor: PropTypes.string,
    //         endCursor: PropTypes.string,
    //         hasNextPage: PropTypes.bool,
    //         hasPreviousPage: PropTypes.bool,
    //         loadNextPage: PropTypes.func,
    //         loadPreviousPage: PropTypes.func
    //     }),
    //     pageSize: PropTypes.number.isRequired,
    //     setPageSize: PropTypes.func.isRequired,
    //     setSortBy: PropTypes.func.isRequired,
    //     sortBy: PropTypes.string.isRequired,
    //     tags: PropTypes.object,
    // };
    HorizontalProductCard.propTypes = {
        classes: PropTypes.object,
        currencyCode: PropTypes.bool,
        isLoadingCatalogItems: PropTypes.bool,
        pageInfo: PropTypes.bool,
        pageSize: PropTypes.bool,
        setPageSize: PropTypes.bool,
        setSortBy: PropTypes.bool,
        sortBy: PropTypes.bool,
        tags: PropTypes.object,
    };

    const { tags, classes, components: { ProgressiveImage } } = props
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <Fragment>
            {matches !== true ? (
                <ProductPaddingHorizontal >
                    {
                        tags.catalogProducts.length !== 0 && (
                            <Div>
                                <Typography className={classes.titleWeb}>
                                    {tags.displayTitle}
                                </Typography>
                                <Grid container direction="row">
                                    {
                                        tags.length !== 0 && (
                                            tags.catalogProducts.map((values) => (
                                                <Grid item xs={12} sm={6} md={4} lg={4} key={values._id} className={classes.gridSpacing}>
                                                    <Link
                                                        href={values.slug && "/product/[...slugOrId]"}
                                                        as={values.slug && `/product/${values.slug}`}
                                                    >
                                                        <CardContainerHorizontal withBorder boderColor={"2px solid rgba(151, 151, 151, 0.5)"}>
                                                            {
                                                                values.primaryImage !== null ? (
                                                                    <img src={values.primaryImage.URLs.medium} className={classes.imageProduct}></img>

                                                                ) : (
                                                                    <img src="/images/placeholder.gif" />
                                                                )
                                                            }
                                                            <CardContent>
                                                                <Div>
                                                                    <StyledTitle>{values.title}</StyledTitle>
                                                                    <StyledSubtitle>{values.description}</StyledSubtitle>
                                                                </Div>
                                                                <Div>
                                                                    <Typography className={classes.textPrice}>{values.pricing[0].displayPrice}</Typography>
                                                                </Div>
                                                            </CardContent>
                                                        </CardContainerHorizontal>
                                                    </Link>

                                                </Grid>
                                            ))
                                        )
                                    }
                                </Grid>

                            </Div>
                        )
                    }
                </ProductPaddingHorizontal>
            ) : (
                <Div>
                    {
                        <Div>
                            {
                                tags.catalogProducts.length !== 0 && (
                                    <Div>
                                        <Typography className={classes.titleMobil}>
                                            {tags.displayTitle}
                                        </Typography>
                                        <Grid container>
                                            {
                                                tags.catalogProducts.length !== 0 && (
                                                    tags.catalogProducts.map((values) => (
                                                        <Grid item xs={6} className={classes.cardMobil} key={values._id}>
                                                            <Link
                                                                href={values.slug && "/product/[...slugOrId]"}
                                                                as={values.slug && `/product/${values.slug}`}
                                                            >
                                                                <CardContainerVertical withBorder boderColor={"2px solid rgba(151, 151, 151, 0.5)"}>
                                                                    <ProductMediaWrapper>
                                                                        <ProgressiveImage
                                                                            fit={"cover"}
                                                                            altText={"description"}
                                                                            presrc={values.primaryImage !== null ? values.primaryImage.URLs.thumbnail : "/images/placeholder.gif"}
                                                                            srcs={values.primaryImage !== null ? values.primaryImage.URLs : "/images/placeholder.gif"}
                                                                        />
                                                                    </ProductMediaWrapper>
                                                                    <CardContent>
                                                                        <div>
                                                                            <StyledTitleVertical>{values.title}</StyledTitleVertical>
                                                                            <StyledSubtitleVertical>{values.description}</StyledSubtitleVertical>
                                                                        </div>
                                                                        <div>
                                                                            <Typography className={classes.textPrice}>{values.pricing[0].displayPrice}</Typography>
                                                                        </div>
                                                                    </CardContent>
                                                                </CardContainerVertical>
                                                            </Link>
                                                        </Grid>
                                                    ))
                                                )
                                            }
                                        </Grid>
                                    </Div>
                                )
                            }
                        </Div>
                    }
                </Div>
            )
            }
        </Fragment >
    )

}


export default withComponents(withStyles(styles)(HorizontalProductCard))