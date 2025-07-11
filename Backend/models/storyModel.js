import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "24h",
    default: Date.now,
  },
});

export const Story = mongoose.model("Story", storySchema);
