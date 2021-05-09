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
import {withRouter} from "react-router-dom";
import {Routes} from "../../constant/Routes";
import {withStyles} from "@material-ui/core/styles";
import Comments from "../Comments";
import {AuthContext} from "../AuthProvider/AuthProvider";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import StarIcon from '@material-ui/icons/Star';
import {useContext, useState} from "react";
import {GET_POSTS} from "../../constant/query";
import {useMutation} from "@apollo/client";
import {ADD_TO_FAVORITES, DELETE_POST, LIKE, UPDATE_POST} from "../../constant/mutation";

const styles = theme => ({
    root: {
        width: "80%",
        background: "rgba(255, 255, 255, 75%)",
        borderRadius: "15px",
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
        background: "#3f51b5",
        color: "#fff",
        marginRight: "1rem",
        width: "7rem"
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

function News(props) {
    const context = useContext(AuthContext)

    const [state, setState] = useState({
            news: props.news,
            commentsOpen: false,
            edit: false,
            newTitle: null,
            content: null,
            commentColor: "action",
            likeColor: "action",
            favoriteColor: "action",
        });

    const updateCache = (client, {data: {deletePost: item}}) => {
        const data = client.readQuery({
            query: GET_POSTS,
        });
        const newData = {
            posts: data.posts.filter(t => t.id !== item.id)
        };
        client.writeQuery({
            query: GET_POSTS,
            data: newData
        });
        props.setParent(prev => {
            return {...prev, news: data.posts.filter(t => t.id !== item.id)}
        })
    };

    const [deletePost] = useMutation(DELETE_POST);
    const [updatePost] = useMutation(UPDATE_POST);
    const [addLike] = useMutation(LIKE);
    const [addToFavorites] = useMutation(ADD_TO_FAVORITES);
    const handleDelete = () => {
        console.log("deleteting", props, props.news['id']);
        deletePost({
            variables: {id: props.news['id']},
            update: updateCache
        }).then(e => console.log("success")).catch(e => console.log(e));
    };

    const edit = () => {
        setState((prev) => {
            return {...prev, edit: !prev.edit}
        })
    };

    const save = () => {
        if (context.currentUser){
            let news = props.news;
            news.title = state.newTitle;
            news.content = state.content;
            news.email = context.currentUser.email;
            console.log(props.news['id'], state.newTitle, state.content);
            updatePost({
                variables: {
                    id: props.news['id'], title: state.newTitle, body: state.content
                }
            }).then((res) => props.history.push(Routes.posts)).catch(e => console.log(e))

            setState((prev) => {
                return {...prev, edit: !prev.edit}
            })
        }
    };

    const like = () => {
        console.log("like", props.news);
        if (context.currentUser){
            addLike({variables: {id: props.news['id'], email: context.currentUser.email}}).then(response => {
                console.log("like success", response.data.addPostLike);
                setState({...state, news: response.data.addPostLike});
                props.setParent((prev) => {
                    let news = [...prev.news.filter(e => e.id !== response.data.addPostLike.id)]
                    news.splice(prev.news.findIndex(e => e.id === response.data.addPostLike.id), 0, response.data.addPostLike);
                    return {
                        ...prev,
                        news: news
                    }
                })
            }).then(e => console.log(e));
        }
    };

    const handleFavorites = () => {
        if (context.currentUser){
            if (context.currentUser){
                addToFavorites({variables: {id: props.news['id'], email: context.currentUser.email}}).then(response => {
                    console.log("response!!!!!!1", response.data.addToFavorites);
                    setState({...state, news: response.data.addToFavorites});
                    props.news.favorites = response.data.addToFavorites.favorites;
                    props.setParent((prev) => {
                        return {
                            ...prev,
                            news: [response.data.addToFavorites, ...prev.news.filter(e => e.id !== response.data.addToFavorites.id)]
                        }
                    })
                }).then(e => console.log(e));
            }
        }
    }

    const handleClick = () => {
        setState((prev) => {
            return {
                ...prev,
                commentsOpen: !prev.commentsOpen,
                commentColor: prev.commentColor === "primary" ? "action" : "primary"
            }
        })
    }

    const onTitleChange = (value) => {
        setState({
            ...state,
            newTitle: value
        });
    }

    console.log("props news",props.news);
    const { classes } = props;
    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <div className={classes.headerWrapper}>
                    {!state.edit &&
                        <CardHeader title={state.news.title} className={classes.header}/>
                    }
                    {state.edit &&
                        <TextField className={classes.editTitle} id='title' label='Заголовок' value={state.newTitle ?? state.news.title}
                                   onChange={e => onTitleChange(e.target.value)}/>
                    }
                    {(state.news.author && context.currentUser && context.currentUser.email === state.news.author) &&
                    <span className={classes.author}>Это Ваша новость</span>
                    }
                </div>
                <CardContent>
                    {!state.edit &&
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.postText}>
                            {state.news.content}
                        </Typography>
                    }
                    {state.edit &&
                        <Box mt={1}>
                            <TextField
                                value={state.content ?? state.news.content}
                                onChange={e => setState({...state, content: e.target.value})}
                                className={classes.editBody}
                                placeholder="Содержание"
                                multiline
                                rows={1}
                                rowsMax={8}
                            />
                        </Box>
                    }
                </CardContent>
                    <CardActions className={classes.buttonWrapper}>
                        <CardActions disableSpacing={true}>
                            <IconButton onClick={like} aria-label="Like">
                                <FavoriteIcon/>
                            </IconButton>
                            <Typography>
                                {state.news.likes}
                            </Typography>
                            <IconButton onClick={handleClick}>
                                <ModeCommentIcon color={state.commentColor}/>
                            </IconButton>
                            <Typography>
                                {state.news.comments.length}
                            </Typography>
                            {context.currentUser &&
                            <IconButton onClick={handleFavorites}>
                                <StarIcon color={state.favoriteColor}/>
                            </IconButton>
                            }
                        </CardActions>
                        {context.currentUser && (context.currentUser.role === "admin"
                         || (state.news.author && context.currentUser.email === state.news.author)) &&
                            <div>
                                {!state.edit &&
                                    <Button onClick={edit} variant='contained' color='secondary'
                                            className={classes.button}>
                                        Изменить
                                    </Button>
                                }
                                {state.edit &&
                                <Button onClick={save} variant='contained' color='secondary'
                                        className={classes.button}>
                                    Сохранить
                                </Button>
                                }
                                <Button onClick={handleDelete} variant='contained' color='secondary' className={classes.button}>
                                    Удалить
                                </Button>
                            </div>
                        }
                    </CardActions>
            </Card>
            {state.commentsOpen && <Comments news={state.news} setState={(data) => {
                setState((prev) => {
                    return {...prev, news: data}
                })
            }}/>}
        </div>
    )
}

export default withStyles(styles)(withRouter(News))
