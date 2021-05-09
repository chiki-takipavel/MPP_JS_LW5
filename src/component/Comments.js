import React, {useContext, useState} from "react"
import Grid from "@material-ui/core/Grid";
import {Avatar, Divider, makeStyles, Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import {AuthContext} from "./AuthProvider/AuthProvider";
import {useMutation} from "@apollo/client";
import {ADD_COMMENT} from "../constant/mutation";

const useStyles = makeStyles({
    commentsWrapper: {
        margin: ".5rem 0 0 3rem",
        width: "100%"
    },

    commentCard: {
        padding: "1rem",
    },

    comment: {
        textAlign: "left",
        padding: ".5rem 0",
        fontSize: "1rem"
    },

    time: {
        textAlign: "left",
        color: "gray",
        margin: 0,
        fontSize: ".8rem"
    },

    name: {
        textAlign: "left",
        margin: "0"
    },
});

export default function Comments(props){
    const classes = useStyles();
    const comments = props.news.comments;
    const context = useContext(AuthContext)


    const [state, setState] = useState({text: ""})
    const [addComment] = useMutation(ADD_COMMENT);

    const onCommentSend = (event) => {
            event.preventDefault();

            console.log(props.news['id'], `${context.currentUser.name} ${context.currentUser.surname}` ?? "user", event.target.elements[0].value)
            addComment({
                variables: {
                    id: props.news['id'],
                    email: `${context.currentUser.name} ${context.currentUser.surname ?? ""}` ?? "user",
                    body: event.target.elements[0].value,
                }
            }).then((res) => {
                props.setState(res.data.addComment);
                setState({
                    text: ""
                })
            }).catch(e => console.log(e))
    };

    const commentsBlocks = comments.map((comment, index) => {
        return (
            <React.Fragment key={index}>
                <Grid container wrap="nowrap" spacing={2} className={classes.commentCard}>
                    <Grid item>
                        <Avatar/>
                    </Grid>
                    <Grid item>
                        <h4 className={classes.name}>{comment.author}</h4>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.comment}>
                            {comment.content}
                        </Typography>
                        <p className={classes.time}>
                            {`Опубликован ${new Date(parseInt(comment.date)).toString()}`}
                        </p>
                    </Grid>
                </Grid>
                <Divider variant="fullWidth" className={classes.divider} />
            </React.Fragment>
            )
    });

    console.log("render2", props.news);
    return <Paper className={classes.commentsWrapper}>
        {commentsBlocks}
        { context.currentUser &&
            <Box px={1}>
                <form noValidate autoComplete='off' onSubmit={onCommentSend}>
                    <TextField value={state.text} onChange={(e)=>{setState({text: e.target.value})}} id='title' label='Комментарий' fullWidth={true}/>
                </form>
            </Box>
        }
    </Paper>
}