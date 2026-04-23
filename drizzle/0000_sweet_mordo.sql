CREATE TABLE "measurements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"shortness_of_breath" integer,
	"cough" integer,
	"phlegm_amount" text,
	"phlegm_color" text,
	"temperature" integer,
	"pulse" integer,
	"oxygen" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL
);
