 import ExampleIOUPaymentForm from "@reactioncommerce/components/ExampleIOUPaymentForm/v1";
 import StripeCard from "components/StripeCard"
 const paymentMethods = [
   {
     displayName: "IOU",
     InputComponent: ExampleIOUPaymentForm,
     name: "iou_example",
     shouldCollectBillingAddress: true
   },
   {
     displayName: "Credit Card (SCA)",
     InputComponent: StripeCard,
     name: "stripe_payment_intent",
     shouldCollectBillingAddress: true
   }
 ]
 export default paymentMethods;


// import ExampleIOUPaymentForm from "components/ExampleIOUPaymentForm";
// import EpayPaymentForm from "components/EpayPaymentForm";

// const cashIcon = "https://firebasestorage.googleapis.com/v0/b/twg-vehicle-dashboard.appspot.com/o/Iconos%2Fbillete_negro.png?alt=media&token=e371f5ba-fb08-4361-ba44-6537b6a08c52";
// //"https://firebasestorage.googleapis.com/v0/b/twg-vehicle-dashboard.appspot.com/o/Iconos%2Fbillete_blanco.png?alt=media&token=273e87b4-32bf-4d47-9b71-11829f4c10f8";
// //const epayIcon = "https://firebasestorage.googleapis.com/v0/b/twg-vehicle-dashboard.appspot.com/o/Iconos%2Fimageonline-co-transparentimage.png?alt=media&token=476244b3-1a99-4c8f-9ed1-ee12efe4fc22";
// const epayIcon = "https://firebasestorage.googleapis.com/v0/b/twowheelstogo-572d7.appspot.com/o/resources%2Fg3420.png?alt=media&token=d3858828-aa4b-4abe-b0e1-45efcbb91924";
// const paymentMethods = [	
// 	{
// 		displayName: "Efectivo",
// 		InputComponent: ExampleIOUPaymentForm,		
// 		name: "stripe_payment_intent",
// 		shouldCollectBillingAddress: true,
// 		icon: cashIcon
// 	},
// 	{
// 		displayName: "Tarjeta",
// 		InputComponent: EpayPaymentForm,
// 		name: "epay_card",
// 		shouldCollectBillingAddress: true,
// 		icon: epayIcon
// 	}
// ];

// export default paymentMethods;
