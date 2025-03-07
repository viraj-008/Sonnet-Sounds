import mongoose from "mongoose";

const SongTaskIdSchema = new mongoose.Schema({
  // User: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  User: { type: String, required: true }, 
  SongPrompt: { type: String,  },
  TaskId: { type: String, required: true },
  AudioUrl: { type: String, default: "null" },
  createdAt: { type: Date, default: Date.now },
});

export const SongTaskId = mongoose.model("SongTaskId", SongTaskIdSchema);
