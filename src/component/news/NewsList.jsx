import * as React from "react";
import News from "./News";
import {endpointsClient, endpointsServer} from "../../constant/endpoints";
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import {socket} from "../../service/requestService";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import {AuthContext} from "../AuthProvider/AuthProvider";

const styles = theme => ({
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

class NewsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {news: [], loading: false, order: true, isFavorites : false};
    }

    deleteOneNews = (element) => {
        let news = this.state.news;
        let updatedNews = news.filter((news) => !(news['_id'] === element['_id']));
        this.setState({news: updatedNews});
    };

    componentDidMount() {
        this.load(this.state.order);
    }

    load = (order) => {
        this.setState({loading: true});
        let params = {
            sort: 'likes',
            order: order ? 1 : -1
        };
        socket.on(endpointsClient.getAll, (data) => {
            this.setState({order: order, news: data.payload, loading: false});
        });
        socket.emit(endpointsServer.getNewsList, params);
    };
    topLike = () => {
        this.load(!this.state.order);
    };

    favorites = () => {
        let params = {
            sort: 'likes',
            order: 1
        };
        socket.on(endpointsClient.getAll, (data) => {
            const news = data.payload;
            console.log(news, "favorites");
            console.log(this.context.currentUser.email);
            console.log(news.filter(e => e.favorites && e.favorites.includes(this.context.currentUser.email)));
            this.setState({loading: false, news: news.filter(e => e.favorites && e.favorites.includes(this.context.currentUser.email))});
        });
        socket.emit(endpointsServer.getNewsList, params);
        this.setState((prev) => {
            return {
                isFavorites : !prev.isFavorites
            }
        })
    };

    all = () => {
        let params = {
            sort: 'likes',
            order: this.state.order ? 1 : -1
        };
        socket.on(endpointsClient.getAll, (data) => {
            const news = data.payload;
            this.setState({loading: false, news})
        });
        socket.emit(endpointsServer.getNewsList, params);
        this.setState((prev) => {
            return {
                isFavorites : !prev.isFavorites
            }
        })
    };

    render() {
        let loading = this.state.loading;
        if(this.state.news === undefined) {
            return <LinearProgress/>
        }
        let news = this.state.news.map((news, index) => {
                return <News deleteOne={this.deleteOneNews} key={index} news={news}/>
        });
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Box className={classes.root} boxShadow={3}>
                    {!this.state.isFavorites &&
                        <IconButton onClick={this.favorites} className={classes.iconButton}>
                            Только избранные
                        </IconButton>
                    }
                    {!this.state.isFavorites &&
                        <IconButton onClick={this.topLike} className={classes.iconButton}>
                            Сортировка по лайкам {this.state.order ? <FavoriteBorderIcon/> : <FavoriteIcon/>}
                        </IconButton>
                    }
                    {this.state.isFavorites &&
                        <IconButton onClick={this.all} className={classes.iconButton}>
                            Все новости
                        </IconButton>
                    }
                    <Box className={classes.news}>
                        {loading ? <LinearProgress/> : news}
                    </Box>
                </Box>
            </React.Fragment>)
    }

}

NewsList.contextType = AuthContext;
export default withStyles(styles)(withRouter(NewsList))
