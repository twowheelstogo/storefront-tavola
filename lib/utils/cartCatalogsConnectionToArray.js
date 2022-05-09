/**
 * @name cartCatalogsConnectionToArray
 * @summary Transform cart catalogs relay style connection into a simple array of objects with some additional transformations
 * @param {Object} cartCatalogsConnection Cart catalogs relay style connection
 * @param {Array.<Object>} catalogs.edges An array of edges
 * @returns {Array.<Object>} Returns an array of cart catalog objects
 */
export default function cartCatalogsConnectionToArray(cartCatalogsConnection) {
  // Return a blank array if you don't have good data to begin with
  if (!cartCatalogsConnection || !cartCatalogsConnection.edges) {
    return [];
  }

  // Make a copy to be able to mutate array if catalogs
  const cartCatalogs = [...cartCatalogsConnection.edges];

  return cartCatalogs.map(({ node }) => {
    // Make a copy to be able to mutate
    const catalog = { ...node };

    // Backwards compatibility until all component library components are updated
    // to accept `inventoryAvailableToSell`.
    catalog.currentQuantity = catalog.currentQuantity || catalog.inventoryAvailableToSell;

    return catalog;
  });
}
