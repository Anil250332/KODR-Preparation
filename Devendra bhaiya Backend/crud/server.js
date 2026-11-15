const express = require("express");
const connectDB = require("./config/db");
const UserModel = require("./models/user.model");

const app = express();

connectDB();

// middleware for accepting body data in json format
app.use(express.json());

// 1. create user

let users = [];

app.post("/create", async (req, res) => {
  let { name, email, password } = req.body;

  let user = await UserModel.create({
    name,
    email,
    password,
  });

  return res.status(201).json({
    success: true,
    message: "User created",
    data: user,
  });
});

app.get("/users", async (req, res) => {
  let allUsers = await UserModel.find();

  return res.status(200).json({
    success: true,
    message: "User fetched",
    data: allUsers,
  });
});

app.delete("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;

    await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.put("/update/:id", async (req, res) => {
  let id = req.params.id;

  let updatesUser = await UserModel.findByIdAndUpdate(id, req.body, {new:true});

  return res.status(200).json({
    message: "User updated",
    success: true,
    data: updatesUser,
  });
});

// 2. get user
// 3. update user
// 4. delete user

app.listen(3000, () => {
  console.log("server is runnign on port 3000");
});
