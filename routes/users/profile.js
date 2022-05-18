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

//Candidate Login
router.post("/login", (req, res, next) => {
  console.log("runnings.... login");
  values = [
    {
      email: req.body.l_data.email,
      password: req.body.l_data.password,
    },
  ];

  models.users
    .findAll({
      where: {
        email: values[0].email,
      },
    })
    .then(
      async (data) => {
        if (data.length > 0) {
          let password_check = await bcrypt.compare(
            req.body.l_data.password,
            data[0].password
          );
          if (password_check) {
            const accessToken = jwt.sign(
              {
                successful: true,
                message: "User Login Successfully",
                data: data[0],
              },
              accessTokenSecret
            );
            res.json({
              successful: true,
              message: "User Login Successfully",
              data: data[0],
              accessToken: accessToken,
            });
          } else {
            res.json({ status: "error", msg: "password does not match" });
          }
        } else {
          res.json({ status: "error", msg: "email does not exist" });
        }
      },
      (error) => {
        console.log(error);
        res.json({ status: "error" });
      }
    );
});

// Get Auth
router.get("/getauth", authenticateJWT, (req, res) => {
  console.log("Login Success", req.user);
  res.json(req.user);
});

//User Password Reset
router.post("/passwordreset", authenticateJWT, async (req, res, next) => {
  let hashed_pass = "";
  await bcrypt.hash(req.body.pr_data.password, saltRounds).then((hash) => {
    hashed_pass = hash;
  });
  values = [
    {
      id: req.body.pr_data.id,
      password: hashed_pass,
    },
  ];
  models.users
    .findAll({
      where: {
        id: values[0].id,
      },
    })
    .then((data) => {
      if (data.length != 0) {
        models.users
          .update(
            {
              password: values[0].password,
            },
            {
              where: {
                id: values[0].id,
              },
            }
          )
          .then(() => {
            res.json({
              status: "success",
              successful: true,
              message: "Password Reset Successfully",
            });
          })
          .catch(function (err) {
            console.log(err);
            res.json({
              message: "Failed to Reset Password" + err,
              successful: false,
            });
          });
      } else {
        console.log("Email does not exist");
        res.json({
          successful: false,
          message: "Email does not exist",
        });
      }
    })
    .catch(function (err) {
      console.log(err);
      res.json({
        message: "Failed" + err,
        successful: false,
      });
    });
});

//Update Profile
router.post("/update_profile", async (req, res, next) => {
  console.log(req.body.data);
  values = [
    {
      id: req.body.data.id,
      f_name: req.body.data.f_name,
      l_name: req.body.data.l_name,
      dob: req.body.data.dob,
      gender: req.body.data.gender,
      marital_status: req.body.data.marital_status,
      address: req.body.data.address,
      city_id: req.body.data.city_id,
      state_id: req.body.data.state_id,
      country_id: req.body.data.country_id,
      phone: req.body.data.phone,
      email: req.body.data.email,
    },
  ];
  await models.users
    .update(
      {
        f_name: values[0].f_name,
        l_name: values[0].l_name,
        dob: values[0].dob,
        gender: values[0].gender,
        marital_status: values[0].marital_status,
        address: values[0].address,
        city_id: values[0].city_id,
        state_id: values[0].state_id,
        country_id: values[0].country_id,
        phone: values[0].phone,
        email: values[0].email,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          id: values[0].id,
        },
        returning: true,
        plain: true,
        exclude: ["password", "created_at", "updated_at"],
      }
    )
    .then((data) => {
      const accessToken = jwt.sign(
        {
          successful: true,
          message: "User Profile Updated Successfully",
          data: data[1].dataValues,
        },
        accessTokenSecret
      );
      console.log("data[1].dataValues", data[1].dataValues);
      res.json({
        successful: true,
        message: "Successful",
        data: data[1].dataValues,
        accessToken,
      });
    })
    .catch(function (err) {
      console.log(err);
      res.json({
        message: "Failed" + err,
        successful: false,
      });
    });
});

