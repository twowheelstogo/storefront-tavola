import React, { Fragment } from "react";
import Collapse from "rc-collapse";

//import { createTheme } from '@material'
const Panel = Collapse.Panel;

const ProductDetailAccordion = ({ variant }) => {
  console.info("variants", variant);

  return (
    <Fragment>
      {variant.length && 
        variant.map((e)=> (
          <Collapse accordion={true}>
          <Panel header={`${e.title}`} headerClass="my-header-class">
            {e.options && e.options.map((op)=> (
              <div>{op.title}</div>
            ))}
          </Panel>
        </Collapse>
        ))

      }
    </Fragment>
  );
};

export default ProductDetailAccordion;
