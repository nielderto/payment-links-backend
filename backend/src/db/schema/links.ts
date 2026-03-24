import { pgTable, integer, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core"
import { users } from "./users";

export const links = pgTable('links', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id').notNull().references(() => users.id),
    productName: varchar('product_name', { length: 255 }).notNull(),
    productDescription: varchar('product_description', { length: 255 }).notNull(),
    price: integer('price').notNull(),
    imageUrl: text('image_url').notNull(),
    linkCode: varchar('link_code', { length: 50 }).notNull().unique(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
})