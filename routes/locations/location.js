const express = require("express");
const router = express.Router();
const models = require("../../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

//GET COUNTRIES DATA
router.get("/countries", (req, res, next) => {
  console.log("Countries API is calling");

  models.countries
    .findAll({})

    .then((c_data) => {
      console.log("Countries Get Successfully", JSON.stringify(c_data));
      res
        .status(200)

        .json({
          data: c_data,
          successful: true,
          message: "Countries Get Successfully",
        });
    })

    .catch(function (err) {
      console.log("Failed to Get Countries: ", err);
      res.status(404).json({
        Successful: false,
        Message: "Countries not Found: " + err,
      });
    });
});

// GET STATES DATA
router.get("/states/:country_id", (req, res, next) => {
  console.log("States API is calling");

  const { country_id } = req.params;

  values = [
    {
      country_id: country_id,
    },
  ];

  models.states
    .findAll({
      where: {
        country_id: values[0].country_id,
      },
    })
    .then((c_data) => {
      if (c_data.length !== 0) {
        console.log("tet", c_data);
        res.status(200).json({
          states: c_data,
          successful: true,
          message: "States Data Get Successfully",
        });
      } else {
        console.log("Failed to Get State Data");
        res
          .status(201)

          .json({
            successful: false,
            message: "States Data Not Found",
          });
      }
    })

    .catch(function (err) {
      console.log("Failed to Get States: ", err);
      res
        .status(404)

        .json({
          successful: false,
          message: "States Data not Found: " + err,
        });
    });
});

//GET CITIES DATA
router.get("/cities/:id", (req, res, next) => {
  console.log("Cities API is calling", req.params.id);

  let states = [];

  values = [
    {
      state_id: req.params.id,
    },
  ];

  console.log(values[0].state_id);

  models.cities
    .findAll({
      where: {
        state_id: values[0].state_id,
      },
    })
    .then((c_data) => {
      console.log("testdata", c_data);
      if (c_data.length !== 0) {
        res.status(200).json({
          cities_data: c_data,
          successful: true,
          message: "Cities Data Get Successfully",
        });
      } else {
        res
          .status(404)

          .json({
            Successful: false,
            Message: "Failed to Get States for Cities",
          });
      }
    })

    .catch(function (err) {
      console.log("Failed to Get Cities: ", err);
      res
        .status(404)

        .json({
          Successful: false,
          Message: "Cities Data not Found: " + err,
        });
    });
});

router.get("/get_country/:id", (req, res, next) => {
  const { id } = req.params;

  models.countries
    .findAll({
      where: {
        id: id,
      },
    })
    .then((data) => {
      if (data.length != 0) {
        console.log("Country Name Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "Country Name Get Successfully",
        });
      } else {
        console.log("No Country Found");
        res.json({
          successful: false,
          message: "No Country Found",
        });
      }
    })
    .catch(function (err) {
      console.log("Failed To Get Country Name: ", err);
      res.json({
        successful: false,
        message: "Failed To Get Country Name: " + err,
      });
    });
});

//Get State Name
router.get("/get_state/:id", (req, res, next) => {
  const { id } = req.params;

  models.states
    .findAll({
      where: {
        id: id,
      },
    })

    .then((data) => {
      if (data.length != 0) {
        console.log("State Name Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "State Name Get Successfully",
        });
      } else {
        console.log("No State Found");
        res.json({
          successful: false,
          message: "No State Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Get State Name: ", err);
      res.json({
        successful: false,
        message: "Failed To Get State Name: " + err,
      });
    });
});

//Get City Name
router.get("/get_city/:id", (req, res, next) => {
  const { id } = req.params;

  models.cities
    .findAll({
      where: {
        id: id,
      },
    })

    .then((data) => {
      if (data.length != 0) {
        console.log("City Name Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "City Name Get Successfully",
        });
      } else {
        console.log("No City Found");
        res.json({
          successful: false,
          message: "No City Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Get City Name: ", err);
      res.json({
        successful: false,
        message: "Failed To Get City Name: " + err,
      });
    });
});

module.exports = router;
