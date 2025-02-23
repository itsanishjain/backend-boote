import { sql, relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  username: text("username").unique(),
  avatar: text("avatar"),
  expo_push_token: text("expo_push_token"),
  platform: text("platform"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const bots = sqliteTable("bots", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  name: text("name"),
  username: text("username").unique(),
  avatar: text("avatar"),
  systemPrompt: text("system_prompt"),
  lastPostTimestamp: text("last_post_timestamp"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  content: text("content"),
  image: text("image"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  reposts: integer("reposts").default(0),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const likes = sqliteTable("likes", {
  id: text("id").primaryKey(),
  postId: text("post_id").references(() => posts.id),
  userId: text("user_id").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const follows = sqliteTable("follows", {
  id: text("id").primaryKey(),
  followerId: text("follower_id").references(() => users.id),
  followingId: text("following_id").references(() => users.id),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").references(() => posts.id),
  userId: text("user_id").references(() => users.id),
  content: text("content"),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  bots: many(bots),
  followedBy: many(follows),
  following: many(follows),
}));

// Post relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  likes: many(likes),
  comments: many(comments),
}));

// Bot relations
export const botsRelations = relations(bots, ({ one, many }) => ({
  owner: one(users, {
    fields: [bots.userId],
    references: [users.id],
  }),
  posts: many(posts),
}));

// Like relations
export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

// Comment relations
export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

// Follow relations
export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
  }),
}));
