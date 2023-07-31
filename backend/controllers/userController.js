import expressAsyncHandler from "express-async-handler";
import UserDB from "../models/User.js";
import bcrypt from "bcrypt";
import TodoDB from "../models/Todo.js";

// @desc    Register New User
// route    POST  /api/users/register
// @access  Public
const registerUser = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.name || !req?.body?.password || !req?.body?.email) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: "Name, Email and Password are required!" });
  }

  const { name, password, email } = req.body;
  const duplicate = await UserDB.findOne({ name }).exec();
  const confirmDuplicate = await UserDB.findOne({ email }).exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "User with the same name already exists!" });
  }
  if (confirmDuplicate) {
    return res
      .status(409)
      .json({ message: "User with the same email already exists!" });
  }
  const hashedPwd = await bcrypt.hash(password, 10);
  const new_user = new UserDB({
    name,
    email,
    password: hashedPwd,
  });
  new_user.save();
  if (new_user) {
    return res
      .status(201)
      .json({ id: new_user._id, name: new_user.name, email: new_user.email });
  }
});

// @desc    Login  User
// route    POST  /api/users/login
// @access  Public
const loginUser = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.email || !req?.body?.password)
    return res
      .status(400)
      .json({ "error Message": "Email and Password are required!" });
  const { email, password } = req.body;
  const user = await UserDB.findOne({ email }).exec();
  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (user && isPasswordValid) {
    return res
      .status(201)
      .json({ id: user._id, name: user.name, email: user.email });
  } else {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
});

// @desc    logout  User
// route    GET  /api/users/logout
// @access  Public
const logoutUser = expressAsyncHandler(async (req, res) => {
  return res.status(200).json({ message: `User Logged Out!` });
});

// @desc    delete  User
// route    POST  /api/users/delete/:id
// @access  Public
const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  if (!id)
    return res.status(200).json({ message: "User ID is required to delete!" });
  const user = await UserDB.findByIdAndRemove(id);
  if (!user) return res.status(404).json({ message: "User Not Found!" });
  const todos = await TodoDB.deleteMany({ userId: id });
  return res.status(200).json({ message: "User successfully deleted" });
});
export { registerUser, loginUser, logoutUser, deleteUser };
