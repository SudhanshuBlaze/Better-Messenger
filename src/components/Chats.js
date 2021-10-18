import React from "react";
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Chats = () => {
  const didMountRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // { user } data from authentication
  const history = useHistory();

  const handleLogout = async () => {
    await auth.signOut();
    history.push("/");
  };

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob(); // A binary large object (BLOB) is a collection of binary data stored as a single entity. Blobs are typically images, audio or other multimedia objects, though sometimes binary executable code is stored as a blob
    //an array with our data, file name, file type
    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;

      if (!user) {
        history.push("/");
        return;
      }
      //trying to  get the already created user
      axios
        .get("https://api.chatengine.io/users/me/", {
          headers: {
            "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
            "user-name": user.email,
            "user-secret": user.uid,
          },
        })
        .then(() => setLoading(false)) //but if we don't have an already created user-> create user
        .catch(() => {
          // it’s the object to represent HTML form data.
          let formdata = new FormData();
          formdata.append("email", user.email);
          formdata.append("username", user.email);
          formdata.append("secret", user.uid);

          getFile(user.photoURL).then((avatar) => {
            formdata.append("avatar", avatar, avatar.name);
            //create user by sending formdata to server using post request
            axios
              .post("https://api.chatengine.io/users/", formdata, {
                headers: {
                  "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY,
                },
              })
              .then(() => setLoading(false)) //if user creation is sucessful
              .catch((err) => console.log(err));
          });
        });
    }
  }, [user, history]);
  //when we first load the page then 'user' will be undefined as it won't yet be fetched
  if (!user || loading) return <div />;

  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">Better Messenger</div>
        <div className="logout-tab" onClick={handleLogout}>
          Logout
        </div>
      </div>
      <ChatEngine
        height="calc(100vh-66px)"
        projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;
