const Sequelize = require("sequelize");

const connection = new Sequelize(
  "bsuxgky29gzgp8moorjg",
  "u8q41hgyq7z7jhxoqzqa",
  "R247yGft5VlEvsHf3x0q",
  {
    host: "localhost",
    dialect: "postgres",
    port: "5432",
    define: {
      timestamps: false, //turnoff timestapm
    },
    pool: {
      max: 2,
      min: 0,
      idle: 10000,
    },
  }
);

module.exports.connection = connection;
