const Sequelize = require("sequelize");
var db = require("../connection/connection");

const users = db.connection.define("users", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  f_name: Sequelize.STRING(50),
  l_name: Sequelize.STRING(50),
  dob: Sequelize.DATEONLY,
  gender: Sequelize.INTEGER,
  marital_status: Sequelize.INTEGER,
  pic: Sequelize.STRING(100),
  video: Sequelize.STRING(100),
  summary: Sequelize.STRING,
  address: Sequelize.STRING,
  city_id: Sequelize.INTEGER,
  state_id: Sequelize.INTEGER,
  country_id: Sequelize.INTEGER,
  phone: Sequelize.STRING(50),
  email: Sequelize.STRING(100),
  password: Sequelize.STRING(50),
  is_reviewed: Sequelize.BOOLEAN,
  is_active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
});

const cities = db.connection.define("cities", {
  name: Sequelize.STRING,
  state_id: Sequelize.INTEGER,
});

const states = db.connection.define("states", {
  name: Sequelize.STRING,
  country_id: Sequelize.INTEGER,
});

const countries = db.connection.define("countries", {
  sortname: Sequelize.STRING,
  name: Sequelize.STRING,
  phonecode: Sequelize.STRING,
});

countries.hasMany(states, {
  foreignKey: {
    fieldName: "country_id",
  },
});

states.hasMany(cities, {
  foreignKey: {
    fieldName: "state_id",
  },
});

cities.belongsTo(states, { foreignKey: "state_id" });

states.belongsTo(countries, { foreignKey: "country_id" });

//Export Candidate Modules
module.exports.users = users;
module.exports.cities = cities;
module.exports.countries = countries;
module.exports.states = states;
