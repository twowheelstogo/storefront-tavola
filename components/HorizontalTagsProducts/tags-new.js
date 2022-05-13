import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tags from "containers/tag/withTag.js";
import HorizontalProductCard from "components/HorizontalProductCard"

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabStyle: {
    background: theme.palette.primary.dark,
    color: theme.palette.background.colorTabs
  }
}));

export default function ScrollSpyTabsNew(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.tags && props.tags[0]._id);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          className={classes.tabStyle}
          scrollButtons="auto"
          variant="scrollable"
          TabIndicatorProps={{
            style: { background: "#C88E2B"}
          }}
        >
          {props.tags &&
            props.tags.map((input) => (
              <Tab
                key={input._id}
                value={input._id}
                label={input.displayTitle}
              />
            ))}
        </Tabs>
      </AppBar>
      {props.tags &&
        props.tags.map((input) => (
          <TabPanel key={input._id} value={value} index={input._id}>
            {props.globalTags
              .filter((ntag) =>
                (ntag.metafields || []).find((f) =>
                  (f.value || "").split(",").includes(input.slug)
                )
              )
              .map((tag) => {
                const catalogProducts =
                  (props.globalTags.find((g) => g._id === tag._id) || {})
                    .catalogProducts || [];
                return (
                  <div>
                    <h1>{tag.displayTitle}</h1>
                      <HorizontalProductCard
                        {...props}
                        catalogProducts={catalogProducts}
                        isLoadingCatalogItems
                        pageInfo
                        pageSize
                        setPageSize
                        setSortBy
                        sortBy
                      />
                  </div>
                );
              })}
          </TabPanel>
        ))}
    </div>
  );
}
