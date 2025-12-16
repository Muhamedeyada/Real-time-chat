import pool from "../lib/db.js";

class User {
  // Find user by email
  static async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  // Find user by ID
  static async findById(id) {
    const result = await pool.query('SELECT id, email, "fullName", "profilePic", "createdAt", "updatedAt" FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Find all users except the logged-in user
  static async findAllExcept(userId) {
    const result = await pool.query(
      'SELECT id, email, "fullName", "profilePic", "createdAt", "updatedAt" FROM users WHERE id != $1 ORDER BY "fullName"',
      [userId]
    );
    return result.rows;
  }

  // Create new user
  static async create(userData) {
    const { email, fullName, password, profilePic = "" } = userData;
    const result = await pool.query(
      `INSERT INTO users (email, "fullName", password, "profilePic") 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, "fullName", "profilePic", "createdAt", "updatedAt"`,
      [email, fullName, password, profilePic]
    );
    return result.rows[0];
  }

  // Update user
  static async findByIdAndUpdate(id, updateData) {
    const { profilePic } = updateData;
    const result = await pool.query(
      `UPDATE users 
       SET "profilePic" = $1, "updatedAt" = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, email, "fullName", "profilePic", "createdAt", "updatedAt"`,
      [profilePic, id]
    );
    return result.rows[0] || null;
  }
}

export default User;
