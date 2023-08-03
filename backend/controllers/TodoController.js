import expressAsyncHandler from "express-async-handler";
import TodoDB from "../models/Todo.js";
import UserDB from "../models/User.js";

const createTodos = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.title || !req?.body?.description || !req?.body?.userId) {
    return res
      .status(400)
      .json({ message: "title, description and userId are required!" });
  }

  const { title, description, userId } = req.body;
  const duplicate = await TodoDB.findOne({ title }).exec();
  const confirmUser = await UserDB.findOne({ _id: userId });
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Todo with the same title already exists!" });
  }
  if (!confirmUser)
    return res.status(400).json({ message: "UserId does not exist" });
  const new_todo = new TodoDB({
    title,
    description,
    userId,
  });
  new_todo.save();
  if (new_todo) {
    return res.status(201).json({
      id: new_todo._id,
      title: new_todo.title,
      description: new_todo.description,
      status: new_todo.status,
    });
  }
});

const getUserTodos = expressAsyncHandler(async (req, res) => {
  if (!req?.params?.userId)
    return res.status(400).json({ message: "UserID is required!" });
  const { userId } = req.params;
  const userTodos = await TodoDB.find({ userId });
  return res.status(200).json({ userTodos });
});

const updateTodo = expressAsyncHandler(async (req, res) => {
  const { id, title, description, status, isFavourite } = req?.body;
  if (!id) return res.status(400).json({ message: "Todo Id is required" });
  if (!title && !description && !isFavourite && !status)
    return res.status(200).json({ message: "Nothing to Update" });

  const todo = await TodoDB.findById(id);
  if (!todo) return res.status(404).json({ message: "Todo Not Found!" });
  if (req.body?.title) todo.title = title;
  if (req.body?.description) todo.description = description;
  if (req.body?.isFavourite) todo.isFavourite = isFavourite;
  if (req.body?.status) {
    todo.status = status;
  }
  const updatedTodo = await todo.save();
  return res.status(200).json(updatedTodo);
});

const getUserFavouriteTodos = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.userId)
    return res.status(400).json({ message: "userId is required!" });
  const { userId } = req.body;
  const favTodos = await TodoDB.find({ userId, isFavourite: true });
  if (!favTodos) return res.status(200).json({ message: "No Favourite Todos" });
  return res.status(200).json({ favTodos });
});
const deleteTodo = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  if (!id)
    return res.status(200).json({ message: "Todo ID is required to delete!" });
  const todo = await TodoDB.findByIdAndRemove(id);
  if (!todo) return res.status(404).json({ message: "Todo Not Found!" });
  return res.status(200).json({ message: "Todo successfully deleted" });
});

export {
  getUserTodos,
  createTodos,
  updateTodo,
  getUserFavouriteTodos,
  deleteTodo,
};
