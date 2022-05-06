import React, { Component, useState } from "react";
import { withComponents } from "@reactioncommerce/components-context";
import styled from "styled-components";
import { Menu, MenuItem, IconButton } from "@material-ui/core";
import metas from "lib/utils/metas";
/* import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add"; */
const Items = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: flex-start;
  align-items: flex-end;
`;
const CustomRoundedButton = styled.div`
  width: auto;
  text-align: center;
  min-height: 34px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
  background: #f4f1f1;
  border-radius: 14px;
  padding-left: 10px;
  padding-right: 10px;
  color: black;
  cursor: pointer;
  &:hover {
    color: white;
    background: #dcdcdc;
  }
`;
const CustomButtonText = styled.div`
  font-size: 16px;
  font-height: 400;
`;
const Controls = (props) => {
  const { id, onAddressDeleted } = props;
  const [state, setState] = useState({
    menuOpen: null,
  });
  const handleOpen = (event) => {
    setState({
      menuOpen: event.currentTarget,
    });
  };
  const handleClose = () => {
    setState({
      menuOpen: null,
    });
  };
  const editAddress = () => {
    let href = window.location.href;
    window.location.href = `${origin}/en/address?addressBookId=${id}&redirect=${encodeURIComponent(href)}`;
  };
  const handleDelete = () => {
    handleClose();
    onAddressDeleted(id);
  };
  return (
    <div>
      <IconButton onClick={handleOpen} aria-controls={id} aria-haspopup="true">
        {/*  <MoreVertIcon /> */}
      </IconButton>
      <Menu id={id} keepMounted anchorEl={state.menuOpen} open={Boolean(state.menuOpen)} onClose={handleClose}>
        <MenuItem onClick={editAddress}>Editar</MenuItem>
        <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
      </Menu>
    </div>
  );
};
class AddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: null,
    };
  }
  handleOpen = (event) => {
    this.setState({
      menuOpen: event.currentTarget,
    });
  };
  handleClose = () => {
    this.setState({
      menuOpen: null,
    });
  };
  createAddress = () => {
    let href = window.location.href;
    window.location.href = `${origin}/en/address?redirect=${encodeURIComponent(href)}`;
  };
  cleanObj(obj) {
    return Object.entries(obj)
      .filter(([_, v]) => v !== null)
      .reduce((p, [k, v]) => ({ ...p, [k]: v }), {});
  }
  render() {
    const {
      account: { addressBook = {} },
      components: { RadioButtonItem },
      onAddressDeleted,
      onSelect,
      currentAddress,
    } = this.props;
    return (
      <Items>
        {(addressBook || []).map(({ metafields, ...addr }) => {
          const inp = {
            metaddress: {},
            geolocation: {},
            ...this.cleanObj(metas(metafields).res),
            ...this.cleanObj(addr),
          };
          console.info("this.props.addressBook", addressBook);
          // console.info(`LOG:AddressList:${inp._id}`,   inp.geolocation);
          /*   const getNameOfBranch = (distance) => {
              if (!distance.branchId) {
                return "Actualiza su dirección";
              } else if (distance.branchId == "") {
                return "Actualiza su dirección";
              } else {
                return distance.branch;
              }s
            }; */

          /* ${getNameOfBranch(metaddress.distance)} */
          return (
            <RadioButtonItem
              title={inp.description}
              description={
                inp
                  ? [inp.address, inp.receiver].filter((h) => (h || "").trim() !== "").join(" - ")
                  : `Actualiza su dirección - ${" inp.address"} ${" inp.description"}`
              }
              isSelected={currentAddress && currentAddress._id == inp._id}
              value={inp}
              handleChange={onSelect}
              trailing={<Controls id={inp._id} onAddressDeleted={onAddressDeleted} />}
              trailingProps={{
                menuOpen: this.state.menuOpen,
                handleOpen: this.handleOpen,
                handleClose: this.handleClose,
              }}
            />
          );
        })}
        <CustomRoundedButton onClick={this.createAddress}>
          <CustomButtonText>
            {addressBook.length > 0 ? "Agregar otra dirección" : "Agregar una dirección"}
          </CustomButtonText>
          {/*   <AddIcon /> */}
        </CustomRoundedButton>
      </Items>
    );
  }
}
export default withComponents(AddressList);
