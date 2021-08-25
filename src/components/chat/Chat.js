import axios from "axios";
import GoogleMapReact from "google-map-react";

import React, { useState, useEffect, useRef } from "react";

import Loader from "react-loader-spinner";

import marker from "../../ressources/images/marker.png";

import KeyboardEventHandler from "react-keyboard-event-handler";

const AnyReactComponent = ({ text }) => (
  <div style={{ color: "red", fontSize: "20px" }}>
    {text}{" "}
    <img src={marker} alt="marker element on map" style={{ width: "30px" }} />
  </div>
);

const Chat = () => {
  const messageRef = useRef();
  const [question, setQuestion] = useState("");
  const [deactivateSubmitButton, setDeactivateSubmitButton] = useState(false);

  const [chatConversation, setChatConversation] = useState([
    { text: "Bonjour que puis je faire pour vous?", type: "bot" },
    { text: "Posez moi une question", type: "bot" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  });

  // EVENT HANDLER
  const sendMessageOne = (event) => {
    setQuestion(event.target.value);
  };
  const sendQuestionOne = async () => {
    try {
      setDeactivateSubmitButton(true);
      setIsLoading(true);
      let formData = new FormData();
      let myUrl = "https://akakakaak.herokuapp.com/processing";
      // let myUrl = "http://192.168.1.58:5000/processing";
      formData.append("question1", question);
      const sendData = await axios({
        method: "post",
        url: myUrl,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(sendData.data.wikipedia);
      const obj = JSON.parse(sendData.data);
      // console.log("obj", obj);
      let emptyArr = [...chatConversation];
      // console.log(obj);

      emptyArr.push(
        { text: question, type: "human" },
        {
          text: obj.result,
          type: "bot",
          lat: obj.lat,
          lng: obj.lng,
          url: obj.url,
          adress: obj.destination,
        }
      );
      setChatConversation(emptyArr);
      setQuestion("");
      setIsLoading(false);
      setDeactivateSubmitButton(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
      setDeactivateSubmitButton(false);
    }
  };

  return (
    <div className="boxChat">
      <div className="lightAreaChat">
        {chatConversation.map((text, id) => {
          return (
            <div key={id} ref={messageRef}>
              <KeyboardEventHandler
                handleKeys={["Enter"]}
                onKeyEvent={(key, e) => {
                  if (question.length > 0) {
                    sendQuestionOne();
                  }
                }}
              />
              {text.type === "bot" ? (
                <>
                  {text.adress ? (
                    <div className="conversationBot">
                      <br /> <p> Bot 👴 : l'adresse est {text.adress}</p>
                    </div>
                  ) : null}

                  {text.lng ? (
                    <div style={{ height: "200px", width: "100%" }}>
                      <GoogleMapReact
                        apiKey="AIzaSyCFRB_ipsZztDSGoRwKOsnhXiWOKzi2YyU"
                        defaultCenter={{ lat: text.lat, lng: text.lng }}
                        defaultZoom={14}
                        options={{ scrollwheel: false }}
                      >
                        <AnyReactComponent lat={text.lat} lng={text.lng} />
                      </GoogleMapReact>
                    </div>
                  ) : null}

                  <div className="conversationBot">
                    Bot 👴 : {text.text}{" "}
                    {text.url ? (
                      <div>
                        <br />
                        pour en savoir davantage, cliquez ici pour accéder au
                        lien wikipedia{" "}
                        <a href={text.url} target="_blank" rel="noreferrer">
                          {" "}
                          ICI{" "}
                        </a>{" "}
                      </div>
                    ) : null}
                  </div>
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
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              if (question.length > 0) {
                sendQuestionOne();
              }
            }
          }}
        />
        <input
          type="button"
          value="submit"
          className="inputSubmitChat"
          disabled={deactivateSubmitButton}
          onClick={() => {
            if (question.length > 0) {
              sendQuestionOne();
            }
          }}
        />
        {isLoading ? (
          <Loader
            type="Circles"
            color="#00BFFF"
            height={30}
            width={30}
            timeout={30000} //3 secs
          />
        ) : null}
      </div>
    </div>
  );
};

export default Chat;
