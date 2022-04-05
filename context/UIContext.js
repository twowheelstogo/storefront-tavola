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
  // const [SelectedOptions, setPdpSelectedOption] = useState({});

  const selectedCartCatalog = (cartCatalogId) => {
    const initCartCatalogId = cartCatalogId || selectedCartCatalogId;
    // 
    if (!selectedCatalogs[initCartCatalogId]) {
      selectedCatalogs[initCartCatalogId] = { options: {}, qty:1 };
      setPdpSelectedCatalogs(selectedCatalogs);
    }
    if(selectedCartCatalogId !== initCartCatalogId){
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

  const updateSelectedCartCatalog = (SelectedOptions) => {
    const selectedCartCatalogId = selectedCartCatalog();
    selectedCatalogs[selectedCartCatalogId].options = SelectedOptions;
    updateSelectedCartCatalogs(selectedCatalogs);
  };

  const SelectedOptions = () => {
    const selectedCartCatalogId = selectedCartCatalog();
    return selectedCatalogs[selectedCartCatalogId].options;
  };

  const setSelectedOption = (variantId, optionId) => {
    if (!SelectedOptions[variantId]) SelectedOptions[variantId] = [];
    SelectedOptions[variantId][optionId] = (SelectedOptions[variantId][optionId] || 0) + 1;
    // setPdpSelectedOption(SelectedOptions);
    updateSelectedCartCatalog(SelectedOptions);
  };
  const setQtySelectedOption = (variantId, optionId, qty) => {
    if (!SelectedOptions[variantId]) SelectedOptions[variantId] = [];
    SelectedOptions[variantId][optionId] = qty || 0;
    if (SelectedOptions[variantId][optionId] <= 0) delete SelectedOptions[variantId][optionId];
    if (!Object.keys(SelectedOptions[variantId])) delete SelectedOptions[variantId];
    // setPdpSelectedOption(SelectedOptions);
    updateSelectedCartCatalog(SelectedOptions);
  };

  const unSetSelectedOption = (variantId, optionId) => {
    if (SelectedOptions[variantId]) {
      // SelectedOptions[variantId] = SelectedOptions[variantId].filter((f) => f !== optionId);
      SelectedOptions[variantId][optionId] = (SelectedOptions[variantId][optionId] || 0) - 1;
      if (SelectedOptions[variantId][optionId] <= 0) delete SelectedOptions[variantId][optionId];
      if (!Object.keys(SelectedOptions[variantId])) delete SelectedOptions[variantId];
      // setPdpSelectedOption(SelectedOptions);
      updateSelectedCartCatalog(SelectedOptions);
    }
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
        selectedCartCatalog,
        selectedCatalogs,
        updateSelectedCartCatalogs,
        updateSelectedCartCatalog,
        // Options
        SelectedOptions,
        setSelectedOption,
        setQtySelectedOption,
        unSetSelectedOption,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

UIProvider.propTypes = {
  children: PropTypes.node,
};
