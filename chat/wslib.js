const WebSocket = require("ws");
const fs = require("fs");

const Client = require("./models/client")
const Joi = require("joi");

const clients = [];
const messages = [];
let jsonArr = [];
let mensajes = "";



const wsConnection = (server) => {  
  
  const wss = new WebSocket.Server({ server });



  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();




    ws.on("message", (message) => {
      messages.push(message);
      let date = new Date();
      let timestamp = date.getTime();

      const { error } = validateClient(message);
      if(error){
        console.log("Error al enviar mensaje");
        //return res.status(404).send(error)
      }
      else{
        Client.create({message: message, Author: "Santiago Gamboa", ts: timestamp}).then(response=>{
          console.log(response);
          if(response === null){
            return console.log("Message not found");
          }
          //message.send(response);
          //wslib.sendMessages();
        })
      }



      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

const validateClient = (msg) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required()
  });

  return schema.validate(msg);
};

exports.wsConnection = wsConnection;
