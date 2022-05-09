import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styled from "styled-components";
// import ArrowIcon from "@material-ui/icons/ArrowForwardIos";
import {IconButton} from "@material-ui/core";
const CustomSubtitle=styled.div`
font-size:13px;
font-weight:300;
display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
`;
const styles = (theme) => ({
	root:{
		width:"100%",
		height:"120px",
		background:theme.palette.primary.dark,
		color:"white",
		borderRadius:"16px",
		paddingLeft:theme.spacing(2),
		paddingRight:theme.spacing(2),
		// paddingTop:theme.spacing(3),
		// paddingBottom:theme.spacing(3),
		display:"flex",
		flexDirection:"row",
		justifyContent:"space-between",
		alignItems:"center",
		cursor:"pointer"
	},
	leading:{
	},
	trailing:{
		// background:'red',
		alignItems:"center",
		color:"white",
	},
	title:{
		fontSize:"21px",
		fontWeight:600
	}
});
const RoundedButton = props => {
	const {classes,onClick,buttonTitle,buttonSubtitle, disabled} = props;
	return(
		<React.Fragment>
			<div className={classes.root} onClick={onClick}>
				<div className={classes.leading}>
					<div className={classes.title}>
						{buttonTitle}
					</div>
					<CustomSubtitle>{buttonSubtitle}</CustomSubtitle>
				</div>
				<div className={classes.trailing}>
					<IconButton style={{color:"white"}} onClick={onClick} disabled={disabled}>
						{"icono"}
					</IconButton>
				</div>
			</div>
		</React.Fragment>
	);
};

export default withStyles(styles)(RoundedButton);