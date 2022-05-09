import React,{Component} from "react";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
	root:{
		padding:theme.spacing(0)
	},
	image:{
		borderRadius: "10px"
	}
});
const Item = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    border-radius: 10px;
`;
const ItemBody = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
`;
const ItemActions = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const ItemLeading = styled.div`
    width: auto;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const ItemTrailing = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 0;
    margin-left: auto;
    width: 100px;
    align-items: flex-end;
`;
const ItemTitle = styled.div`
font-size:16px;
font-weight:700;
color:#000000;
`;
const ItemSubtitle = styled.div`
display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  font-size: 14px;
  font-weight:300;
  color: "#000000";
`;
const ItemContent = styled.div`
    width: 250px;
    padding-left: 5px;
    padding-right: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
class CheckoutCartItem extends Component{
	render(){
		const {classes,product,item: {
			attributes,
			compareAtPrice,
			currentQuantity,
			productSlug,
			productVendor,
			title,
			quantity,
			isLowQuantity,
			imageURLs,
			price: { displayAmount: displayPrice },
			subtotal
		}} = this.props;
		const { displayAmount: displaySubtotal } = subtotal || {};
		const hostname = (typeof window !== "undefined" && (window.location.hostname != "localhost" ? "https://api.lulisgt.com" : "http://localhost:3000")) || "https://api.lulisgt.com";
		const imageUrl = (imageURLs && `${hostname}${imageURLs && imageURLs.small}`) || `/images/placeholder.gif`;
		return(
			<React.Fragment>
				<Item className={classes.root}>
					<ItemBody>
						<ItemLeading>
							<img className={classes.image} src={imageUrl} width={60} height={60}></img>
						</ItemLeading>
						<ItemContent>
							<ItemTitle>{title}</ItemTitle>
							<ItemSubtitle>{`${quantity} x ${displayPrice}`}</ItemSubtitle>
						</ItemContent>
						<ItemTrailing>
							<ItemTitle>{displaySubtotal}</ItemTitle>
						</ItemTrailing>
					</ItemBody>
				</Item>
			</React.Fragment>
		);
	}
}
export default withStyles(styles)(CheckoutCartItem);