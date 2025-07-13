import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  address: varchar("address", { length: 42 }).unique().notNull(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

export const Tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id, { onDelete: "cascade" }).notNull(),
  balance: integer("balance").notNull().default(0),
  stakedAmount: integer("staked_amount").notNull().default(0),
  rewardsEarned: integer("rewards_earned").notNull().default(0),
});

export const Webpages = pgTable("webpages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id, { onDelete: "cascade" }).notNull(),
  name: text("name"),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  cid: varchar("cid", { length: 255 }).notNull(),
});

export const Deployments = pgTable("deployments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => Users.id, { onDelete: "cascade" }).notNull(),
  webpageId: integer("webpage_id").references(() => Webpages.id, { onDelete: "cascade" }).notNull(),
  transactionHash: varchar("transaction_hash", { length: 66 }).notNull(),
  deployedAt: timestamp("deployed_at").defaultNow().notNull(),
  deploymentUrl: varchar("deployment_url", { length: 255 }).notNull(),
  filecoinInfo: text("filecoin_info"),
});

export type Deployment = typeof Deployments.$inferSelect;
export type NewDeployment = typeof Deployments.$inferInsert;