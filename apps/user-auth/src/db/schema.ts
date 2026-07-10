import {
  bigint,
  mysqlTable,
  uniqueIndex,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable(
  'users',
  {
    id: bigint('id', { mode: 'number', unsigned: true })
      .primaryKey()
      .autoincrement(),
    email: varchar('email', { length: 255 }).notNull(), // unique() 제거 후 아래 인덱스에서 처리 고려
    username: varchar('username', { length: 255 }).notNull(), // unique() 제거 후 아래 인덱스에서 처리 고려
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    // 핵심: 데이터 수정 시 자동으로 현재 시간 반영
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => {
    return {
      // 만약 소프트 삭제와 유니크 충돌을 피하기 위해 복합 인덱스를 쓴다면 아래와 같이 활용 가능합니다.
      emailIdx: uniqueIndex('email_idx').on(table.email),
      usernameIdx: uniqueIndex('username_idx').on(table.username),
    };
  },
);
