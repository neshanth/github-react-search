import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GithubProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";

// dev-7jmx7wf15ryw5n3m.us.auth0.com
// yYPDzdx7d46pte1EpPktt9LLbw9Ej7JE

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider cacheLocation="localstorage" domain="dev-7jmx7wf15ryw5n3m.us.auth0.com" clientId="yYPDzdx7d46pte1EpPktt9LLbw9Ej7JE" redirectUri={window.location.origin}>
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
