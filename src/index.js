import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

document.getElementsByTagName('head')[0].innerHTML += '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">';

document.getElementsByTagName('head')[0].innerHTML += '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">';

// Now we can render our application into it
render( <App />, document.getElementById('root') );
