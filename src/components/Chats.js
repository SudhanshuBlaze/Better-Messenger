import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Chats = () => {
  const history = useHistory();
  const { user } = useAuth(); // { user } data from authentication
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await auth.signOut();
    history.push("/");
  };

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = response.blob(); // A binary large object (BLOB) is a collection of binary data stored as a single entity. Blobs are typically images, audio or other multimedia objects, though sometimes binary executable code is stored as a blob
    //an array with our data, file name, file type
    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };
  useEffect(() => {
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

// import React, { useRef, useState, useEffect } from "react";

// import axios from "axios";
// import { useHistory } from "react-router-dom";
// import { ChatEngine } from "react-chat-engine";

// import { useAuth } from "../contexts/AuthContext";

// import { auth } from "../firebase";

// export default function Chats() {
//   const didMountRef = useRef(false);
//   const [loading, setLoading] = useState(true);
//   const { user } = useAuth();
//   const history = useHistory();

//   async function handleLogout() {
//     await auth.signOut();
//     history.push("/");
//   }

//   async function getFile(url) {
//     let response = await fetch(url);
//     let data = await response.blob();
//     return new File([data], "test.jpg", { type: "image/jpeg" });
//   }

//   useEffect(() => {
//     if (!didMountRef.current) {
//       didMountRef.current = true;

//       if (!user || user === null) {
//         history.push("/");
//         return;
//       }

//       // Get-or-Create should be in a Firebase Function
//       axios
//         .get("https://api.chatengine.io/users/me/", {
//           headers: {
//             "project-id": process.env.REACT_APP_CHAT_ENGINE_ID,
//             "user-name": user.email,
//             "user-secret": user.uid,
//           },
//         })

//         .then(() => setLoading(false))

//         .catch((e) => {
//           let formdata = new FormData();
//           formdata.append("email", user.email);
//           formdata.append("username", user.email);
//           formdata.append("secret", user.uid);

//           getFile(user.photoURL).then((avatar) => {
//             formdata.append("avatar", avatar, avatar.name);

//             axios
//               .post("https://api.chatengine.io/users/", formdata, {
//                 headers: {
//                   "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY,
//                 },
//               })
//               .then(() => setLoading(false))
//               .catch((e) => console.log("e", e.response));
//           });
//         });
//       // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     }
//   }, [user, history]);

//   if (!user || loading) return <div />;

//   return (
//     <div className="chats-page">
//       <div className="nav-bar">
//         <div className="logo-tab">Unichat</div>

//         <div onClick={handleLogout} className="logout-tab">
//           Logout
//         </div>
//       </div>

//       <ChatEngine
//         height="calc(100vh - 66px)"
//         projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
//         userName={user.email}
//         userSecret={user.uid}
//       />
//     </div>
//   );
// }
