import * as React from "react";
import News from "./News";
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import {withRouter} from "react-router-dom";
import {AuthContext} from "../AuthProvider/AuthProvider";
import {GET_POSTS} from "../../constant/query";
import {makeStyles} from "@material-ui/core";
import {useContext, useState} from "react";
import {useQuery} from "@apollo/client";

const useStyles = makeStyles({
    root: {
        background: "rgba(255, 255, 255, 75%)",
        borderRadius: "15px",
        margin: "1rem 0",
        padding: "1rem",
    },

    iconButton: {
        borderRadius: "3%",
        marginBottom: ".5rem"
    },

    news: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap"
    }
});

function NewsList(){
    const classes = useStyles();
    const [state, setState] = useState({
        isFavorites : false,
        order: false,
        data: null
    })

    const context = useContext(AuthContext)

    const topLike = () => {
        setState(prev => {
            return {
                ...prev,
                isFavorites: prev.isFavorites,
                order: !prev.order
        }})
    };

    const favorites = () => {
        setState(prev => {
            return {
                ...prev,
                isFavorites: true,
                order: prev.order
            }})
    };


    const all = () => {
        setState(prev => {
            return {
                ...prev,
                isFavorites: false,
                order: prev.order
            }})
    };

    const setUserData = (data) => {
        setState({...state, news: data.posts});
    }

    const {loading} = useQuery(GET_POSTS, {onCompleted: setUserData});

    let news = state.news ? (state.order ? state.news.sort((a,b) => {
        if (+a.likes < +b.likes) {
            return 1
        }
        if (+a.likes > +b.likes) {
            return -1
        }
        return 0
    }) : state.news) : [];

    news = news.filter(e => {
        if(state.isFavorites){
            return e.favorites.includes(context.currentUser.email)
        }
        return true
    }).map(post => <News key={post['id']} news={post} setParent={setState}/>);
    console.log("render");
    return (
            <React.Fragment>
                <Box className={classes.root} boxShadow={3}>
                    {!state.isFavorites &&
                        <IconButton onClick={favorites} className={classes.iconButton}>
                            Только избранные
                        </IconButton>
                    }
                    {!state.isFavorites &&
                    <IconButton onClick={topLike} className={classes.iconButton}>
                        Сортировка по лайкам {!state.order ? <FavoriteBorderIcon/> : <FavoriteIcon/>}
                    </IconButton>
                    }
                    {state.isFavorites &&
                        <IconButton onClick={all} className={classes.iconButton}>
                            Все новости
                        </IconButton>
                    }
                    <Box className={classes.news}>
                        {loading ? <LinearProgress/> : state.news &&
                            news
                        }
                    </Box>
                </Box>
            </React.Fragment>)
}

export default withRouter(NewsList)
