// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  json,
  integer,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `onelisting_${name}`);

export const listings = createTable(
  "listing",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("userId", { length: 256 }),
    title: varchar("title", { length: 64 }).notNull(),
    images: json("images").notNull(),
    price: integer("price").notNull(),
    sku: varchar("sku", { length: 64 }),
    condition: varchar("condition", { length: 64 }).notNull(),
    category: varchar("category", { length: 64 }).notNull(),
    description: varchar("description", { length: 61000 }).notNull(),
    tags: json("tags"), // form collects array of strings
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (example) => ({
    titleIndex: index("name_idx").on(example.title),
  })
);

export const sessions = createTable(
  "session",
  {
    id: serial("id").primaryKey().notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    platform: varchar("platform", { length: 128 }).notNull(),
    cookies: json("cookies"),
    createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    expiresAt: timestamp("expires_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    ipAddress: varchar("ip_address", { length: 128 }),
    userAgent: varchar("user_agent", { length: 128 }),
    lastActive: timestamp("last_active", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`),
    isSessionValid: boolean("is_session_valid").notNull().default(true),
    proxyIp: varchar("proxy_ip", { length: 128 }),
    profileId: varchar("profile_id", { length: 256 }),
  },
  (session) => ({
    uniqueUserPlatform: uniqueIndex("user_platform_idx").on(session.userId, session.platform), 
  })
);
