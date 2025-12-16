import pkg from "pg";
const { Pool } = pkg;

let pool = null;

const createPoolConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    host: (process.env.DB_HOST || "localhost").trim(),
    port: parseInt(process.env.DB_PORT) || 5432,
    database: (process.env.DB_NAME || "chat_app").trim(),
    user: (process.env.DB_USER || "postgres").trim(),
    password: String(process.env.DB_PASSWORD || "").trim(),
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  };
};

export const connectDB = async () => {
  try {
    if (!pool) {
      pool = new Pool(createPoolConfig());
      pool.on("error", (err) => {
        console.error("Unexpected error on idle client", err);
        process.exit(-1);
      });
    }

    const client = await pool.connect();
    client.release();
    await createTables();
  } catch (error) {
    console.error("PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        "fullName" VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        "profilePic" TEXT DEFAULT '',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        "senderId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "receiverId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT,
        image TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages("senderId")`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages("receiverId")`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages("senderId", "receiverId")`);
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
};

const getPool = () => {
  if (!pool) {
    pool = new Pool(createPoolConfig());
  }
  return pool;
};

export default {
  get query() { return getPool().query.bind(getPool()); },
  get connect() { return getPool().connect.bind(getPool()); },
  get end() { return getPool().end.bind(getPool()); },
  get on() { return getPool().on.bind(getPool()); },
  get off() { return getPool().off.bind(getPool()); },
};
