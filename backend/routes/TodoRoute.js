import express from "express";
import {
  createTodos,
  deleteTodo,
  getUserFavouriteTodos,
  getUserTodos,
  updateTodo,
} from "../controllers/TodoController.js";
const router = express.Router();

router.route("/").post(createTodos).put(updateTodo);
router.route("/favourite").get(getUserFavouriteTodos);
router.route("/delete/:id").delete(deleteTodo);
router.route("/:userId").get(getUserTodos);

export default router;
