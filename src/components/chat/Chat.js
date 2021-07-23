import axios from "axios";
import GoogleMapReact from "google-map-react";

import React, { useState } from "react";

const location = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
};

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [chatConversation, setChatConversation] = useState([
    { text: "Bonjour que puis je faire pour vous?", type: "bot" },
    { text: "Posez moi une question", type: "bot" },
  ]);

  // EVENT HANDLER
  const sendMessageOne = (event) => setQuestion(event.target.value);
  const sendQuestionOne = async () => {
    try {
      let formData = new FormData();
      let myUrl = "http://localhost:5000/processing";
      formData.append("question1", question);
      const sendData = await axios({
        method: "post",
        url: myUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(sendData.data.wikipedia);
      const obj = JSON.parse(sendData.data);
      console.log("obj", obj);
      let emptyArr = [...chatConversation];

      emptyArr.push(
        { text: question, type: "human" },
        {
          text: obj.result,
          type: "bot",
          lat: obj.lat,
          lng: obj.lng,
        }
      );
      setChatConversation(emptyArr);
      setQuestion("");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="boxChat">
      <div className="lightAreaChat">
        {chatConversation.map((text, id) => {
          return (
            <div key={id}>
              {text.type === "bot" ? (
                <>
                  {text.lng ? (
                    <div style={{ height: "200px", width: "100%" }}>
                      <GoogleMapReact
                        apiKey="AIzaSyCFRB_ipsZztDSGoRwKOsnhXiWOKzi2YyU"
                        defaultCenter={{ lat: text.lat, lng: text.lng }}
                        defaultZoom={location.zoom}
                      ></GoogleMapReact>
                    </div>
                  ) : null}
                  <div className="conversationBot">Bot 👴 : {text.text}</div>
                </>
              ) : (
                <div className="conversation">Humain 👱‍♂️👩‍🦱 : {text.text}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="searchAreaChat">
        <input
          type="text"
          className="inputTextChat"
          onChange={sendMessageOne}
          value={question}
        />
        <input
          type="button"
          value="submit"
          className="inputSubmitChat"
          onClick={sendQuestionOne}
        />
      </div>
    </div>
  );
};

export default Chat;
