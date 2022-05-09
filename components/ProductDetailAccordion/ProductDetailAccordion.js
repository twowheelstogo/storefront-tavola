import React, { Fragment } from "react";
import Collapse from "rc-collapse";
import { Button, RadioGroup, Radio, FormControlLabel, FormGroup, FormControl, Checkbox } from "@material-ui/core";
import ProductDetailAddToCart from "components/ProductDetailAddToCart";

const Panel = Collapse.Panel;

const ProductDetailAccordion = ({ variant }) => {

 /*  const [value, setValue] = React.useState(""); */

/*   const handleChange = (event) => {
    setValue(event.target.value);
  };
 */
  return (
    <Fragment>
      {variant.length &&
        variant.map((e) => (
          <Collapse accordion={true}>
            <Panel header={`${e.title}`} headerClass="my-header-class">
              {e.multipleOption ? (
                <div>
                  {e.options &&
                    e.options.map((op) => (
                      <FormControl component="fieldset">
                        <FormGroup>
                          <FormControlLabel control={<Checkbox name={op.title} />} label={op.title} />
                        </FormGroup>
                      </FormControl>
                    ))}
                </div>
              ) : (
                <div>
                  {e.options &&
                    e.options.map((op) => (
                      <FormControl component="fieldset">
                        <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                          <FormControlLabel value={op.title} control={<Radio />} label={op.title} />
                        </RadioGroup>
                      </FormControl>
                    ))}
                </div>
              )}
            </Panel>
          </Collapse>
        ))}
      <Button variant="container" style={{background: "#1D0D13",color:"white",position: "absolute", left: "15%", bottom: 20 }}>
        {" "}
        Añadir Al Carrito - {` price all cart`}
      </Button>
      <ProductDetailAddToCart/>
    </Fragment>
  );
};

export default ProductDetailAccordion;
