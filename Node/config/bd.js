const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("database_app", "root", "Poli1234", {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
});


module.exports = sequelize;