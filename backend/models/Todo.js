import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Todo", TodoSchema);
