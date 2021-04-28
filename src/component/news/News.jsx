import * as React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from '@material-ui/icons/Favorite';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import {endpoints} from "../../constant/endpoints";
import {RestRequest} from "../../service/requestService";
import {withRouter} from "react-router-dom";
import {Routes} from "../../constant/Routes";
import {withStyles} from "@material-ui/core/styles";
import Comments from "../Comments";
import {AuthContext} from "../AuthProvider/AuthProvider";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import StarIcon from '@material-ui/icons/Star';

const styles = theme => ({
    root: {
        width: "80%",
        marginBottom: "1rem",
        display: "flex",
        alignContent: "space-between",
        flexWrap: "wrap",
    },

    card: {
        width: "100%"
    },

    postText: {
        fontSize: "1rem"
    },

    header: {
        width: "100%",
    },

    headerWrapper: {
        display: "flex",
        justifyContent: "center",
        position: "relative"
    },

    author: {
        position: "absolute",
        right: "2rem",
        top: "1rem",
        color: "rgba(0, 0, 0, 0.54)",
        fontStyle: "italic"
    },

    buttonWrapper: {
        display: "flex",
        justifyContent: "space-between",
        padding: "0 1.5rem 0 0"
    },
    button: {
        marginRight: "1rem",
        width: "5rem"
    },

    editTitle: {
        width: "25rem",
        top: ".5rem"
    },

    editBody: {
        width: "45rem",
        top: ".5rem"
    }
});

class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: this.props.news,
            commentsOpen: false,
            edit: false,
            newTitle: null,
            content: null,
            commentColor: "action",
            likeColor: "action",
            favoriteColor: "action",
        }
    }

    delete = () => {
        RestRequest.delete(endpoints.deleteNews(this.props.news['_id'])).then((response) => {
            this.props.deleteOne(this.props.news);
        }).catch(reason => {
            if (reason.response.status === 401 || reason.response.status === 403) this.props.history.push(Routes.login);
        });
    };

    edit = () => {
        this.setState((prev) => {
            return {edit: !prev.edit}
        })
    };

    save = () => {
        if (this.context.currentUser){
            let news = this.props.news;
            news.title = this.state.newTitle;
            news.content = this.state.content;
            news.email = this.context.currentUser.email;
            RestRequest.put(endpoints.putNews(this.props.news['_id']), {}, news).then(response => {
                console.log(response.data.payload)
                let news = this.props.news;
                news.title = response.data.payload.title;
                news.content = response.data.payload.content;
                this.setState(news);
            })

            this.setState((prev) => {
                return {edit: !prev.edit}
            })
            // .catch(reason => {
            //     if (reason.response.status === 401 || reason.response.status === 403) this.props.history.push(Routes.login);
            // });
        }
    };

    like = () => {
        if (this.context.currentUser){
            let news = this.props.news;
            news.likes++;
            news.email = this.context.currentUser.email;
            RestRequest.put(endpoints.putNews(this.props.news['_id']), {}, news).then(response => {
                console.log(response.data.payload)
                let news = this.props.news;
                news.likes = response.data.payload.likes;
                this.setState(news);
            })
            // .catch(reason => {
            //     if (reason.response.status === 401 || reason.response.status === 403) this.props.history.push(Routes.login);
            // });
        }
    };

    handleFavorites = () => {
        if (this.context.currentUser){
            let news = this.props.news;
            news.favoriteEmail = this.context.currentUser.email;
            RestRequest.put(endpoints.putNews(this.props.news['_id']), {}, news).then(response => {
                console.log(response.data.payload)
                let news = this.props.news;
                news.favorites = response.data.payload.favorites;
                console.log("favorites", response.data.payload);
                this.setState({...news, favoriteColor: !news.favorites.includes(this.context.currentUser.email) ? "action" : "primary"});
            })
        }
    }

    handleClick = () => {
        this.setState((prev) => {
            return {
                commentsOpen: !prev.commentsOpen,
                commentColor: prev.commentColor === "primary" ? "action" : "primary"
            }
        })
    }

    onTitleChange(value){
        this.setState({
            newTitle: value
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <div className={classes.headerWrapper}>
                        {!this.state.edit &&
                            <CardHeader title={this.props.news.title} className={classes.header}/>
                        }
                        {this.state.edit &&
                            <TextField className={classes.editTitle} id='title' label='title' value={this.state.newTitle ?? this.props.news.title}
                                       onChange={e => this.onTitleChange(e.target.value)}/>
                        }
                        {(this.props.news.author && this.context.currentUser && this.context.currentUser.email === this.props.news.author) &&
                        <span className={classes.author}>your post!</span>
                        }
                    </div>
                    <CardContent>
                        {!this.state.edit &&
                            <Typography variant="body2" color="textSecondary" component="p" className={classes.postText}>
                                {this.props.news.content}
                            </Typography>
                        }
                        {this.state.edit &&
                            <Box mt={1}>
                                <TextField
                                    value={this.state.content ?? this.props.news.content}
                                    onChange={e => this.setState({content: e.target.value})}
                                    className={classes.editBody}
                                    placeholder="content"
                                    multiline
                                    rows={1}
                                    rowsMax={8}
                                />
                            </Box>
                        }
                    </CardContent>
                        <CardActions className={classes.buttonWrapper}>
                            <CardActions disableSpacing={true}>
                                <IconButton onClick={this.like} aria-label="Like">
                                    <FavoriteIcon/>
                                </IconButton>
                                <Typography>
                                    {this.props.news.likes}
                                </Typography>
                                <IconButton onClick={this.handleClick}>
                                    <ModeCommentIcon color={this.state.commentColor}/>
                                </IconButton>
                                <Typography>
                                    {this.props.news.comments.length}
                                </Typography>
                                {this.context.currentUser &&
                                <IconButton onClick={this.handleFavorites}>
                                    <StarIcon color={"action"}/>
                                </IconButton>
                                }
                            </CardActions>
                            {this.context.currentUser && (this.context.currentUser.role === "admin"
                             || (this.props.news.author && this.context.currentUser.email === this.props.news.author)) &&
                                <div>
                                    {!this.state.edit &&
                                        <Button onClick={this.edit} variant='contained' color='secondary'
                                                className={classes.button}>
                                            Edit
                                        </Button>
                                    }
                                    {this.state.edit &&
                                    <Button onClick={this.save} variant='contained' color='secondary'
                                            className={classes.button}>
                                        Save
                                    </Button>
                                    }
                                    <Button onClick={this.delete} variant='contained' color='secondary' className={classes.button}>
                                        Delete
                                    </Button>
                                </div>
                            }
                        </CardActions>
                </Card>
                {this.state.commentsOpen && <Comments news={this.state.news} setState={(data) => {
                    this.setState((prev) => {
                        return {news: data}
                    })
                }}/>}
            </div>
        )
    }
}

News.contextType = AuthContext;
export default withStyles(styles)(withRouter(News))
