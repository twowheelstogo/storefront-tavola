import { createContext, useState } from "react";
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
  // Custom
  const [selectedCartCatalogId, setPdpSelectedCartCatalogId] = useState(null);
  const [selectedCatalogs, setPdpSelectedCatalogs] = useState({});

  // Drawer
  const [catalogDrawerProduct, setPdpCatalogDrawerProduct] = useState(null);
  const [isDrawerProductOpen, togglePdpDrawerProduct] = useState(false);
  // const [SelectedOptions, setPdpSelectedOption] = useState({});

  // Custom Items
  // const [selectedItems, setPdpSelectedItems] = useState({});

  const openDrawerProduct = (opts) => {
    // const {cartCatalogId}
  };

  const toggleDrawerProduct = (_toggle) => {
    if (_toggle !== undefined && _toggle === isDrawerProductOpen) return;
    const toggle = _toggle || !isDrawerProductOpen;
    // if(toggle){ closeCart(); }
    togglePdpDrawerProduct(toggle);
  };
  const setCatalogDrawerProduct = (catalogId, openDrawer = true) => {
    if (catalogId) {
      setPdpCatalogDrawerProduct(catalogId);
    }
    if (openDrawer) {
      toggleDrawerProduct(true);
    }
  };

  const selectedCartCatalog = (def) => {
    const initCartCatalogId = def || selectedCartCatalogId;
    //
    if (!selectedCatalogs[initCartCatalogId]) {
      selectedCatalogs[initCartCatalogId] = { options: {}, qty: 1, xob: {} };
      setPdpSelectedCatalogs(selectedCatalogs);
    }
    if (selectedCartCatalogId !== initCartCatalogId) {
      console.info("selectedCartCatalog", selectedCartCatalogId, initCartCatalogId)
      setPdpSelectedCartCatalogId(initCartCatalogId);
    }
    return initCartCatalogId;
  };

  const updateSelectedCartCatalogs = (_SelectedCatalogs) => {
    const SelectedCatalogsFinal = _SelectedCatalogs || selectedCatalogs;
    for (const [cartCatalogId, catalog] of Object.entries(SelectedCatalogsFinal)) {
      for (const [variantId, options] of Object.entries(catalog.options)) {
        for (const [optionId, qty] of Object.entries(options)) {
          if (qty <= 0) delete options[optionId];
        }
        if (!Object.keys(options).length) delete catalog.options[variantId];
      }
      if (!Object.keys(catalog.options).length) delete SelectedCatalogsFinal[cartCatalogId];
    }
    setPdpSelectedCatalogs(SelectedCatalogsFinal);
  };

  const updateSelectedCartCatalog = (data={}) => {
    const id = selectedCartCatalog();
    selectedCatalogs[id].options = data;
    updateSelectedCartCatalogs(selectedCatalogs);
  };

  const SelectedOptions = (def) => {
    const id = selectedCartCatalog(def);
    return selectedCatalogs[id].options;
  };

  const setSelectedOption = (variantId, optionId) => {
    let res = SelectedOptions();
    if (!res[variantId]) res[variantId] = [];
    res[variantId][optionId] = (res[variantId][optionId] || 0) + 1;
    // setPdpSelectedOption(res);
    updateSelectedCartCatalog(res);
  };
  const setQtySelectedOption = (variantId, optionId, qty) => {
    let res = SelectedOptions();
    if (!res[variantId]) res[variantId] = [];
    res[variantId][optionId] = qty || 0;
    if (res[variantId][optionId] <= 0) delete res[variantId][optionId];
    if (!Object.keys(res[variantId])) delete res[variantId];
    // setPdpSelectedOption(res);
    updateSelectedCartCatalog(res);
    return SelectedOptions;
  };

  const unSetSelectedOption = (variantId, optionId) => {
    let res = SelectedOptions();
    if (res[variantId]) {
      // res[variantId] = res[variantId].filter((f) => f !== optionId);
      res[variantId][optionId] = (res[variantId][optionId] || 0) - 1;
      if (res[variantId][optionId] <= 0) delete res[variantId][optionId];
      if (!Object.keys(res[variantId])) delete res[variantId];
      // setPdpSelectedOption(res);
      updateSelectedCartCatalog(res);
    }
    return res;
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
        // Catalog
        selectedCartCatalogId,
        selectedCartCatalog,
        selectedCatalogs,
        updateSelectedCartCatalogs,
        updateSelectedCartCatalog,
        // Options
        SelectedOptions,
        setSelectedOption,
        setQtySelectedOption,
        unSetSelectedOption,
        // Drawer Product
        isDrawerProductOpen,
        toggleDrawerProduct,
        // Drawer Catalog
        catalogDrawerProduct,
        setCatalogDrawerProduct,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

UIProvider.propTypes = {
  children: PropTypes.node,
};
