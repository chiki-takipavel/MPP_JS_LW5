import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import AuthProvider from "./component/AuthProvider/AuthProvider";

ReactDOM.hydrate(
    <AuthProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </AuthProvider>
        ,document.getElementById('root'));
serviceWorker.unregister();
