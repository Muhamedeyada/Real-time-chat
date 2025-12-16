import pool from "../lib/db.js";

class Message {
  // Find messages between two users
  static async findConversation(senderId, receiverId) {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE ("senderId" = $1 AND "receiverId" = $2) 
          OR ("senderId" = $2 AND "receiverId" = $1) 
       ORDER BY "createdAt" ASC`,
      [senderId, receiverId]
    );
    return result.rows;
  }

  // Create new message
  static async create(messageData) {
    const { senderId, receiverId, text, image } = messageData;
    const result = await pool.query(
      `INSERT INTO messages ("senderId", "receiverId", text, image) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [senderId, receiverId, text || null, image || null]
    );
    return result.rows[0];
  }

  // Find message by ID (for socket.io)
  static async findById(id) {
    const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
}

export default Message;
