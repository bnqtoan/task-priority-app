CREATE TABLE `api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`key_hash` text NOT NULL,
	`name` text NOT NULL,
	`prefix` text NOT NULL,
	`last_used_at` integer,
	`request_count` integer DEFAULT 0,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `deadline` integer;--> statement-breakpoint
ALTER TABLE `tasks` ADD `subtasks` text;--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_key_hash_unique` ON `api_keys` (`key_hash`);