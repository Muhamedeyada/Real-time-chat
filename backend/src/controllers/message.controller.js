import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await User.findAllExcept(loggedInUserId);

    // Format response to match frontend expectations (use _id instead of id)
    const formattedUsers = filteredUsers.map(user => ({
      _id: user.id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const messages = await Message.findConversation(parseInt(myId), parseInt(userToChatId));

    // Format response to match frontend expectations (use _id instead of id)
    const formattedMessages = messages.map(message => ({
      _id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      text: message.text,
      image: message.image,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId: parseInt(senderId),
      receiverId: parseInt(receiverId),
      text,
      image: imageUrl,
    });

    // Format response to match frontend expectations (use _id instead of id)
    const formattedMessage = {
      _id: newMessage.id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      text: newMessage.text,
      image: newMessage.image,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    };

    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", formattedMessage);
    }

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
