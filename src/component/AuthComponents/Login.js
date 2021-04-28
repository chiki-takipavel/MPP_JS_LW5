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
        marginBottom: ".5rem"
    },
});

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: null}
    }

    login = (event) => {
        event.preventDefault();
        const email = event.target.elements[0].value;
        const password = event.target.elements[2].value;
        let resultPromise = this.context.login(email, password);
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
                        <Typography component='h1' variant='h5'>
                            Войти
                        </Typography>
                        <form noValidate onSubmit={this.login}>
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='email'
                                label='Email'
                                name='email'
                                autoComplete='email'
                                autoFocus
                            />
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Пароль'
                                type='password'
                                id='password'
                                autoComplete='current-password'
                            />
                            <Button
                                type='submit'
                                fullWidth
                                variant='contained'
                                className={classes.button}
                            >
                                Войти
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to={Routes.registration} variant='body2'>
                                        Нет аккаунта? Зарегистрируйтесь
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

Login.contextType = AuthContext;

export default withStyles(styles)(withRouter(Login))