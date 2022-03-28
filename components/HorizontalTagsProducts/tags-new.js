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
        <Box p={3}>
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
}));

export default function ScrollSpyTabsNew({ tags, globalTags,uiStore }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(tags && tags[0]._id);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.info("global tags", globalTags);
  console.info("tags", tags);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
        >
          {tags &&
            tags.map((input) => (
              <Tab
                key={input._id}
                value={input._id}
                label={input.displayTitle}
              />
            ))}
        </Tabs>
      </AppBar>

      {tags &&
        tags.map((input) => (
          <TabPanel key={input._id} value={value} index={input._id}>
            {globalTags
              .filter((ntag) =>
                (ntag.metafields || []).find((f) =>
                  (f.value || "").split(",").includes(input.slug)
                )
              )
              .map((tag) => {
                console.log('tags en el tags',tag)
                const catalogProducts =
                  (globalTags.find((g) => g._id === tag._id) || {})
                    .catalogProducts || [];
                    console.log('catalog productos',catalogProducts)
                return (
                  <div>
                    <h1>{tag.displayTitle}</h1>
                    <div>
                      <HorizontalProductCard
                        catalogProducts={catalogProducts}
                        currencyCode
                        isLoadingCatalogItems
                        pageInfo
                        pageSize
                        setPageSize
                        setSortBy
                        sortBy
                        uiStore={uiStore}
                      />
                    </div>
                  </div>
                );
              })}
          </TabPanel>
        ))}
    </div>
  );


}
