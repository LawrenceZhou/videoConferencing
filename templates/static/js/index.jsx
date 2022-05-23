import React from 'react';
import ReactDOM from 'react-dom';
import routes from "./routes";
import 'bootstrap/dist/css/bootstrap.min.css';

window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

ReactDOM.render(routes, document.getElementById("content"));
