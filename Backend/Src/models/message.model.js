import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true, // Removes extra spaces from messages
    },
    image: {
      type: String,
      default: null, // Set default value to avoid undefined errors
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Create and export the Message model
const Message = mongoose.model("Message", messageSchema);
export default Message;
