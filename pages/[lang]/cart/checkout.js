import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Router from "translations/i18nRouter";
import { useApolloClient } from "@apollo/client";
import Head from "next/head";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CartEmptyMessage from "components/CartEmptyMessage";
import { StripeProvider } from "react-stripe-elements";
import CheckoutActions from "components/CheckoutActions";
import CheckoutSummary from "components/CheckoutSummary";
import Layout from "components/Layout";
import PageLoading from "components/PageLoading";
import { withApollo } from "lib/apollo/withApollo";
import useCart from "hooks/cart/useCart";
import useStores from "hooks/useStores";
import useShop from "hooks/shop/useShop";
import useAvailablePaymentMethods from "hooks/availablePaymentMethods/useAvailablePaymentMethods";
// import useAddressValidation from "hooks/address/useAddressValidation";
import useTranslation from "hooks/useTranslation";
import definedPaymentMethods from "custom/paymentMethods";
import { locales } from "translations/config";
import fetchPrimaryShop from "staticUtils/shop/fetchPrimaryShop";
import fetchTranslations from "staticUtils/translations/fetchTranslations";

const useStyles = makeStyles((theme) => ({
  checkoutActions: {
    width: "100%",
    maxWidth: "1440px",
    alignSelf: "center",
    [theme.breakpoints.up("md")]: {
    }
  },
  cartSummary: {
    maxWidth: "400px",
    alignSelf: "flex-start",
    //backgroundColor: theme.palette.colors.CartSummary,
    backgroundColor: "#F6F6F6",    
    padding: '5px 10px'
  },
  checkoutContent: {
    flex: "1",
    maxWidth: theme.layout.mainContentMaxWidth,
    padding: "1rem",
    [theme.breakpoints.down("md")]: {
      maxWidth: "100%"
    },    
  },
  checkoutContentContainer: {
    display: "flex",
    justifyContent: "center",    
  },

  flexContainer: {
    display: "flex",
    flexDirection: "column"
  },
  emptyCartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  emptyCart: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 320,
    height: 320
  },
  logo: {
    color: theme.palette.reaction.reactionBlue,
    marginRight: theme.spacing(1),
    borderBottom: `solid 5px ${theme.palette.reaction.reactionBlue200}`
  },
  main: {
    flex: "1 1 auto",
    maxWidth: theme.layout.mainLoginMaxWidth,
    minHeight: "calc(100vh - 135px)",
    margin: "0 auto",
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px 0`,
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing(10)}px ${theme.spacing(3)}px 0`
    }
  },
  titleResume:{
    fontSize: '24px',
    fontWeight: 800,
    textAlign: 'center',
    color: theme.palette.primary.dark
  },
  Contenedor:{
    ["@media (max-width:599px)"]: {
    backgroundColor: "#202124"
    }
  },
  root: {},
  breadcrumbGrid: {		      
    padding: theme.spacing(1),  
    ["@media (min-width:960px)"]: {
      marginLeft: theme.spacing(2),
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
    },    
  }
}));

