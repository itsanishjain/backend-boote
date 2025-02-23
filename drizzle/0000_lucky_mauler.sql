CREATE TABLE `achievements` (
	`id` text PRIMARY KEY NOT NULL,
	`unlocked_at` integer
);
--> statement-breakpoint
CREATE TABLE `early_bird_completions` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text,
	`completed_at` integer,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`type` text,
	`icon` text,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`room_id` text,
	`name` text,
	`frequency_value` integer,
	`frequency_unit` text,
	`effort` integer,
	`current_state` integer,
	`is_completed` integer DEFAULT 0,
	`last_completed_at` integer,
	`created_at` integer,
	`points` integer DEFAULT 0,
	`streak` integer DEFAULT 0,
	FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_stats` (
	`id` text PRIMARY KEY DEFAULT 'default' NOT NULL,
	`current_streak` integer DEFAULT 0,
	`longest_streak` integer DEFAULT 0,
	`total_points` integer DEFAULT 0,
	`last_activity_date` integer,
	`tasks_completed` integer DEFAULT 0,
	`early_bird_tasks` integer DEFAULT 0,
	`unique_room_types` integer DEFAULT 0,
	`perfect_days` integer DEFAULT 0,
	`rooms_created` integer DEFAULT 0,
	`tasks_completed_today` integer DEFAULT 0,
	`total_scheduled_tasks_today` integer DEFAULT 0,
	`weekly_completion_rate` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text,
	`email` text,
	`password_hash` text,
	`last_login` integer,
	`is_active` integer DEFAULT 1,
	`expo_push_token` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);