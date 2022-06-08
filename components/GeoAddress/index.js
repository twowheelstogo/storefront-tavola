import React, { Component, Fragment } from "react";
import Select from "components/Select";
import Link from "components/Link";
import { withApollo } from "lib/apollo/withApollo";
import Cookies from "js-cookie";
import Router from "translations/i18nRouter";
import { uAccountAddress } from "hooks/address/mutations.gql";
import lodash from "lodash";
// import config from "config";
export function setDefAddr({ viewer, address }) {
  let inp = null;
  try {
    inp = JSON.parse((window.localStorage || localStorage).getItem("shopxInp"));
    console.info(": localStorage", inp);
  } catch (e) {console.log(e.message)}
  if (!inp)
    try {
      inp = JSON.parse(Cookies.get("shopxInp"));
      console.info("LOG: Cookies", inp);
    } catch (e) {
      inp = {};
    }
  console.info("LOG: setDefAddr", { viewer, address });
  if (!address && (((viewer || {}).addresses || {}).nodes || []).length) {
    address = viewer.addresses.nodes.find((a) => a.isDef);
    if (!address) address = viewer.addresses.nodes[0];
  }
  let geo = null;
  if (address) {
    if (address.geo && address.geo.coordinates) {
      geo = address.geo.coordinates;
    } else if (address.geolocation && address.geolocation.latitude && address.geolocation.longitude) {
      geo = [address.geolocation.longitude, address.geolocation.latitude];
    }
  }
  console.info("LOG: setDefAddr:geo", geo);
  if (geo) {
    if (!inp) inp = {};
    if (!inp.geo) inp.geo = {};
    if (!lodash.isEqual(inp.geo.coordinates, geo)) {
      inp.geo.coordinates = geo;
      const sGeo = JSON.stringify(inp);
      try {
        (window.localStorage || localStorage).setItem("shopxInp", sGeo);
      } catch (e) {}
      try {
        Cookies.set("shopxInp", sGeo);
      } catch (e) {}
      // Refresh
      // if (config.MULTIPLE_STORE_ENABLED)
      try {
        window.location = window.location;
      } catch (error) {}
    }
  }
}

class GeoAddress extends Component {
   newAddrPath = "/profile/address";
  get addresses() {
    return ((this.props.viewer || {}).addresses || {}).nodes || [];
  }
  handleSelected = async (event) => {
    if (!event.target.value) {
      console.info("LOG:event.target.value", event.target.value);
      // Router.push(this.newAddrPath);
    } else {
      const address = this.addresses.find((a) => a._id === event.target.value);
      setDefAddr({ address });
      if (this.props.client) {
        const res = await this.props.client.mutate({
          mutation: uAccountAddress,
          variables: {
            input: {
              accountId: this.props.viewer._id,
              addressId: address._id,
              updates: { isDef: true },
            },
          },
        });
        console.info(`\n\n==> { res }\n`, JSON.stringify(res, undefined, 2), `\n`, ``);
      } else {
        console.error(`\n\n==> { client must be included }\n`, this.props);
      }
    }
  };
  render() {
    if (!this.addresses.length) return <Link href={this.newAddrPath}>Agrega una dirección</Link>;
    return (
      <Select
        options={this.addresses
          .map((a) => ({
            value: a._id,
            name: a.name || a.address,
          }))
          .concat([{ value: null, name: "Add Address" }])}
        inputProps={{
          name: "addresses",
          id: "addresses",
        }}
        onChange={this.handleSelected}
        value={(this.addresses.find((a) => a.isDef) || {})._id}
      />
    );
  }
}

export default GeoAddress;
// export default withApollo()(GeoAddress);
