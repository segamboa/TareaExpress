var express = require('express');
var router = express.Router();
var wslib = require('../mensajes.json');
const Joi = require("joi");
const fs = require("fs");


router.use(express.json());


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/chat/api/messages", (req, res) => {
  let mensajes = "";
  fs.readFile("./mensajes.json", "utf-8", (err, data) => {
    if (err) throw err;
    mensajes=data;
    console.log(mensajes);
    res.send(mensajes);
  });


});

router.get("/chat/api/messages/:ts", (req, res) => {
  let mensajes = wslib;
  const msj = mensajes.find((c) => c.ts === req.params.ts);
  console.log(msj);
  if (!msj)
    return res.status(404).send("The client with the given ts was not found.");
  res.send(msj);
});

router.post("/chat/api/messages", (req, res) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    Author: Joi.string().required(), 
    ts: Joi.required(), 
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send(error);
  }

  const client = {
    message: req.body.message,
    Author: req.body.Author,
    ts: req.body.ts
  };  
  let a = wslib;
  a.push(client);
  console.log(a);

  fs.writeFileSync("./mensajes.json", JSON.stringify(a), function (err) {
    if (err) throw err;
  });

  res.send(client);
});


router.put("/chat/api/messages", (req, res) => {
  let mensajes = wslib;
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    Author: Joi.string().required(),
    ts: Joi.required(), 
  });

  const { error } = schema.validate(req.body);
  let ret ="";
  if (error) {
    return res.status(400).send(error);
  }

  const client = {
    message: req.body.message,
    Author: req.body.Author,
    ts: req.body.ts
  };

  fs.readFile("./mensajes.json", "utf-8", (err, data) => {
    if (err) throw err;
    mensajes = JSON.parse(data);
    const msj = mensajes.find((c) => {
      return c.ts === client.ts
    });
    if(!msj){
      return res.status(404).send("The client with the given ts was not found.");
    }
    else{
      console.log("Mierda cabrom"+msj.message);
      ret=JSON.stringify(mensajes).replace(JSON.stringify(msj), JSON.stringify(client));
      //mensajes=ret;
      console.log(ret);
      fs.writeFileSync("./mensajes.json", ret, function (err) {
        if (err) throw err;
      });
    }
  
  
    res.send(client);

  });

});

router.delete("/chat/api/messages/:ts", (req, res) => {
  fs.readFile("./mensajes.json", "utf-8", (err, data) => {
    if (err) throw err;
    mensajes = JSON.parse(data);
    //console.log(mensajes);
    const msj = mensajes.find((c) => {
      return c.ts === req.params.ts
    });
    if(!msj){
      return res.status(404).send("The client with the given ts was not found.");
    }
    else{
      const index = mensajes.indexOf(msj);
      console.log(index);
      mensajes.splice(index,1);

      fs.writeFileSync("./mensajes.json", JSON.stringify(mensajes), function (err) {
        if (err) throw err;
      });
      //mensajes=ret;
      //console.log(ret);
    }
  
  
    res.send(msj);


});

  
});






module.exports = router;
