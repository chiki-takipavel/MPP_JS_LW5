import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {Link, withRouter} from 'react-router-dom';
import {Routes} from '../../constant/Routes';
import {AuthContext} from "../AuthProvider/AuthProvider";
import Alert from "../alert/Alert";
import Box from "@material-ui/core/Box";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        background: "rgba(255, 255, 255, 75%)",
        borderRadius: "15px",
        margin: "1rem 0",
        padding: "1rem",
    },

    button: {
        background: "#3f51b5",
        color: "white",
        borderRadius: "3%",
        margin: ".5rem 0"
    },
});

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: null}
    }

    registration = (event) => {
        event.preventDefault();

        const name = event.target.elements[0].value;
        const surname = event.target.elements[2].value;
        const email = event.target.elements[4].value;
        const password = event.target.elements[6].value;
        console.log(name, surname, email, password)
        let resultPromise = this.context.registration(name, surname, email, password);
        resultPromise.then(() => {
            this.props.history.push(Routes.news);
        }).catch(reason => {
            this.setState({error: reason.response.data.message})
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <Box className={classes.root} boxShadow={3}>
                <Container component='main' maxWidth='xs'>
                    <CssBaseline/>
                    {this.state.error ? <Alert severity="error">{this.state.error}</Alert> : <></>}
                    <div>
                        <Typography component="h1" variant="h5" className={classes.h5}>
                            Зарегистрироваться
                        </Typography>
                        <form noValidate onSubmit={this.registration}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className={classes.button}
                            >
                                Зарегистрироваться
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to={Routes.login} variant="body2">
                                        Уже есть аккаунт
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Container>
            </Box>
        )
    }

}

Registration.contextType = AuthContext;
export default withStyles(styles)(withRouter(Registration))