import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

/**
 * Product detail description field
 * @class ProductDetailDescription
 */
class ProductDetailDescription extends Component {
  static propTypes = {
  	/**
     * Product description
     */
  	children: PropTypes.string,
	estilo: PropTypes.string
  }

  render() {
  	const { children , estilo, ...props } = this.props;

  	if (!children) return null;

  	return (
  		<Typography component="div" {...props} style={{ fontSize: estilo }}>{children}</Typography>
  	);
  }
}

export default ProductDetailDescription;