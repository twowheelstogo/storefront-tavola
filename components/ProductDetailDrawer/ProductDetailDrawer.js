import React, { Fragment } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  SwipeableDrawer,
  List,
  Divider,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
} from "@material-ui/core";
import styled from "styled-components";
import { withStyles } from "@material-ui/core/styles";
import { withComponents } from "@reactioncommerce/components-context";
import ProductDetailAccordion from "components/ProductDetailAccordion";
import CancelIcon from '@material-ui/icons/Cancel';
const styles = (theme) => ({
  imageProduct: {
    width: "100%",
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

const useStyles = makeStyles({
  list: {
    width: 300,
  },
  fullList: {
    width: "auto",
  },
});

function ProductDetailDrawer({ values }) {
  const classes = useStyles();
  const [state, setState] = React.useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const DrawerViewList = ({ values }) => {
    return (
      <Fragment>
        <div role="presentation" style={{ width: 400, background: "white" }}>
          <div style={{ position: "relative" }}>
            {values.primaryImage !== null ? (
              <img
                src={values.primaryImage.URLs.medium}
                style={{ width: "100%" }}
                className={`${classes.imageProduct} db`}
              ></img>
            ) : (
              <img src="/images/placeholder.gif" />
            )}
            <IconButton
              size="small"
              style={{
                position: "absolute",
                width: 40,
                height: "auto",
                color: "#FFF",
                cursor: "select",
                top: 10,
                left: 10,
              }}
              onClick={toggleDrawer("right", false)}
            >
              <CancelIcon />
            </IconButton>
          </div>
          <Typography variant="h4" component="h2" style={{ padding: "20px 0px 0px 20px", fontSize: 30 }}>
            {values.title}
          </Typography>
          <Typography variant="h6" style={{ padding: "5px 0px 0px 20px", fontSize: 18 }}>
            {values.pricing[0].displayPrice}
          </Typography>
          <Typography variant="h6" style={{ padding: "10px 0px 0px 20px", color: "#979797", fontSize: 16 }}>
            {values.description}
          </Typography>
          <ProductDetailAccordion variant={values.variants}/>
        </div>
      </Fragment>
    );
  };

  return (
      <React.Fragment key={"right"}>
        <CardContainerHorizontal
          withBorder
          onClick={toggleDrawer("right", true)}
          boderColor={"2px solid rgba(151, 151, 151, 0.5)"}
        >
          {values.primaryImage !== null ? (
            <img src={values.primaryImage.URLs.medium} className={classes.imageProduct}></img>
          ) : (
            <img src="/images/placeholder.gif" />
          )}
          <CardContent>
            <Div>
              <StyledTitle>{values.title}</StyledTitle>
              <StyledSubtitle>{values.description}</StyledSubtitle>
            </Div>
            <Div>
              <Typography className={classes.textPrice}>{values.pricing[0].displayPrice}</Typography>
            </Div>
          </CardContent>
        </CardContainerHorizontal>
        <SwipeableDrawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
        >
          <DrawerViewList values={values} />
        </SwipeableDrawer>
      </React.Fragment>
  );
}

export default withComponents(withStyles(styles)(ProductDetailDrawer));
