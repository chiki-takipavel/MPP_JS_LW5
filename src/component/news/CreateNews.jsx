import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {withRouter} from 'react-router-dom';
import {Routes} from "../../constant/Routes";
import {withStyles} from "@material-ui/core/styles";
import {AuthContext} from "../AuthProvider/AuthProvider";
import {endpointsClient, endpointsServer} from "../../constant/endpoints";
import {socket} from "../../service/requestService";

const styles = theme => ({
    root: {
        background: "rgba(255, 255, 255, 75%)",
        borderRadius: "15px",
        margin: "1rem 0",
        padding: "1rem",
    },

    button: {
        background: "#3f51b5",
        color: "#fff",
    }
});

class CreateNews extends React.Component {

    onSubmit = event => {
        event.preventDefault();
        const title = event.target.elements[0].value;
        const content = event.target.elements[1].value;
        socket.on(endpointsClient.getNew, () => {
            this.props.history.push(Routes.news);
        });
        socket.emit(endpointsServer.postNews, {title, content, email: this.context.currentUser.email});
    };

    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.root} boxShadow={3}>
                <form noValidate autoComplete='off' onSubmit={this.onSubmit}>
                    <Grid
                        container
                        direction="column"
                        justify="space-evenly"
                        alignItems="center"
                    >
                        <Box width="50%">
                            <TextField id='title' label='Заголовок' fullWidth={true}/>
                            <Box mt={1}>
                                <TextField
                                    fullWidth={true}
                                    placeholder="Содержание"
                                    multiline
                                    rows={1}
                                    rowsMax={8}
                                />
                            </Box>
                        </Box>
                        <Box m={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                className={classes.button}
                            >
                                Создать
                            </Button>
                        </Box>
                    </Grid>
                </form>
            </Box>
        )
    }
}

CreateNews.contextType = AuthContext;
export default withStyles(styles)(withRouter(CreateNews))
