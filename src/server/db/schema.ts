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
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `onelisting_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    userId: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    title: varchar("title", { length: 64 }).notNull(),
    images: json("images").notNull(),
    price: varchar("price", { length: 9 }).notNull(),
    sku: varchar("sku", { length: 64 }).notNull(),
    category: varchar("sku", { length: 64 }).notNull(),
    condition: varchar("sku", { length: 64 }).notNull(),
    description: varchar("description", { length: 61000 }).notNull(),
    tags: json("tags"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);
