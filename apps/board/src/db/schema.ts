import {
  bigint,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const posts = mysqlTable('posts', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .primaryKey()
    .autoincrement(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
