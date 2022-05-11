const express = require("express");
const router = express.Router();
const models = require("../../models/models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require("../../middleware/auth");
const {
  saltRounds,
  accessTokenSecret,
  smtpTransport,
} = require("../../config");
const multer = require("multer");
const nodemailer = require("nodemailer");
var randomstring = require("randomstring");

//User Register
router.post("/register", async (req, res, next) => {
  console.log("runnings.... register");
  let otp = randomstring.generate(4);
  let hashed_pass = "";
  await bcrypt.hash(req.body.r_data.password, saltRounds).then((hash) => {
    hashed_pass = hash;
  });
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "rayan@flux.pk",
      pass: "Ahsan1234",
    },
  });
  values = [
    {
      f_name: req.body.r_data.f_name,
      l_name: req.body.r_data.l_name,
      email: req.body.r_data.email,
      password: hashed_pass,
      is_reviewed: "TRUE",
      is_active: "TRUE",
      created_at: new Date().toISOString(),
    },
  ];
  console.log(values);
  console.log(otp);
  let mailOptions = {
    from: "info@flux.pk",
    to: values[0].email,
    subject: "OTP",
    text: otp,
  };
  await models.users
    .findAll({
      where: {
        email: values[0].email,
      },
    })
    .then((data) => {
      if (data.length !== 0) {
        console.log("Email already exists");
        res.json({
          successful: false,
          message: "Email already exists",
        });
      } else {
        models.users
          .bulkCreate(values)
          .then((x) => {
            if (x.length !== 0) {
              console.log("User Registered Successfully");
              const accessToken = jwt.sign(
                {
                  successful: true,
                  message: "User Registered Successfully",
                  data: x[0],
                },
                accessTokenSecret
              );
              new_values = [
                {
                  candidate_id: x[0].id,
                  created_at: new Date().toISOString(),
                },
              ];
              models.desired_careers.bulkCreate(new_values);
              res.json({
                successful: true,
                message: "User Registered Successfully",
                data: x[0],
                otp: otp,
                accessToken: accessToken,
              });
            }
          })
          .catch(function (err) {
            console.log("Failed to Register User: ", err);
            res.json({
              successful: false,
              message: "Failed to Register User: " + err,
            });
          });
      }
    })
    .catch(function (err) {
      console.log("Request Data is Empty: ", err);
      res.json({
        successful: false,
        message: "Request Data is Empty: " + err,
      });
    });
});

module.exports = router;
