import { createContext, useState, useEffect } from "react";

import PropTypes from "prop-types";
import { PAGE_SIZES, inPageSizes } from "lib/utils/pageSizes";

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [locales, setLocales] = useState({});
  const [orderStatusQuery, setOrderStatusQuery] = useState([]);
  const [orderQueryLimit, setOrderQueryLimit] = useState(5); // eslint-disable-line no-unused-vars
  const [pageSize, _setPageSize] = useState(PAGE_SIZES._20);
  const [pdpSelectedOptionId, setPdpSelectedOptionId] = useState(null);
  const [pdpSelectedVariantId, setPdpSelectedVariantId] = useState(null);
  const [sortBy, setSortBy] = useState("updatedAt-desc");
  const [sortByCurrencyCode, setSortByCurrencyCode] = useState("USD"); // eslint-disable-line no-unused-vars
  const [openCartTimeout, setOpenCartTimeout] = useState();
  const [entryModal, setEntryModal] = useState(null);

  // Detail
  let [_isCatalogOpen, setIsCatalogOpen] = useState(false);
  let [_catalogIds, catalogIdsStore] = useState({});
  let [_catalogId, catalogIdStore] = useState(null);
  // Qtys
  let [_quantities, sQuantitiesStore] = useState({});
  let [_cartCatalogId, cartCatalogIdStore] = useState(null);
  ///|\\\|///|\\\|///|\\\
  ///      Gets
  ///|\\\|///|\\\|///|\\\ 
  const isCatalogOpen = _isCatalogOpen;
  const catalogIds = _catalogIds;
  const catalogId = _catalogId;
  const quantities = _quantities;
  const cartCatalogId = _cartCatalogId;

  ///|\\\|///|\\\|///|\\\
  ///      Toggle
  ///|\\\|///|\\\|///|\\\
  const toggleCatalog = (opts = {}) => {
    const b = opts.open || !_isCatalogOpen;

    setIsCatalogOpen(b);

    const keys = Object.keys(opts);
    if (keys.includes("catalogId")) {
      setCatalogId(opts.catalogId);
    }
    if (keys.includes("cartCatalogId")) {
      setCartCatalogId(opts.cartCatalogId);
    }
    return b;
  };

  ///|\\\|///|\\\|///|\\\
  ///      Set Catalog
  ///|\\\|///|\\\|///|\\\
  const setCatalogId = (def) => {
    const id = def !== undefined ? def : _catalogId;
    if (_catalogId !== id) {
      catalogIdStore(id);
      _catalogId = id;
    }
    return id;
  };
  ///|\\\|///|\\\|///|\\\
  ///      Set Cart Catalog
  ///|\\\|///|\\\|///|\\\
  const setCartCatalogId = (def) => {
    const id = def !== undefined ? def : _cartCatalogId;
    //
    if (!_quantities[id]) {
      _quantities[id] = {};
      sQuantitiesStore(_quantities);
    }
    if (_cartCatalogId !== id) {
      cartCatalogIdStore(id);
      _cartCatalogId = id;
    }
    return id;
  };
  ///|\\\|///|\\\|///|\\\
  ///      Remove Cart Catalog
  ///|\\\|///|\\\|///|\\\
  const rCartCatalogId = (def) => {
    const id = def !== undefined ? def : _cartCatalogId;
    //
    if (_quantities[id]) {
      delete _quantities[id];
      sQuantitiesStore(_quantities);
    }
    if (_cartCatalogId === id) {
      cartCatalogIdStore(null);
      _cartCatalogId = null;
    }
    return id;
  };

  ///|\\\|///|\\\|///|\\\
  ///      Quantities
  ///|\\\|///|\\\|///|\\\
  const qtys = (def_id) => {
    const id = setCatalogId(def_id);
    return _quantities[id];
  };
  const setQtys = (opts = {}) => {
    const id = setCatalogId(def_id);
    let qtys = opts.qtys || _quantities[id];
    // by key
    if (opts.qty && opts.key) qtys[opts.key] = opts.qty || 0;
    if (opts.autoClean !== false || opts.autoDelete) {
      for (const [id, qty] of Object.entries(qtys)) if (qty <= 0) delete qtys[opts.key];
    }
    if (opts.autoDelete && !Object.values(qtys).length) {
      delete _quantities[id];
    }
    _quantities = { ..._quantities, [id]: qtys };
    sQuantitiesStore(_quantities);
    return { id, qtys, qty: qtys[opts.key], opts, quantities: _quantities };
  };

  const setPDPSelectedVariantId = (variantId, optionId) => {
    setPdpSelectedVariantId(variantId);
    setPdpSelectedOptionId(optionId);
  };

  const clearOpenCartTimeout = () => {
    openCartTimeout && clearTimeout(openCartTimeout);
  };

  const openCart = () => {
    setIsCartOpen(true);
    clearOpenCartTimeout();
  };

  const closeCart = (delay = 500) => {
    const newTimeout = setTimeout(() => {
      setIsCartOpen(false);
      clearOpenCartTimeout();
    }, delay);
    setOpenCartTimeout(newTimeout);
  };

  const openCartWithTimeout = (delay = 3000) => {
    openCart();

    const newTimeout = setTimeout(() => {
      setIsCartOpen(false);
      clearOpenCartTimeout();
    }, delay);

    setOpenCartTimeout(newTimeout);
  };

  const toggleCartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeMenuDrawer = () => {
    setIsMenuDrawerOpen(false);
  };

  const toggleMenuDrawerOpen = () => {
    setIsMenuDrawerOpen(!isMenuDrawerOpen);
  };

  const setOrderStatusSelectValue = (orderStatus) => {
    setOrderStatusQuery(orderStatus);
  };

  const setPageSize = (size) => {
    // Validate page size
    _setPageSize(inPageSizes(size) ? size : PAGE_SIZES._20);
  };

  return (
    <UIContext.Provider
      value={{
        isCartOpen,
        isMenuDrawerOpen,
        language,
        locales,
        orderStatusQuery,
        orderQueryLimit,
        pageSize,
        pdpSelectedOptionId,
        pdpSelectedVariantId,
        sortBy,
        sortByCurrencyCode,
        entryModal,
        setLocales,
        setPDPSelectedVariantId,
        setLanguage,
        openCart,
        closeCart,
        openCartWithTimeout,
        toggleCartOpen,
        closeMenuDrawer,
        toggleMenuDrawerOpen,
        setOrderStatusSelectValue,
        setPageSize,
        setSortBy,
        setEntryModal,
        // Custom
        isCatalogOpen,
        catalogIds,
        catalogId,
        quantities,
        cartCatalogId,
        toggleCatalog,
        setCatalogId,
        setCartCatalogId,
        rCartCatalogId,
        qtys,
        setQtys,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

UIProvider.propTypes = {
  children: PropTypes.node,
};