const Checkout = ({ router }) => {
  const classes = useStyles();
  const { cartStore } = useStores();
  const shop = useShop();
  const { locale, t } = useTranslation("common"); // eslint-disable-line no-unused-vars, id-length
  const apolloClient = useApolloClient();
  // TODO: implement address validation
  // const [addressValidation, addressValidationResults] = useAddressValidation();
  const [stripe, setStripe] = useState();

  const {
    cart,
    isLoadingCart,
    checkoutMutations,
    clearAuthenticatedUsersCart,
    hasMoreCartItems,
    loadMoreCartItems,
    onRemoveCartItems,
    onChangeCartItemsQuantity,
    
  } = useCart();

  const [availablePaymentMethods = [], isLoadingAvailablePaymentMethods] = useAvailablePaymentMethods();

  const { asPath } = router;
  const hasIdentity = !!((cart && cart.account !== null) || (cart && cart.email));
  const pageTitle = hasIdentity ? `Checkout | ${shop && shop.name}` : `Login | ${shop && shop.name}`;

  useEffect(() => {
    // Skipping if the `cart` is not available
    if (!cart) return;
    if (!hasIdentity) {
      Router.push("/cart/login");
    }
  }), [cart, hasIdentity, asPath, Router]; // eslint-disable-line no-sequences

  useEffect(() => {
    if (!stripe && process.env.STRIPE_PUBLIC_API_KEY && window && window.Stripe) {
      setStripe(window.Stripe(process.env.STRIPE_PUBLIC_API_KEY));
    }
  }), [stripe]; // eslint-disable-line no-sequences
  
  
  // eslint-disable-next-line react/no-multi-comp
  const renderCheckoutContent = () => {
    // sanity check that "tries" to render the correct /cart view if SSR doesn't provide the `cart`

    if (!cart) {
      return (
        <div className={classes.emptyCartContainer}>
          <div className={classes.emptyCart}>
            <div>
              <CartEmptyMessage onClick={() => Router.push("/")} messageText="Tu carro se encuentra vacío." buttonText="Ir a página principal" />
            </div>
          </div>
        </div>
      );
    }

    if (hasIdentity && cart) {
      if (cart && Array.isArray(cart.items) && cart.items.length === 0) {
        return (
          <div className={classes.emptyCartContainer}>
            <div className={classes.emptyCart}>
              <div>
                <CartEmptyMessage onClick={() => Router.push("/")} messageText="Tu carro se encuentra vacío." buttonText="Ir a la página principal" />
              </div>
            </div>
          </div>
        );
      }

      const orderEmailAddress = (cart && cart.account && Array.isArray(cart.account.emailRecords) &&
        cart.account.emailRecords[0].address) || (cart ? cart.email : null);

      // Filter the hard-coded definedPaymentMethods list from the client to remove any
      // payment methods that were not returned from the API as currently available.
      const paymentMethods = definedPaymentMethods.filter((method) =>
        !!availablePaymentMethods.find((availableMethod) => availableMethod.name === method.name));

      return (
        <StripeProvider stripe={stripe}>
          <div className={classes.checkoutContentContainer}>
            <div className={classes.checkoutContent}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5} className={classes.Contenedor} >
                  <div className={classes.flexContainer}>
                    <div className={classes.cartSummary}>                      
                      <CheckoutSummary
                        cart={cart}
                        hasMoreCartItems={hasMoreCartItems}
                        onRemoveCartItems={onRemoveCartItems}
                        onChangeCartItemsQuantity={onChangeCartItemsQuantity}
                        onLoadMoreCartItems={loadMoreCartItems}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={7}>
                  <div className={classes.flexContainer}>
                    <div className={classes.checkoutActions}>
                      <CheckoutActions
                        apolloClient={apolloClient}
                        cart={cart}
                        cartStore={cartStore}
                        checkoutMutations={checkoutMutations}
                        clearAuthenticatedUsersCart={clearAuthenticatedUsersCart}
                        orderEmailAddress={orderEmailAddress}
                        paymentMethods={paymentMethods}
                      />
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </StripeProvider>
      );
    }

    // Render nothing by default
    return null;
  };

  if (isLoadingCart || isLoadingAvailablePaymentMethods) {
    return (
      <Layout shop={shop}>
        <PageLoading delay={0} />
      </Layout>
    );
  }

  return (
    <Layout shop={shop}
      router={router}
      routerLabel={'Checkout page'}
      routerType={1}
    >           
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={shop && shop.description} />
      </Head>
      {renderCheckoutContent()}
    </Layout>
  );
};

Checkout.propTypes = {
  router: PropTypes.object,  
};

/**
 *  Static props for the cart
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
 *  Static paths for the cart
 *
 * @returns {Object} the paths
 */
export async function getStaticPaths() {
  return {
    paths: locales.map((locale) => ({ params: { lang: locale } })),
    fallback: false
  };
}

export default withApollo()(Checkout);