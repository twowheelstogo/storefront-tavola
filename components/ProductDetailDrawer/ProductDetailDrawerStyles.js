import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
const widthDrawer = 300;
const styles = (theme) => ({
  container: { minHeight: "100%", position: "relative" },
  loader: {
    ...theme.mixin.fit,
    backgroundColor: "#ffffffde",
    "& > div": { height: "100vh" },
  },
  loaderSaving: { position: "fixed", },
  // centerSomething:{
  //   // ...theme.mixin.customFunction("red")
  // },
  imageProduct: {
    width: "100%",
    zIndex: 1,
    position: "relative"
  },
  imgLoader:{
    ...theme.mixin.fit,
    opacity: 0.3,
    "& > div": { height: "100%" },
  },
  textPrice: {
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "16px",
    lineHeight: "17px",
    display: "flex",
    justifyContent: "flex-end",
  },

  drawerOpen: {
    backgroundColor: "red",
  },

  drawerclose: {
    backgroundColor: "yellow",
  },
  optionForm: {
    paddingLeft: 0,
    "& .MuiFormControlLabel-label": {
      width: "100%",
    },
  },
});

const useStyles = makeStyles({
  list: {
    width: widthDrawer,
  },
  fullList: {
    width: "auto",
  },
});

const StyledTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  padding-left: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardContainerHorizontal = styled.div`
  border: ${({ withBorder, boderColor }) => (withBorder ? boderColor : "none")};
  display: flex;
  height: 150px;
  cursor: pointer;
  &:hover {
    background-color: #eeeeee;
    transition: background-color 0.5s;
  }
`;

const StyledSubtitle = styled.div`
  font-size: 14px;
  color: #979797;
  padding-left: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Div = styled.div``;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
  flex: 1 1 auto;
`;

export { StyledSubtitle, StyledTitle, CardContainerHorizontal, CardContent, Div, styles, useStyles };
