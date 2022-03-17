import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { applyTheme } from "@reactioncommerce/components/utils";
import { withStyles, useTheme } from "@material-ui/core/styles";

const CompleteActionWrapper = styled.div`
  padding-bottom: ${applyTheme("CheckoutActionComplete.paddingBottom")};
  padding-left: ${applyTheme("CheckoutActionComplete.paddingLeft")};
  padding-right: ${applyTheme("CheckoutActionComplete.paddingRight")};
  padding-top: ${applyTheme("CheckoutActionComplete.paddingTop")};
`;
const StyledTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ color }) => color};
`;
const styles = theme => ({
   root: {
   },
   main: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      "& .fSXXHe": {
         border: "1px solid #FFEB3B"
      },
      "& .iJMlmI": {
         border: "1px solid #fff"
      }
   }
});
const CheckoutAction = (props) => {
   const theme = useTheme();

   const { activeStepElement, activeLabel, stepNumber, classes } = props;
   const label = (activeStepElement.props && activeStepElement.props.label) || activeLabel;

   return (
      <React.Fragment>
         <StyledTitle color={theme.palette.primary.dark}>{`${label}`}</StyledTitle>
         <section className={classes.main}>
            {React.cloneElement(activeStepElement)}
         </section>
      </React.Fragment>
   );
}

CheckoutAction.propTypes = {
   /**
* Action label when active
*/
   activeLabel: PropTypes.string,
   /**
* The component to display if workflow status is `active`
*/
   activeStepElement: PropTypes.node.isRequired,
   /**
* You can provide a `className` prop that will be applied to the outermost DOM element
* rendered by this component. We do not recommend using this for styling purposes, but
* it can be useful as a selector in some situations.
*/
   className: PropTypes.string,
   /**
* Action label when completed
*/
   completeLabel: PropTypes.string,
   /**
* The component to display if workflow status is `complete`
*/
   completeStepElement: PropTypes.node.isRequired,
   /**
* Action label when incomplete
*/
   incompleteLabel: PropTypes.string,
   /**
* The component to display if workflow status is `incomplete`
*/
   incompleteStepElement: PropTypes.node.isRequired,
   /**
* Status of current checkout step
*/
   status: PropTypes.oneOf(["active", "complete", "incomplete"]).isRequired,
   /**
* Checkout process step number
*/
   stepNumber: PropTypes.number.isRequired
};

CheckoutAction.defaultProps = {
   activeLabel: "Active Step",
   completeLabel: "Completed Step",
   incompleteLabel: "Incomplete Step"
};

export default withStyles(styles)(CheckoutAction);