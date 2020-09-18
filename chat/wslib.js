const WebSocket = require("ws");
const fs = require("fs");

const clients = [];
const messages = [];
let jsonArr = [];
let mensajes = "";



const wsConnection = (server) => {  
  
  const wss = new WebSocket.Server({ server });



  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    fs.readFileSync("mensajes.json", "utf-8", (err, data) => {
      if (err) throw err;
      mensajes = data;
      console.log(mensajes);
    });


    ws.on("message", (message) => {
      messages.push(message);
      var date = new Date();
      var timestamp = date.getTime();
      var jsonPai =
        "{" +
        '"message" : "' +
        messages[messages.length - 1] +
        '",' +
        '"Author" : "Santiago Gamboa",' +
        '"ts" : "' +
        timestamp +
        '"' +
        "}";
      jsonArr.push(jsonPai);

      fs.writeFileSync("mensajes.json", "[" + jsonArr + "]", function (err) {
        if (err) throw err;
      });

      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;
