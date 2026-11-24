import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import logo from './assets/logo.jpeg';

// Set favicon dynamically from bundled src asset so public/logo.jpeg isn't required
const setFavicon = (href) => {
    try {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = href;
    } catch (e) {
        // ignore in non-DOM environments
    }
};

setFavicon(logo);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);