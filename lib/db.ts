import { connect, Connection, connection } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI!;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDB = async (): Promise<Connection> => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connect(MONGODB_URI, {
      maxPoolSize: 10,
      bufferCommands: true,
    }).then(() => connection);
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};
