import React from 'react';
import './App.css';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Navbar from "./component/navbar/Navbar";
import NewsList from "./component/news/NewsList";
import {Routes} from "./constant/Routes";
import CreateNews from "./component/news/CreateNews";
import Login from "./component/AuthComponents/Login";
import Registration from "./component/AuthComponents/Register";
import classNames from "classnames"
import './styles.css'
import Footer from "./component/footer/Footer";
import {AuthContext} from "./component/AuthProvider/AuthProvider";
import {socket} from "./service/requestService";

class App extends React.Component {
    componentWillUnmount() {
        socket.close()
    }

    classes = classNames("App","casing", "casing__body")
    render() {
        return (
            <div className={this.classes}>
                <Navbar/>
                {this.context.currentUser ?
                    <Switch>
                        <Route exact path={Routes.newsCreate} component={CreateNews}/>
                        <Route exact path={Routes.news} component={NewsList}/>
                        <Route exact path={Routes.login} component={Login}/>
                        <Route exact path={Routes.registration} component={Registration}/>
                        <Redirect to={Routes.news}/>
                    </Switch>
                    :
                    <Switch>
                        <Route exact path={Routes.news} component={NewsList}/>
                        <Route exact path={Routes.login} component={Login}/>
                        <Route exact path={Routes.registration} component={Registration}/>
                        <Redirect to={Routes.login}/>
                    </Switch>
                }
                <Footer/>
            </div>
        );
    }
}
App.contextType = AuthContext;
export default withRouter(App)
