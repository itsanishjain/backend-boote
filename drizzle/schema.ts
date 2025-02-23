import { sql, relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").unique(),
  email: text("email").unique(),
  last_login: integer("last_login"),
  is_active: integer("is_active").default(1),
  expo_push_token: text("expo_push_token"),
  platform: text("platform"),
  created_at: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  name: text("name"),
  type: text("type"),
  icon: text("icon"),
  created_at: integer("created_at"),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  room_id: text("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  name: text("name"),
  frequency_value: integer("frequency_value"),
  frequency_unit: text("frequency_unit"),
  effort: integer("effort"),
  current_state: integer("current_state"),
  is_completed: integer("is_completed").default(0),
  last_completed_at: integer("last_completed_at"),
  created_at: integer("created_at"),
  points: integer("points").default(0),
  streak: integer("streak").default(0),
});

export const userStats = sqliteTable("user_stats", {
  id: text("id").primaryKey().default("default"),
  current_streak: integer("current_streak").default(0),
  longest_streak: integer("longest_streak").default(0),
  total_points: integer("total_points").default(0),
  last_activity_date: integer("last_activity_date"),
  tasks_completed: integer("tasks_completed").default(0),
  early_bird_tasks: integer("early_bird_tasks").default(0),
  unique_room_types: integer("unique_room_types").default(0),
  perfect_days: integer("perfect_days").default(0),
  rooms_created: integer("rooms_created").default(0),
  tasks_completed_today: integer("tasks_completed_today").default(0),
  total_scheduled_tasks_today: integer("total_scheduled_tasks_today").default(
    0
  ),
  weekly_completion_rate: integer("weekly_completion_rate").default(0),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  unlocked_at: integer("unlocked_at"),
});

export const earlyBirdCompletions = sqliteTable("early_bird_completions", {
  id: text("id").primaryKey(),
  task_id: text("task_id").references(() => tasks.id),
  completed_at: integer("completed_at"),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  room: one(rooms, {
    fields: [tasks.room_id],
    references: [rooms.id],
  }),
}));

export const roomsRelations = relations(rooms, ({ many }) => ({
  tasks: many(tasks),
}));
