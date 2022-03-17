import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Breadcrumbs from "components/Breadcrumbs/v2";
import { Grid } from "@material-ui/core";

const styles = (theme) => ({
    breadcrumbGrid: {
        padding: theme.spacing(1),
        ["@media (min-width:960px)"]: {
            marginLeft: theme.spacing(5),
        },
        ["@media (max-width:959px)"]: {
            marginLeft: theme.spacing(0)
        },

        ["@media (min-width:600px)"]: {
            marginBottom: theme.spacing(0.5),
            marginTop: theme.spacing(0.5),
        },
        ["@media (max-width:959px)"]: {
            marginTop: "-1px",
        },
    },
    page: {
        backgroundColor: "#F6F6F6",
        ["@media (min-width:600px)"]: {
            height: '43px',
        },
        ["@media (max-width:599px)"]: {
            height: '33px',
        },
    },
});

class BreadcrumbsSwitch extends Component {
    static propTypes = {
        classes: PropTypes.object,
        routerLabel: PropTypes.string,
        router: PropTypes.object,
        routerType: PropTypes.number
    };

    static defaultProps = {
        classes: {},
    };

    render() {
        const { classes, routerLabel, router, routerType } = this.props;
        return (
            <>
                {
                    <>
                        {
                            routerType === 1 ?
                                <div className={classes.page}>
                                    <Grid container>
                                        <Grid item xs={12} className={classes.breadcrumbGrid}>
                                            <Breadcrumbs isPDP path={router.pathname} tagId={routerLabel} />
                                        </Grid>
                                    </Grid>
                                </div>
                                :
                                <Grid item xs={12}></Grid>
                        }
                    </>
                }
            </>
        );
    }
}

export default withStyles(styles)(BreadcrumbsSwitch);