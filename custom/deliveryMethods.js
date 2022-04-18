import ShippingCheckoutAction from "components/ShippingCheckoutAction";
import PickupCheckoutAction from "components/PickupCheckoutAction";
const pickupImage = "https://firebasestorage.googleapis.com/v0/b/twg-vehicle-dashboard.appspot.com/o/Iconos%2Fimage.png?alt=media&token=f40d63a8-6a7c-4bd9-96ff-2d1c6f03f41b";
const shippingImage = "https://firebasestorage.googleapis.com/v0/b/twowheelstogo-572d7.appspot.com/o/resources%2Fg18.png?alt=media&token=29c5fc57-058f-4f45-a6de-bcb9708f4c13";
const deliveryMethods = [
	{
		id: 1,
		name: "shipping",
		InputComponent: ShippingCheckoutAction,
		displayName: "Delivery",
		icon: shippingImage,
		enabled: true
	},
	{
		id: 2,
		name: "pickup",
		InputComponent: PickupCheckoutAction,
		displayName: "Pickup",
		icon: pickupImage,
		enabled: true
	}
];
export default deliveryMethods;