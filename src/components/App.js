import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "../contexts/AuthContext";

import Chats from "./Chats";
import Login from "./Login";

function App() {
  return (
    <div style={{ fontFamily: "Avenir" }}>
      <Router>
        {/* this AuthProvider handles the entire application state */}
        <AuthProvider>
          <Switch>
            <Route path="/chats" component={Chats} />
            <Route path="/" component={Login} />
            {/* note: path="/" need to be kept at last as switch renders the first match
            we could have also used "exact" property as it will display the component
            when there is exact path match */}
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
