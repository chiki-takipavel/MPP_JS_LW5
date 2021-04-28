import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {endpoints} from "../../constant/endpoints";
import {withRouter} from 'react-router-dom';
import {Routes} from "../../constant/Routes";
import {RestRequest} from "../../service/requestService";
import Card from "@material-ui/core/Card";
import {withStyles} from "@material-ui/core/styles";
import {AuthContext} from "../AuthProvider/AuthProvider";

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
        RestRequest.post(endpoints.postNews, {}, {title, content, email: this.context.currentUser.email})
            .then((response) => {
                this.props.history.push(Routes.news);
            }).catch(reason => {
            if (reason.response.status === 401 || reason.response.status === 403) this.props.history.push(Routes.login);
        });
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
