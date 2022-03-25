import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import PageLoading from "components/PageLoading";
import Layout from "components/Layout";
import withOrder from "containers/order/withOrder";
import OrderCard from "components/OrderCard";
import { withApollo } from "lib/apollo/withApollo";
import { locales } from "translations/config";
import fetchPrimaryShop from "staticUtils/shop/fetchPrimaryShop";
import fetchTranslations from "staticUtils/translations/fetchTranslations";

const styles = (theme) => ({
  orderThankYou: {
    marginBottom: theme.spacing(3)
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  breadcrumbGrid: {		      
    padding: theme.spacing(1),  
    ["@media (min-width:960px)"]: {
      marginLeft: theme.spacing(5),
    },
    ["@media (max-width:959px)"]: {
      marginLeft: theme.spacing(0)
    },    
    
    ["@media (min-width:600px)"]: {
      marginBottom: theme.spacing(0.5),
		marginTop: theme.spacing(0.5),  
    },
    ["@media (max-width:959px)"]: {      
		  marginTop: "-1px",  
    },          
	},
  page: {
    backgroundColor: "#202124",
    ["@media (min-width:600px)"]: {
      height: '43px',   
    },
    ["@media (max-width:599px)"]: {
      height: '33px',   
    },    		
	},
  Dividers:{
    ["@media (min-width:600px)"]: {
      height: '60px',   
    }, },

  TitleThancks:{
    ["@media (min-width:px)"]: {
      fontSize: '16px'
    },
    ["@media (min-width:600px)"]: {
      fontSize: '16px'
    },
  }
});

class CheckoutComplete extends Component {
  static propTypes = {
    classes: PropTypes.object,
    isLoadingOrder: PropTypes.bool,
    order: PropTypes.shape({
      email: PropTypes.string.isRequired,
      referenceId: PropTypes.string.isRequired
    }),
    shop: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    }),
    theme: PropTypes.object.isRequired,
    router: PropTypes.object, 
  };

  render() {
    const { classes, isLoadingOrder, order, shop, router } = this.props;    

    if (isLoadingOrder) {
      return (
        <Layout shop={shop}>
          <PageLoading message="Loading order details..." />
        </Layout>
      );
    }

    if (!order) {
      return (
        <Layout shop={shop}>
          <div className={classes.checkoutContentContainer}>
            <div className={classes.orderDetails}>
              <section className={classes.section}>
                <Typography className={classes.title} variant="h6">Order not found</Typography>
              </section>
            </div>
          </div>
        </Layout>
      );
    }

    return (
      <Layout shop={shop}
      router={router}
      routerLabel={'Single order page'}
      routerType={1}
      >                  

        <Helmet>
          <title>{shop && shop.name} | Checkout</title>
          <meta name="description" content={shop && shop.description} />
        </Helmet>
        <Grid container>
          <Grid item xs={false} md={3} /> {/* MUI grid doesn't have an offset. Use blank grid item instead. */}
          <Grid item xs={12} md={6}>
            <Grid item className={classes.orderThankYou} xs={12} md={12}>
              <Typography className={classes.TitleThancks}>GRACIAS POR TU COMPRA</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <OrderCard isExpanded={true} order={order} />
            </Grid>
          </Grid>
          <Grid item xs={false} md={3} /> {/* MUI grid doesn't have an offset. Use blank grid item instead. */}
        </Grid>
      </Layout>
    );
  }
}

/**
 *  Static props for an order
 *
 * @returns {Object} the props
 */
export async function getStaticProps({ params: { lang } }) {
  return {
    props: {
      ...await fetchPrimaryShop(lang),
      ...await fetchTranslations(lang, ["common"])
    }
  };
}

/**
 *  Static paths for an order
 *
 * @returns {Object} the props
 */
export async function getStaticPaths() {
  return {
    paths: locales.map((locale) => ({ params: { lang: locale } })),
    fallback: true
  };
}

export default withApollo()(withOrder(withStyles(styles, { withTheme: true })(CheckoutComplete)));