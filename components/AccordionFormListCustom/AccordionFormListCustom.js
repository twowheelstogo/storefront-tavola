import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { applyTheme, addTypographyStyles, CustomPropTypes } from "@reactioncommerce/components/utils";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import metas from "lib/utils/metas.js";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  label: {
    fontSize: theme.typography.pxToRem(12),
    letterSpacing: "0.03333em",
    lineHeight: 1.66,
    width:'100%'
  }
});

const AddNewItemAction = styled.div`
  box-sizing: border-box;
  color: inherit;
  overflow: hidden;
`;

const AddNewItemActionButton = styled.div`
  position: absolute;
  right: 0;
  ${addTypographyStyles("ActionButton", "labelText")};
  color: ${applyTheme("AccordionFormList.actionButtonColor")};
  cursor: pointer;
  display: table;
  &:hover {
    color: ${applyTheme("AccordionFormList.actionButtonHoverColor")};
    svg {
      color: inherit !important;
    }
  }
`;

const AddNewItemActionIcon = styled.span`
  color: inherit;
  height: ${applyTheme("AccordionFormList.actionButtonIconHeight")};
  margin: 0;
  margin-right: ${applyTheme("AccordionFormList.actionButtonIconMarginRight")};
  width: ${applyTheme("AccordionFormList.actionButtonIconWidth")};
  svg {
    color: ${applyTheme("AccordionFormList.actionButtonIconColor")};
    fill: currentColor;
    height: 1em;
    width: 1em;
    vertical-align: middle;
  }
`;

const FormActions = styled.div`
  display: flex;
  margin: 20px 0px;
  justify-content: flex-end;
  padding-bottom: ${applyTheme("AccordionFormList.actionPaddingBottom")};
  padding-left: ${applyTheme("AccordionFormList.actionPaddingLeft")};
  padding-right: ${applyTheme("AccordionFormList.actionPaddingRight")};
  padding-top: ${applyTheme("AccordionFormList.actionPaddingTop")};

  > div:last-of-type {
    margin-left: ${applyTheme("AccordionFormList.spaceBetweenActiveActionButtons")};
  }
`;

const FormActionDelete = styled.div`
  flex: 1 1 auto;
  > div {
    border: none;
    &:hover {
      background-color: transparent;
      color: ${applyTheme("AccordionFormList.actionDeleteButtonHoverColor")};
    }
  }
`;
const Container = styled.div`
  .MuiFormControlLabel-label{
    width:100%;
  }
`;

const ENTRY = "entry";
const LIST = "list";

