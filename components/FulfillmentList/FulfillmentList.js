import React from "react";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import PropTypes from "prop-types";
import { CustomPropTypes } from "@reactioncommerce/components/utils";

const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: flex-start;
  align-items: flex-end;
`;
const ItemSubtitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #565656;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
class FulfillmentList extends React.Component {
	static propTypes = {
		items: PropTypes.object.isRequired,
		components: PropTypes.shape({
			RadioButtonItem: CustomPropTypes.component.isRequired,
		}),
	};
	render() {
		const {
			components: { RadioButtonItem },
			items,
			selectedItem,
			handleChange,
		} = this.props;
		// let tmpItems = (items) ? items : [];
		// console.info("FulfillmentList ---->",this.props)
		// if(selectedItem){
		// 	tmpItems = tmpItems.filter((el) => el.id == selectedItem._id);
		// }else if (selectedItem == null){
		// 	tmpItems = [];
		// }

		return (
			<Items>
				{(items || []).map(({ label, detail, id, destination }) => (
					<RadioButtonItem
						methSend="methSend"
						description={label}
						value={{ label, detail, id, destination }}
						isSelected={selectedItem && selectedItem._id === id}
						handleChange={handleChange}
						trailing={
							<React.Fragment>
								{destination.distance ? (
									<div style={{display:'inline'}}>
										<h1 >
											{`${ (destination.distance / 1000).toFixed(2) }km `}  
										</h1>
									</div>
								) : (
									""
								)}
								{/* <ItemSubtitle>{detail}</ItemSubtitle> */}
							</React.Fragment>
						}
						priceDestination={
							<React.Fragment>
								{detail ? (
									<h1>
										{(detail||0)}
									</h1>

								) : (
									""
								)}
								{/* <ItemSubtitle>{detail}</ItemSubtitle> */}
							</React.Fragment>
						}
					/>
				))}
			</Items>
		);
	}
}
export default withComponents(FulfillmentList);
