import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {Routes} from "../../constant/Routes";

import {Link, withRouter} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {ExitToApp} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import {AuthContext} from "../AuthProvider/AuthProvider";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        background: "rgba(255, 255, 255, 75%)",
        color: "#000",
        height: "7rem",
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: "15px",
        justifyContent: "space-between",
        padding: "0 1rem",
        textTransform: "uppercase"
    },

    logo: {
        fontSize: "1.8rem",
        fontWeight: "bold",
    },

    button: {
        height: "2.5rem",
        fontSize: "1rem",
        color: "#000"
    }
});

class Navbar extends React.Component {
    create = () => {
        this.props.history.push(Routes.newsCreate);
    };

    news = () => {
        this.props.history.push(Routes.news);
    };

    logout = () => {
        this.context.logout();
        this.props.history.push(Routes.login);
    }

    render() {
        const { classes } = this.props;
        console.log("user")
        console.log(this.context.currentUser)
        return (
            <AppBar className={classes.root} position="static" color="primary">
                <Typography variant="h1" className={classes.logo}>
                    Новости
                </Typography>
                <Toolbar>
                    <Button onClick={this.news} className={classes.button}>
                        Все новости
                    </Button>
                    {this.context.currentUser ?
                        <>
                            <Button onClick={this.create} className={classes.button} color={"inherit"}>
                                Написать новость
                            </Button>
                            <IconButton onClick={this.logout}>
                                <ExitToApp color='#ee7752'>
                                </ExitToApp>
                            </IconButton>
                            <Typography>
                                {this.context.currentUser.name}
                            </Typography>
                        </>
                        :
                        <Link to={Routes.login}>
                            <IconButton>
                                <ExitToApp color='action'/>
                            </IconButton>
                        </Link>
                    }
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.contextType = AuthContext;
export default withStyles(styles)(withRouter(Navbar))
