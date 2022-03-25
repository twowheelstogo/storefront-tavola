import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { CustomPropTypes } from "@reactioncommerce/components/utils";
import { withComponents } from "@reactioncommerce/components-context";
const Items = styled.div`
display: grid;
overflow-x: scroll;
gap: 15px;
grid-auto-flow: column;
justify-content: flex-start;
grid-auto-columns: minmax(180px,180px);
scrollbar-width: none;

`;
class CardItemList extends Component {
    static propTypes = {
        items: PropTypes.object.isRequired,
        onSelect: PropTypes.func,
        components: PropTypes.shape({
            CardItemSelect: CustomPropTypes.component
        }),
        itemSelected: PropTypes.object
    }
    render() {
        const { items, components: { CardItemSelect }, onSelect, itemSelected } = this.props;
        return (
            <Items>
                {items.map((item) =>
                    <CardItemSelect
                        method={item}
                        onSelect={onSelect}
                        selected={item.name == itemSelected.name} 
                    />
                )}
            </Items>
        );
    }
}
export default withComponents(CardItemList);