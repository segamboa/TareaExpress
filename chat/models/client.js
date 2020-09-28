const{Model, DataTypes} =require("sequelize");
const sequelize = require("../lib/sequelize");

class Client extends Model{}

Client.init(
    {
        message:{
            type: DataTypes.STRING,
            allowNull: false
        },
        Author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ts:{
            type: DataTypes.DOUBLE,
            allowNull:false
        }
    },
    {
        sequelize,
        modelName: "Client"
    }
);

Client.sync();

module.exports= Client;