class AccordionFormListCustom extends Component {
  static propTypes = {
    /**
     * Text to show on the button for adding a new item to the list
     */
    addNewItemButtonText: PropTypes.string,
    /**
     * The text for the "Cancel" text, if it is shown.
     */
    cancelButtonText: PropTypes.string,
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * If you've set up a components context using @reactioncommerce/components-context
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      /**
       * Pass either the Reaction Accordion component or your own component that
       * accepts compatible props.
       */
      Accordion: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction iconPlus component or your own component that
       * accepts compatible props.
       */
      iconPlus: PropTypes.node.isRequired,
      /**
       * The form component to render when adding a new item. It must have a
       * "submit" method on the instance or forward "ref" to a component that does.
       */
      ItemAddForm: CustomPropTypes.component.isRequired,
      /**
       * The form component to render when editing an item. It must have a
       * "submit" method on the instance or forward "ref" to a component that does.
       */
      ItemEditForm: CustomPropTypes.component.isRequired,
    }).isRequired,
    /**
     * Text to show on the button for deleting an item from the list
     */
    deleteItemButtonText: PropTypes.string,
    /**
     * Text to show on the button for submitting the new item entry form
     */
    entryFormSubmitButtonText: PropTypes.string,
    /**
     * Is some async operation happening? Puts buttons into waiting state
     */
    isWaiting: PropTypes.bool,
    /**
     * Arbitrary props to pass to ItemAddForm instance
     */
    itemAddFormProps: PropTypes.object,
    /**
     * The list of items to show accordion edit forms for
     */
    items: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Accordion detail
         */
        detail: PropTypes.string,
        /**
         * A unique ID
         */
        id: PropTypes.string.isRequired,
        /**
         * Arbitrary props to pass to ItemEditForm instance
         */
        itemEditFormProps: PropTypes.object,
        /**
         * Accordion label
         */
        label: PropTypes.string.isRequired,
      }),
    ),
    /**
     * Handles item deletion from list
     */
    onItemDeleted: PropTypes.func,
    /**
     * The text for the "Save" text, if it is shown.
     */
    saveButtonText: PropTypes.string,
  };

  static defaultProps = {
    addNewItemButtonText: "Add an item",
    deleteItemButtonText: "Delete this item",
    entryFormSubmitButtonText: "Add item",
    cancelButtonText: "Cancel",
    saveButtonText: "Save Changes",
    isWaiting: false,
    onItemDeleted() {},
  };

  state = {
    status: LIST,
  };

  _refs = {};

  //
  // Handler Methods
  //
  handleDeleteItem = (itemId) => {
    const { onItemDeleted } = this.props;
    onItemDeleted(itemId);
  };

  handleAddClick = () => {
    this.showEntryForm();
  };

  handleEntryFormCancel = () => {
    this.showList();
  };

  showEntryForm() {
    this.setState({ status: ENTRY });
  }

  showList() {
    this.setState({ status: LIST });
  }

  toggleAccordionForItem(itemId) {
    this._refs[`accordion_${itemId}`].toggle();
  }
  renderAccordion2(item) {
    const {
      addNewItemButtonText,
      cancelButtonText,
      components: { AccordionCustom, Button, iconPlus, ItemEditForm },
      deleteItemButtonText,
      isWaiting,
      items,
      saveButtonText,
      cart: { checkout: { fulfillmentGroups = [] } = {} } = {},
    } = this.props;
    const { detail, address, id, itemEditFormProps, label } = item;
    const meta = { title: label || "...", ...metas(address.metafields).res };
    
    return (
      <AccordionCustom
        {...this.props}
        id={id}
        label={meta.title}
        detail={detail}
        address={address}
        ref={(el) => {
          this._refs[`accordion_${id}`] = el;
        }}
      >
        <ItemEditForm
          {...itemEditFormProps}
          ref={(el) => {
            this._refs[`editForm_${id}`] = el;
          }}
        />
        <FormActions>
          <FormActionDelete>
            <Button
              actionType="secondaryDanger"
              isTextOnlyNoPadding
              isShortHeight
              onClick={() => {
                this.handleDeleteItem(id);
              }}
            >
              {deleteItemButtonText}
            </Button>
          </FormActionDelete>
          <Button
            actionType="secondary"
            isShortHeight
            onClick={() => {
              this.toggleAccordionForItem(id);
            }}
          >
            {cancelButtonText}
          </Button>
          <Button onClick={() => this._refs[`editForm_${id}`].submit()} isShortHeight isWaiting={isWaiting}>
            {saveButtonText}
          </Button>
        </FormActions>
      </AccordionCustom>
    );
  }

  //
  // Render Methods
  //
  renderAccordion() {
    const {
      addNewItemButtonText,
      cancelButtonText,
      components: { AccordionCustom, Button, iconPlus, ItemEditForm },
      deleteItemButtonText,
      isWaiting,
      items,
      saveButtonText,
      classes,
      cart: { checkout: { fulfillmentGroups = [] } = {} } = {},
    } = this.props;
    const shippingAddress = fulfillmentGroups.length ? fulfillmentGroups[0].shippingAddress || {} : {};
    console.info(classes)
    return (
      <FormControl
        component="fieldset"
        style={{
          display: "block",
          width: "100%",
        }}
      >
        <RadioGroup
          aria-label="shippingAddress"
          name="shippingAddress1"
          style={{ width: "100%" }}
          value={shippingAddress._id.trim()}
        >
          {items &&
            items.map((item) => (
              <Container>
                <FormControlLabel
                  style={{
                    border: "1px solid #F6F6F6",
                    borderRadius: "25px",
                    background: "#F6F6F6",
                    margin: "10px 10px",
                    width:'100%'
                  }}
                  value={item.id}
                  onClick={() => this.props.onSubmit(item.address)}
                  control={<Radio />}
                  label={<div style={{width:'100%'}}>{this.renderAccordion2(item)}</div>}
                  className={classes.label}
                />
              </Container>
            ))}
          {/* class="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1" */}
        </RadioGroup>
        <AddNewItemAction listCount={items && items.length} style={{ width: "100%" }}>
          <AddNewItemActionButton onClick={this.handleAddClick} tabIndex={0}>
            <AddNewItemActionIcon>{iconPlus}</AddNewItemActionIcon>
            {addNewItemButtonText}
          </AddNewItemActionButton>
        </AddNewItemAction>
      </FormControl>
    );
  }

  renderEntryForm() {
    const {
      cancelButtonText,
      components: { Button, ItemAddForm },
      entryFormSubmitButtonText,
      isWaiting,
      itemAddFormProps,
    } = this.props;
    return (
      <Fragment>
        <ItemAddForm
          {...itemAddFormProps}
          ref={(el) => {
            this._addItemForm = el;
          }}
        />
        <FormActions>
          <Button actionType="secondary" onClick={this.handleEntryFormCancel}>
            {cancelButtonText}
          </Button>
          <Button onClick={() => this._addItemForm.submit()} isWaiting={isWaiting}>
            {entryFormSubmitButtonText}
          </Button>
        </FormActions>
      </Fragment>
    );
  }

  render() {
    const { className } = this.props;
    const { status } = this.state;
    return <div className={className}>{status === LIST ? this.renderAccordion() : this.renderEntryForm()}</div>;
  }
}

export default withStyles(styles)(withComponents(AccordionFormListCustom));
