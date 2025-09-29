-- Create users table
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Create tasks table
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`impact` integer NOT NULL,
	`confidence` integer NOT NULL,
	`ease` integer NOT NULL,
	`type` text NOT NULL,
	`time_block` text NOT NULL,
	`estimated_time` integer NOT NULL,
	`decision` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade
);

-- Create user_preferences table
CREATE TABLE `user_preferences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`preferred_method` text DEFAULT 'hybrid' NOT NULL,
	`default_time_block` text DEFAULT 'all',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade
);

-- Create unique indexes
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE UNIQUE INDEX `user_preferences_user_id_unique` ON `user_preferences` (`user_id`);

-- Create performance indexes
CREATE INDEX `tasks_user_id_index` ON `tasks` (`user_id`);
CREATE INDEX `tasks_status_index` ON `tasks` (`status`);
CREATE INDEX `tasks_time_block_index` ON `tasks` (`time_block`);
CREATE INDEX `tasks_type_index` ON `tasks` (`type`);
CREATE INDEX `tasks_decision_index` ON `tasks` (`decision`);
CREATE INDEX `tasks_created_at_index` ON `tasks` (`created_at`);