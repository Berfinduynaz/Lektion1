import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
});

export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  shortnessOfBreath: integer("shortness_of_breath"),
  cough: integer("cough"),
  phlegmAmount: text("phlegm_amount"),
  phlegmColor: text("phlegm_color"),
  temperature: integer("temperature"),
  pulse: integer("pulse"),
  oxygen: integer("oxygen"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});