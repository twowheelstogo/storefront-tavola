import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import inject from "hocs/inject";
import { withStyles } from "@material-ui/core/styles";
import ChevronRight from "mdi-material-ui/ChevronRight";
import Link from "components/Link";
import SharedPropTypes from "lib/utils/SharedPropTypes";

const styles = (theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: '#F6F6F6',
    maxWidth: theme.layout.mainContentMaxWidth,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start"
    }
  },
  breadcrumbLink: {
    fontSize: "14px",
    fontFamily: theme.typography.fontFamily,
    color: "#000 !important",
    border: 0,
    textDecoration: "underline",
    margin: "0 7px"
  },
  breadcrumbLinkChild:{
    fontSize: "14px",
    fontFamily: theme.typography.fontFamily,
    color: "#979797 !important",
    border: 0,    
    margin: "0 7px"
  },
  breadcrumbIcon: {
    fontSize: "14px"
  }
});

class Breadcrumbs extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isPDP: PropTypes.bool,    
    path: PropTypes.string, 
    tagId: PropTypes.string   
  }
    
  renderProductNameBreadcrumb = () => {
    const { classes: { breadcrumbIcon, breadcrumbLinkChild }, path, tagId } = this.props;       
    const ruta = path === null ? '' : path.replace('/[lang]/','');
    return (
      <Fragment>
        <ChevronRight className={breadcrumbIcon} />
        <Link route={`/${ruta}`}><span className={breadcrumbLinkChild}        
        >{tagId}</span></Link>
      </Fragment>
    );
  }

  renderBreadcrumbs() {
    const { isPDP } = this.props;

    if (isPDP) {
      return this.renderProductNameBreadcrumb();
    }

    return null;
  }

  render() {
    const { classes: { container, breadcrumbLink } } = this.props;

    return (
      <div className={container}>
        <Link route="/"><span className={breadcrumbLink}>Home</span></Link>
        {this.renderBreadcrumbs()}
      </div>
    );
  }
}

export default withStyles(styles)(inject("tags")(Breadcrumbs));