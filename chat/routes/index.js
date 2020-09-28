var express = require('express');
var router = express.Router();
var wslib = require('../wslib');
const Joi = require("joi");
const fs = require("fs");

const Client = require("../models/client")

router.use(express.json());



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat/api/messages', function(req, res, next) {
  Client.findAll().then(result=>{
    console.log(result);
    res.send(result);
  })
});


router.post("/chat/api/messages", function (req, res, next){
  const { error } = validateClient(req.body);
  if(error){
    return res.status(404).send(error)
  }
      Client.create({message: req.body.message, Author: req.body.Author, ts: req.body.ts}).then(response=>{
        console.log(response);
        if(response === null){
          return res.status(404).send("Message not found");
        }
        res.send(response);
        wslib.sendMessages();
      })
});

router.put("/chat/api/messages/:ts", function (req, res, next){
  const { error } = validateClient(req.body);
  if(error){
    return res.status(404).send(error)
  }
  
  Client.update(req.body, { where: {ts: req.params.ts} }).then(response=>{
    if(response[0] !== 0) res.send(req.body)
    else return res.status(404).send("Message not found");
  })
})

router.get("/chat/api/messages/:ts", (req, res) => {
  Client.findByPk(req.params.id).then(response=>{
    console.log(response);
    res.send(response);
  })

});

router.delete("/chat/api/messages/:ts", function (req, res, next) {
  Client.destroy({where: {ts: req.params.ts}}).then(response=>{
    if(response === 0) return res.status(404).send("Client not found");
    else res.send("Deleted");
  })
});

const validateClient = (client) => {
  const schema = Joi.object({
    message: Joi.string().min(5).required(),
    Author: Joi.string().required(),
    ts: Joi.required(), 
  });

  return schema.validate(client);
};

module.exports = router;
