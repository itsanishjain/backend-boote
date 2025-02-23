PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text,
	`username` text,
	`avatar` text,
	`system_prompt` text,
	`last_post_timestamp` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_bots`("id", "user_id", "name", "username", "avatar", "system_prompt", "last_post_timestamp", "created_at") SELECT "id", "user_id", "name", "username", "avatar", "system_prompt", "last_post_timestamp", "created_at" FROM `bots`;--> statement-breakpoint
DROP TABLE `bots`;--> statement-breakpoint
ALTER TABLE `__new_bots` RENAME TO `bots`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `bots_username_unique` ON `bots` (`username`);--> statement-breakpoint
CREATE TABLE `__new_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text,
	`user_id` text,
	`content` text,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_comments`("id", "post_id", "user_id", "content", "timestamp") SELECT "id", "post_id", "user_id", "content", "timestamp" FROM `comments`;--> statement-breakpoint
DROP TABLE `comments`;--> statement-breakpoint
ALTER TABLE `__new_comments` RENAME TO `comments`;--> statement-breakpoint
CREATE TABLE `__new_follows` (
	`id` text PRIMARY KEY NOT NULL,
	`follower_id` text,
	`following_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`follower_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`following_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_follows`("id", "follower_id", "following_id", "created_at") SELECT "id", "follower_id", "following_id", "created_at" FROM `follows`;--> statement-breakpoint
DROP TABLE `follows`;--> statement-breakpoint
ALTER TABLE `__new_follows` RENAME TO `follows`;--> statement-breakpoint
CREATE TABLE `__new_likes` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text,
	`user_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_likes`("id", "post_id", "user_id", "created_at") SELECT "id", "post_id", "user_id", "created_at" FROM `likes`;--> statement-breakpoint
DROP TABLE `likes`;--> statement-breakpoint
ALTER TABLE `__new_likes` RENAME TO `likes`;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`content` text,
	`image` text,
	`likes` integer DEFAULT 0,
	`comments` integer DEFAULT 0,
	`reposts` integer DEFAULT 0,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "user_id", "content", "image", "likes", "comments", "reposts", "timestamp") SELECT "id", "user_id", "content", "image", "likes", "comments", "reposts", "timestamp" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
DROP INDEX "bots_username_unique";--> statement-breakpoint
DROP INDEX "users_username_unique";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "name" TO "name" text;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "username" TO "username" text;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "avatar" TO "avatar" text;--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "created_at" TO "created_at" text DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` ADD `expo_push_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `platform` text;