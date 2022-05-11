import React, {Fragment,Component} from "react";
import styled from "styled-components";
const Card = styled.div`
    border-radius: 14px;
    border: 1px solid #84C7D9;
    max-width: 250px;
    min-height: 86px;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    ${({selected})=> selected && `
        border: 1px solid #000000;
    `}
`;
const CardIcon = styled.div`
    max-width: 60px;
    height: auto;
`;
const CardTitle = styled.div`
    font-size: 14px;
    font-weight: 600;
    color: #565656;
`;
class CardItemSelect extends Component{
    selectCurrentOption=()=>{
    	const {onSelect,method} = this.props;
    	if(onSelect) onSelect(method);
    }
    render(){
    	const {method:{
    		icon,displayName
    	},selected,actionAlerts} = this.props;
        
    	return(
    		<Card selected={selected} onClick={this.selectCurrentOption}>
    			<CardIcon>
    				<img src={icon} height={30}/>
    			</CardIcon>  
    			<CardTitle>{displayName}</CardTitle>
    		</Card>
    	);
    } 
}
export default CardItemSelect;