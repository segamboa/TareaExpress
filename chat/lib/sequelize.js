const { Module } = require("module");
const {Sequelize} = require("sequelize");
const sequelize = new Sequelize("database", "","",{
    dialect: "sqlite", 
    storage: "./database/database.sqlite"
});

sequelize.authenticate().then(res=>{
    console.log("Connected!")
}).catch((err)=>{
    console.log(err);
})

module.exports = sequelize;