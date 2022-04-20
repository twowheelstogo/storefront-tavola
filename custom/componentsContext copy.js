/**
 * All Reaction Design System components are injected into the app from this single file.
 * This allows you to easily swap out one of the default components for your own, everywhere
 * in the app. It also allows you to take updates to the `@reactioncommerce/components` package
 * without worrying about it pulling in new component versions everywhere automatically. Instead,
 * you can switch from the `v1` import path to the `v2` import path, e.g., for a single component
 * when you're ready.
 *
 * You may also import your custom React components here and add them to the exported object.
 * They will then be available in the `components` property of all Reaction Design
 * System components, as well as any of your own components that you've wrapped
 * with the `withComponents` higher-order component.
 */
// 
/**
* * *  OPEN COMMERCE
*/
import iconAmericanExpress from "@reactioncommerce/components/svg/iconAmericanExpress";
import iconClear from "@reactioncommerce/components/svg/iconClear";
import iconDiscover from "@reactioncommerce/components/svg/iconDiscover";
import iconError from "@reactioncommerce/components/svg/iconError";
import iconExpand from "@reactioncommerce/components/svg/iconExpand";
import iconLock from "@reactioncommerce/components/svg/iconLock";
import iconPlus from "@reactioncommerce/components/svg/iconPlus";
import iconMastercard from "@reactioncommerce/components/svg/iconMastercard";
import iconValid from "@reactioncommerce/components/svg/iconValid";
import iconVisa from "@reactioncommerce/components/svg/iconVisa";
import spinner from "@reactioncommerce/components/svg/spinner";
import Accordion from "@reactioncommerce/components/Accordion/v1";
import AccordionFormList from "@reactioncommerce/components/AccordionFormList/v1";
import AddressBook from "@reactioncommerce/components/AddressBook/v1";
import Address from "@reactioncommerce/components/Address/v1";
import AddressCapture from "@reactioncommerce/components/AddressCapture/v1";
import AddressChoice from "@reactioncommerce/components/AddressChoice/v1";
 import AddressForm from "@reactioncommerce/components/AddressForm/v1";
import AddressCustomForm from "components/AddressForm";
import AddressReview from "@reactioncommerce/components/AddressReview/v1";
import BadgeOverlay from "@reactioncommerce/components/BadgeOverlay/v1";
// import Button from "@reactioncommerce/components/Button/v1";
// import CartItem from "@reactioncommerce/components/CartItem/v1";
// import CartItemDetail from "@reactioncommerce/components/CartItemDetail/v1";
/*  import CartItems from "@reactioncommerce/components/CartItems/v1"; */
// import CartSummary from "@reactioncommerce/components/CartSummary/v1";
import CatalogGrid from "@reactioncommerce/components/CatalogGrid/v1";
import Checkbox from "@reactioncommerce/components/Checkbox/v1";

import CheckoutActionIncomplete from "@reactioncommerce/components/CheckoutActionIncomplete/v1";
import ErrorsBlock from "@reactioncommerce/components/ErrorsBlock/v1";
// import Field from "@reactioncommerce/components/Field/v1";
import InPageMenuItem from "@reactioncommerce/components/InPageMenuItem/v1";
import InlineAlert from "@reactioncommerce/components/InlineAlert/v1";
import InventoryStatus from "@reactioncommerce/components/InventoryStatus/v1";
import MiniCartSummary from "@reactioncommerce/components/MiniCartSummary/v1";
import PhoneNumberInput from "@reactioncommerce/components/PhoneNumberInput/v1";
// import Price from "@reactioncommerce/components/Price/v1";
import ProfileImage from "@reactioncommerce/components/ProfileImage/v1";
import ProgressiveImage from "components/ProgressiveImage";
// import QuantityInput from "@reactioncommerce/components/QuantityInput/v1";
import RegionInput from "@reactioncommerce/components/RegionInput/v1";
import Select from "@reactioncommerce/components/Select/v1";
import SelectableItem from "@reactioncommerce/components/SelectableItem/v1";
import SelectableList from "@reactioncommerce/components/SelectableList/v1";
import StockWarning from "@reactioncommerce/components/StockWarning/v1";
import StripeForm from "@reactioncommerce/components/StripeForm/v1";
// import TextInput from "@reactioncommerce/components/TextInput/v1";
// import CartItemsList from "reactioncommerce/components/CartItems/v1";