// Update Profile Pic
router.post("/update_profile_pic", async (req, res, next) => {
  console.log(req.body.data);
  values = [
    {
      id: req.body.data.id,
      pic: req.body.data.pic,
    },
  ];
  await models.users
    .update(
      {
        pic: values[0].pic,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          id: values[0].id,
        },
        returning: true,
        plain: true,
        exclude: ["password", "created_at", "updated_at"],
      }
    )
    .then((data) => {
      const accessToken = jwt.sign(
        {
          successful: true,
          message: "User Profile Updated Successfully",
          data: data[1].dataValues,
        },
        accessTokenSecret
      );
      res.json({
        successful: true,
        message: "Successful",
        data: data[1].dataValues,
        accessToken,
      });
    })
    .catch(function (err) {
      console.log(err);
      res.json({
        message: "Failed" + err,
        successful: false,
      });
    });
});

//Setup Storage Folder
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./profile-images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//Upload Profile Picture
var upload = multer({ storage: storage }).single("file");
router.post("/profilepic", function (req, res) {
  console.log("Req:", req);
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.json(err);
    } else if (err) {
      return res.json(err);
    }
    return res.send(req.file);
  });
});

// Update User Status
router.post("/update_user_status", async (req, res, next) => {
  console.log(req.body.data);
  values = [
    {
      id: req.body.data.id,
      is_active: req.body.data.is_active,
    },
  ];
  await models.users
    .update(
      {
        is_active: values[0].is_active,
        updated_at: new Date().toISOString(),
      },
      {
        where: {
          id: values[0].id,
        },
        returning: true,
        plain: true,
        exclude: ["password", "created_at", "updated_at"],
      }
    )
    .then((data) => {
      const accessToken = jwt.sign(
        {
          successful: true,
          message: "User Status Updated Successfully",
          data: data[1].dataValues,
        },
        accessTokenSecret
      );
      // console.log("val", val);
      res.json({
        successful: true,
        message: "Successful",
        data: data[1].dataValues,
        accessToken,
      });
    })
    .catch(function (err) {
      console.log(err);
      res.json({
        message: "Failed" + err,
        successful: false,
      });
    });
});

//Get All Users
router.get("/get_all_users", (req, res, next) => {
  console.log("Get All Users API calling");

  models.users
    .findAll({
      include: [],
      where: {
        is_reviewed: "true",
      },
    })
    .then((data) => {
      if (data.length != 0) {
        console.log("Users Get Successfully");
        res.json({
          data: data,
          successful: true,
          message: "Users Get Successfully",
        });
      } else {
        console.log("No Users Found");
        res.json({
          successful: false,
          message: "No Users Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Get Users: ", err);
      res.json({
        successful: false,
        message: "Failed To Get Users: " + err,
      });
    });
});

router.get("/delete_user/:id", (req, res, next) => {
  const { id } = req.params;

  models.users
    .destroy({
      where: {
        id: id,
      },
    })

    .then((data) => {
      if (data.length != 0) {
        console.log("User Deleted Successfully");
        res.json({
          data: data,
          successful: true,
          message: "User Deleted Successfully",
        });
      } else {
        console.log("No User Found");
        res.json({
          successful: false,
          message: "No User Found",
        });
      }
    })

    .catch(function (err) {
      console.log("Failed To Delete User: ", err);
      res.json({
        successful: false,
        message: "Failed To Delete User: " + err,
      });
    });
});

// GET USER DATA
router.get("/user/:id", (req, res, next) => {
  console.log("Get User API is calling");

  const { id } = req.params;

  values = [
    {
      user_id: id,
    },
  ];

  models.users
    .findAll({
      where: {
        id: values[0].user_id,
      },
    })
    .then((c_data) => {
      if (c_data.length !== 0) {
        console.log("tet", c_data);
        res.status(200).json({
          states: c_data,
          successful: true,
          message: "User Data Get Successfully",
        });
      } else {
        console.log("Failed to Get User Data");
        res
          .status(201)

          .json({
            successful: false,
            message: "User Data Not Found",
          });
      }
    })

    .catch(function (err) {
      console.log("Failed to Get User: ", err);
      res
        .status(404)

        .json({
          successful: false,
          message: "User Data not Found: " + err,
        });
    });
});

module.exports = router;
