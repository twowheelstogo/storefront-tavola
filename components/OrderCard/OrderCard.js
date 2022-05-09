import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import OrderCardHeader from "components/OrderCardHeader";
import OrderCardFulfillmentGroup from "components/OrderCardFulfillmentGroup";
import OrderCardSummary from "components/OrderCardSummary";
import PageLoading from "components/PageLoading";
import OrderDetails from "components/OrderDetails";
import styled from "styled-components";

const TitleItems = styled.div`
font-size: 20px;
font-weight: 800;
padding-left: 16px;
padding-top: 10px;
`;

const styles = (theme) => ({
  orderCard: {
    border: `solid 1px ${theme.palette.reaction.black10}`,
    borderRadius: "2px",
    marginBottom: theme.spacing(2.5)
  },
  orderCardHeader: {},
  orderCardFulfillmentGroups: {},
  orderCardSummary: {
    padding: theme.spacing(2)
  }
});

class OrderCard extends Component {
  static propTypes = {
    classes: PropTypes.object,
    isExpanded: PropTypes.bool,
    isLoadingOrders: PropTypes.bool,
    order: PropTypes.shape({
      email: PropTypes.string.isRequired,
      fulfillmentGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
      payments: PropTypes.arrayOf(PropTypes.object),
      referenceId: PropTypes.string.isRequired
    })
  };

  renderFulfillmentGroups() {
    const { order: { fulfillmentGroups } } = this.props;

    return (
      <Fragment>
        {fulfillmentGroups.map((fulfillmentGroup, index) => (
          <OrderCardFulfillmentGroup
            key={`${fulfillmentGroup._id}`}
            fulfillmentGroup={fulfillmentGroup}
            currentGroupCount={index + 1}
            totalGroupsCount={fulfillmentGroups.length}
          />
        ))}
      </Fragment>
    );
  }

  renderHeader() {
    const { isExpanded, order } = this.props;

    return <OrderCardHeader isExpanded={isExpanded} order={order} />;
  }

  renderSummary() {
    const { order: { summary } } = this.props;

    return <OrderCardSummary summary={summary} />;
  }

  renderCustomer() {
    const { order } = this.props;
    return <OrderDetails order={order}/>
  }

  render() {
    const { classes, isLoadingOrders } = this.props;

    if (isLoadingOrders) return <PageLoading message="Loading order details..." />;

    return (
      <Grid container>
        <Grid item xs={12} md={12}>
          <div className={classes.orderCard}>
            <header className={classes.orderCardHeader}>
              {this.renderHeader()}
            </header>
            <Grid container >
              <Grid item xs={12} md={6} >
                <Grid container style={{ height: '100%' }} justifyContent="space-between" flexDirection="column">
                  <Grid item xs={12}>
                    {this.renderCustomer()}
                  </Grid>
                  <Grid item xs={12} className={classes.orderCardSummary}>
                    {this.renderSummary()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <TitleItems>Items</TitleItems>
                <section className={classes.orderCardFulfillmentGroups}>
                  {this.renderFulfillmentGroups()}
                </section>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(OrderCard);
