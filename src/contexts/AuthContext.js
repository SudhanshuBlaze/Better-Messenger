import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const AuthContext = React.createContext();
// custom hook-> this function is used to grab the AuthContext using 'useContext' Hook
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    // On successful authentication-> we get the 'user'
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      //   using react-router-dom we redirect our application to "/chats"
      if (user) history.push("/chats");
    });
  }, [user, history]);

  const value = { user };

  return (
    /*react context is a one big object which contains all the data(here: user data)
    and it wraps all the children component,
    provides value(here: user data) to all the children component*/
    <AuthContext.Provider value={value}>
      {/* if not loading then show the children */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
