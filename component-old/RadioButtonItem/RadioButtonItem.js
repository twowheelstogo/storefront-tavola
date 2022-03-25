import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {CustomPropTypes } from "@reactioncommerce/components/utils";
import Radio from "@material-ui/core/Radio";
const Item = styled.div`
    background: #F4F1F1;
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    padding: 5px;
    min-height: 50px;
    width: 100%;
    border-radius: 14px;
`;
const ItemLeading = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const ItemContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
`;
const ItemTrailing = styled.div`
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
`;
const ItemTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: black;
    display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;
const ItemSubtitle = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #565656;
    display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;
class RadioButtonItem extends React.Component{
    static propTypes = {
    	title: PropTypes.string,
    	description: PropTypes.string,
    	trailing: CustomPropTypes.component.isRequired,
    	isSelected: PropTypes.bool,
    	handleChange:PropTypes.func.isRequired,
    	components:PropTypes.shape({
    		CustomTrailing:CustomPropTypes.component
    	})
    }
    onChange = () =>{
    	const {handleChange,value} = this.props;
    	handleChange(value); 
    }
    render(){
    	const {
    		title,
    		description,
    		trailing,
    		handleChange,
    		id,
    		isSelected,
    		trailingProps,value
    	} = this.props;
    	return(
    		<Item>
    			<ItemLeading>
    				<Radio
    					checked={isSelected}
    					onChange={this.onChange}
    					value={value}
    					name="radio-button-demo"
    					inputProps={{ "aria-label": "A" }}
    				/>
    			</ItemLeading>
    			<ItemContent>
    				<ItemTitle>{title}</ItemTitle>
    				<ItemSubtitle>{description}</ItemSubtitle>
    			</ItemContent>
    			<ItemTrailing>
    				{React.cloneElement(trailing,{...trailingProps})}
    				{/* <CustomTrailing/> */}
    			</ItemTrailing>
    		</Item>
    	);
    }
}
export default RadioButtonItem;