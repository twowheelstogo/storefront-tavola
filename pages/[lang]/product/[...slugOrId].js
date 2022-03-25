import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { useRouter } from "next/router";
import Typography from "@material-ui/core/Typography";
import withCart from "containers/cart/withCart";
import ProductDetail from "components/ProductDetail";
import PageLoading from "components/PageLoading";
import Layout from "components/Layout";
import { withApollo } from "lib/apollo/withApollo";
import { locales } from "translations/config";
import fetchPrimaryShop from "staticUtils/shop/fetchPrimaryShop";
import fetchCatalogProduct from "staticUtils/catalog/fetchCatalogProduct";
import fetchAllTags from "staticUtils/tags/fetchAllTags";
import fetchTranslations from "staticUtils/translations/fetchTranslations";
import { withStyles } from "@material-ui/core/styles";
import inject from "hocs/inject";


/**
 *
 * @name buildJSONLd
 * @param {Object} product - The product
 * @param {Object} shop - The shop
 * @summary Builds a JSONLd object from product properties.
 * @return {String} Stringified product jsonld
 */

 const styles = (theme) => ({    
  main: {
    flex: "1 1 auto",
    maxWidth: theme.layout.mainContentMaxWidth,
    marginLeft: "auto",
    marginRight: "auto"
  },
  article: {
      ["@media (min-width:900px)"]: {
          padding: theme.spacing(3),
        },
        ["@media (max-width:899px)"]: {
          padding: theme.spacing(0)
        },      
  }
});

function buildJSONLd(product, shop) {
  if (!product || !shop) return "";

  const currencyCode = shop.currency.code || "USD";
  const priceData = product.pricing[0];
  const images = product.media.map((image) => image.URLs.original);

  let productAvailability = "http://schema.org/InStock";
  if (product.isLowQuantity) {
    productAvailability = "http://schema.org/LimitedAvailability";
  }
  if (product.isBackorder && product.isSoldOut) {
    productAvailability = "http://schema.org/PreOrder";
  }
  if (!product.isBackorder && product.isSoldOut) {
    productAvailability = "http://schema.org/SoldOut";
  }

  // Recommended data from https://developers.google.com/search/docs/data-types/product
  const productJSON = {
    "@context": "http://schema.org/",
    "@type": "Product",
    "brand": product.vendor,
    "description": product.description,
    "image": images,
    "name": product.title,
    "sku": product.sku,
    "offers": {
      "@type": "Offer",
      "priceCurrency": currencyCode,
      "price": priceData.minPrice,
      "availability": productAvailability,
      "seller": {
        "@type": "Organization",
        "name": shop.name
      }
    }
  };

  return JSON.stringify(productJSON);
}


/**
 * Layout for the product detail page
 *
 * @param {Function} addItemsToCart - function to call to add items to cart
 * @param {Object} product - the product
 * @param {Boolean} isLoadingProduct - loading indicator
 * @param {Object} shop - the shop this product belong to
 * @return {React.Component} The product detail page
 */
function ProductDetailPage({ addItemsToCart, product, isLoadingProduct, shop, routingStore, catalogItems}) {
  const router = useRouter();
  const currencyCode = (shop && shop.currency.code) || "USD";
  const JSONLd = useMemo(() => {
    if (product && shop) {
      return buildJSONLd(product, shop);
    }
    return null;
  }, [product, shop]);

  if (isLoadingProduct || router.isFallback) return <PageLoading />;
  if (!product || !shop) return <Typography>Producto no enconrado</Typography>;

  return (
    <Layout shop={shop}
    routerType={2}
    product={product}
    routerLabel={routingStore.tagId}
    catalogItems={catalogItems}
    >
      
      <Helmet
        title={`${product && product.title} | ${shop && shop.name}`}
        meta={[{ name: "description", content: product && product.description }]}
        script={[{ type: "application/ld+json", innerHTML: JSONLd }]}
      />
      <ProductDetail
        addItemsToCart={addItemsToCart}
        currencyCode={currencyCode}
        product={product}
        shop={shop}
      />
    </Layout>
  );
}

ProductDetailPage.propTypes = {
  /**
   * Function to add items to a cart, usually using the addItemsToCart from @withCart decorator.
   *
   * @example addItemsToCart(CartItemInput)
   * @type function
   */
  addItemsToCart: PropTypes.func,
  isLoadingProduct: PropTypes.bool,
  /**
   * Catalog Product item
   */
  product: PropTypes.object,
  shop: PropTypes.shape({
    name: PropTypes.string.isRequired,
    currency: PropTypes.shape({
      code: PropTypes.string.isRequired
    })
  }),
  routingStore: PropTypes.object.isRequired,
  catalogItems: PropTypes.array,
};

/**
 *  Static props for a product
 *
 * @returns {Object} the props
 */
export async function getStaticProps({ params: { slugOrId, lang } }) {
  const productSlug = slugOrId && slugOrId[0];
  const primaryShop = await fetchPrimaryShop(lang);

  if (!primaryShop?.shop) {
    return {
      props: {
        shop: null,
        translations: null,
        products: null,
        tags: null
      },
      // eslint-disable-next-line camelcase
      unstable_revalidate: 1 // Revalidate immediately
    };
  }

  return {
    props: {
      ...primaryShop,
      ...await fetchTranslations(lang, ["common", "productDetail"]),
      ...await fetchCatalogProduct(productSlug),
      ...await fetchAllTags(lang)
    },
    // eslint-disable-next-line camelcase
    unstable_revalidate: 120 // Revalidate each two minutes
  };
}

/**
 *  Static paths for a product
 *
 * @returns {Object} the paths
 */
export async function getStaticPaths() {
  return {
    paths: locales.map((locale) => ({ params: { lang: locale, slugOrId: ["-"] } })),
    fallback: true
  };
}

export default withApollo()(inject("routingStore", "catalogItems", "uiStore")(withCart(ProductDetailPage)));