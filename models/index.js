const Sequelize = require('sequelize');
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
require('dotenv').config();

const dbConfig = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    define: {
        timestamps: false // globally disable createdAt and updateAt for all models, I struggled with unwanted columns.
    }
    // TODO dialectModel: process.env.DIALECTMODEL
};

const sequelize = new Sequelize(dbConfig);


const db = {};



fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) &&
            (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize,
            Sequelize.DataTypes);
        db[model.name] = model;
        console.log(db) // TODO DELETE 
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db