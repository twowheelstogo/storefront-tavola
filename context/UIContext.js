import { createContext, useState, useEffect } from "react";

import PropTypes from "prop-types";
import { PAGE_SIZES, inPageSizes } from "lib/utils/pageSizes";
import Random from "@idigi/random";

const ROOT_CART_CATALOG = "_";

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

    opts.oldCatalogId = opts.oldCatalogId || _catalogId;
    opts.oldCartCatalogId = opts.oldCartCatalogId || _cartCatalogId;
    ///|\\\|///|\\\|///|\\\
    ///      Cart
    ///|\\\|///|\\\|///|\\\
    if (opts.cart) {
      initCartCatalog(opts);
    }
    ///|\\\|///|\\\|///|\\\
    ///      CatalogId
    ///|\\\|///|\\\|///|\\\
    if (Object.keys(opts).includes("catalogId")) {
      setCatalogId(opts.catalogId);
      if (_catalogId && !opts.cartCatalogId) {
        opts.cartCatalogId = setCatalogIds(opts);
      } else if (!_catalogId && !opts.cartCatalogId) {
        if (
          _catalogIds[opts.oldCatalogId] &&
          _catalogIds[opts.oldCatalogId] === _cartCatalogId &&
          !process.env.PRODUCT_DETAIL_PRESIST
        ) {
          rCatalogIds({ ...opts, catalogId: opts.oldCatalogId });
        } else if (!_catalogIds[opts.oldCatalogId]) {
          rCartCatalogId({ ...opts, cartCatalogId: opts.oldCartCatalogId });
        }
        opts.cartCatalogId = null;
      }
    }
    ///|\\\|///|\\\|///|\\\
    ///      CartCatalogId
    ///|\\\|///|\\\|///|\\\
    if (Object.keys(opts).includes("cartCatalogId")) {
      setCartCatalogId(opts.cartCatalogId);
    }

    return b;
  };

  ///|\\\|///|\\\|///|\\\
  ///      InitFrom
  ///|\\\|///|\\\|///|\\\
  const initCartCatalog = (opts) => {
    if (opts.cartCatalog && opts.cart) {
      const id = opts.cartCatalog._id;
      _quantities[id] = { [ROOT_CART_CATALOG]: opts.cartCatalog.quantity || 1 };
      for (const item of opts.cart.items || []) {
        if (item.cartCatalogId === id) {
          let variantParentId = "";
          if (((item.pricex || {}).variant || {})._id) {
            variantParentId = `${item.pricex.variant._id}::`;
          }
          let key = `${variantParentId}${item.productConfiguration.productVariantId}`;
          _quantities[id][key] = item.quantity || 0;
        }
      }
      opts.catalogId =   opts.cartCatalog.productId;
      opts.cartCatalogId =  id;
      closeCart();
    }
  };
  ///|\\\|///|\\\|///|\\\
  ///      After Saved
  ///|\\\|///|\\\|///|\\\
  const afterSaved = (opts = {}) => {
    opts.catalogId = opts.catalogId || _catalogId;
    opts.cartCatalogId = opts.cartCatalogId || _cartCatalogId;
    toggleCatalog({ open: false, ...opts });
    openCart();
  };

  ///|\\\|///|\\\|///|\\\
  ///      CatalogIds
  ///|\\\|///|\\\|///|\\\
  const setCatalogIds = (opts) => {
    if (!_catalogIds[opts.catalogId]) {
      _catalogIds[opts.catalogId] = Random.id();
      catalogIdsStore(_catalogIds);
    }
    return _catalogIds[opts.catalogId];
  };
  const rCatalogIds = (opts) => {
    if (_catalogIds[opts.catalogId]) {
      delete _catalogIds[opts.catalogId];
      catalogIdsStore(_catalogIds);
      rCartCatalogId(opts.catalogId);
    }
    return opts.catalogId;
  };
  const initCatalogIds = (opts) => {
    if (_catalogIds[opts.catalogId]) {
      delete _catalogIds[opts.catalogId];
      catalogIdsStore(_catalogIds);
      rCartCatalogId(opts.catalogId);
    }
    return opts.catalogId;
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
    if (id && !_quantities[id]) {
      _quantities[id] = { [ROOT_CART_CATALOG]: 1 };
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
    const id = setCartCatalogId(def_id);
    return _quantities[id];
  };
  const qtyx = (def_id) => {
    const res = {};
    for (const [key, qty] of Object.entries(qtys(def_id))) {
      const [variantId, optionId] = key.split("::");
      if (optionId) {
        if (!res[variantId]) res[variantId] = {};
        res[variantId][optionId] = qty;
      }
    }
    return res;
  };
  const setQtys = (opts = {}) => {
    const id = setCartCatalogId(opts.cartCatalogId);
    let res = opts.qtys || _quantities[id];
    // by key
    if (opts.qty !== undefined) {
      opts.key = opts.key || `${opts.variantId || ""}${opts.optionId ? `::${opts.optionId}` : ""}`;
      if (opts.key.trim() !== "") res[opts.key] = opts.qty || 0;
    }
    if (opts.autoClean !== false || opts.autoDelete) {
      for (const [id, qty] of Object.entries(res)) if (qty <= 0) delete res[opts.key];
    }
    if (opts.autoDelete && !Object.values(res).length) {
      delete _quantities[id];
    }
    _quantities = { ..._quantities, [id]: res };
    sQuantitiesStore(_quantities);
    return { id, qtys: res, qty: res[opts.key], opts, quantities: _quantities };
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
        initCartCatalog,
        afterSaved,
        setCatalogIds,
        rCatalogIds,
        initCatalogIds,
        setCatalogId,
        setCartCatalogId,
        rCartCatalogId,
        qtys,
        qtyx,
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