/**
* * *  Custom
*/
import CatalogGridItem from "components/CatalogGridItem";
import CheckoutAction from "components/CheckoutAction";
import CartItems from "components/CartItems";
import CartItemSelect from "components/CartItemSelect";
import Link from "components/Link";
import withLocales from "../lib/utils/withLocales";
//new components for my
import HorizontalProductCard from "components/HorizontalProductCard";
import CatalogLayout from "components/CatalogLayout";
import HorizontalTagsProducts from "components/HorizontalTagsProducts";
import CartItem from "components/CartItem";
import CartSummary from "components/CartSummary";
import CartItemsList from "components/CartItemsList";
import QuantityInput from "components/QuantityInput";
import Price from "components/Price";
import CartItemDetail from "components/CartItemDetail";
import MiniCartComponent from "components/MiniCartComponent";
import IconsActions from "components/IconsActions";
import SearchBar from "components/SearchBar";
import SlideHero from "components/SlideHero";
import CustomFooter from "components/CustomFooter";
import NavigationHeader from "components/NavigationHeader";
import CartEmptyMessage from "components/CartEmptyMessage";
import Button from "components/Button";
import AddressList from "components/AddressList";
import RadioButtonItem from "components/RadioButtonItem";
import BillingForm from "components/BillingForm";
import TextInput from "components/TextInput";
import Field from "components/Field";
import PickupForm from "components/PickupForm";
import Breadcrumbs from "components/Breadcrumbs";
import BreadcrumbsSwitch from "components/BreadcrumbsSwitch";
import OrderDetails from "components/OrderDetails";
import ProductDetailDrawer from "components/ProductDetailDrawer";
import CartCatalogs from "components/CartCatalogs";
import CartCatalog from "components/CartCatalog";
import CartCatalogsList from "components/CartCatalogsList";


import CheckoutActionComplete from "@reactioncommerce/components/CheckoutActionComplete/v1";
// Providing locales data
const AddressFormWithLocales = withLocales(AddressForm);

export default {
  Accordion,
  AccordionFormList,
  AddressBook,
  Address,
  AddressCapture,
  AddressChoice,
  AddressForm: AddressFormWithLocales,
  AddressCustomForm,
  AddressReview,
  BadgeOverlay,
  Button,
  CartSummary,
  CatalogGrid,
  CatalogGridItem,
  Checkbox,
  CheckoutAction,
  CheckoutActionComplete,
  CheckoutActionIncomplete,
  ErrorsBlock,
  Field,
  InlineAlert,
  InventoryStatus,
  Link,
  iconAmericanExpress,
  iconClear,
  iconDiscover,
  iconError,
  iconExpand,
  iconLock,
  iconMastercard,
  iconPlus,
  iconValid,
  iconVisa,
  InPageMenuItem,
  MiniCartSummary,
  PhoneNumberInput,
  Price,
  ProfileImage,
  ProgressiveImage,
  QuantityInput,
  RegionInput,
  Select,
  spinner,
  SelectableItem,
  SelectableList,
  StockWarning,
  StripeForm,
  TextInput,
  //new components for my
  HorizontalProductCard,
  CatalogLayout,
  HorizontalTagsProducts,
  CartItem,
  CartItemsList,
  AddressList,
  RadioButtonItem,
  CartSummary,
  MiniCartComponent,
  NavigationHeader,
  IconsActions,
  SearchBar,
  SlideHero,
  CustomFooter,
  CartEmptyMessage,
  CartItems,
  CartItemSelect,
  BillingForm,
  PickupForm,
  Breadcrumbs,
  BreadcrumbsSwitch,
  OrderDetails,
  ProductDetailDrawer,
  CartItemDetail,
  CartCatalogs,
  CartCatalog,
  CartCatalogsList,
  TextInput
};
