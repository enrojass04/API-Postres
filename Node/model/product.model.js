const sequelize = require('../config/bd');

const { Model, DataTypes } = require("sequelize");

class Product extends Model {

}

Product.init({
        codigo: {type:DataTypes.INTEGER, primaryKey:true},
        nombre: DataTypes.STRING,
        sabor: DataTypes.STRING,
        tamano: DataTypes.STRING,
        adicional: DataTypes.STRING,
        precio: DataTypes.DOUBLE(10, 3)
    },
    {
        sequelize, 
        modelName: "Product"
    }
);

module.exports = Product;