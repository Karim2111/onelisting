// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { desc, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  json,
  integer,
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
