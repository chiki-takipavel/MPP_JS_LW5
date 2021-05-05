import React from "react";
import Box from "@material-ui/core/Box";
import {Card, makeStyles} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        background: "rgba(255, 255, 255, 75%)",
        display: "flex",
        justifyContent: "space-around",
        margin: "0.3rem 0",
        borderRadius: "15px",
    },

    card: {
        width: "40%",
        textAlign: "center",
        margin: "0.8rem 0",
    },

    cardName: {
        fontSize: "1.25rem",
        color: "#000",
        textTransform: "uppercase",
        fontWeight: "bold"
    },

    cardInfo: {
        fontSize: "0.875rem",
        fontFamily: "'Roboto', sans-serif",
        color: "#000",
    },

    snWrapper: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        margin: "0 0 1rem 0",
        padding: "0",
    }
});

export default function Footer(){
    const classes = useStyles();

    return (
        <Box className={classes.root} boxShadow={3}>
            <div className={classes.card}>
                <div className={classes.cardName}>copyrights</div>
                <div className={classes.cardInfo}>@2021. All rights reserved</div>
            </div>
        </Box>
    );
}