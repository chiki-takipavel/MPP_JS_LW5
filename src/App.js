import React from 'react';
import Navbar from "./component/navbar/Navbar";
import {Routes} from "./constant/Routes";
import Registration from "./component/AuthComponents/Register";
import {AuthContext} from "./component/AuthProvider/AuthProvider";
import Login from "./component/AuthComponents/Login";
import {ApolloProvider} from '@apollo/client'
import ApolloClient from 'apollo-client';
import {endpoints} from "./constant/endpoints";
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {createUploadLink} from "apollo-upload-client";
import Footer from "./component/footer/Footer";
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import NewsList from "./component/news/NewsList";
import CreateNews from "./component/news/CreateNews";
import classNames from "classnames"
import './App.css'
import './styles.css'

const httpLink = createUploadLink({
    uri: endpoints.graphql,
    headers: {
        "keep-alive": "true"
    }
});

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('Jwt token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

class App extends React.Component {
    classes = classNames("App","casing", "casing__body")
    render() {
        return (
            <ApolloProvider client={client}>
            <BrowserRouter>
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
                        <Redirect to={Routes.news}/>
                    </Switch>
                }
                <Footer/>
            </div>
            </BrowserRouter>
            </ApolloProvider>
        );
    }
}
App.contextType = AuthContext;
export default App
