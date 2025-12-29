import { pgTable, text, timestamp, boolean, uuid, integer, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

export const roleEnum = pgEnum("role", ["owner", "admin", "member"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "past_due", "canceled", "incomplete", "trialing"]);

export const users = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("account", {
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationToken", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

export const organizations = pgTable("organization", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").unique(),
    stripeCustomerId: text("stripe_customer_id").unique(),
    plan: text("plan").default("free"),
    subscriptionStatus: subscriptionStatusEnum("subscription_status").default("incomplete"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const members = pgTable("member", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    role: roleEnum("role").default("member"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const invitations = pgTable("invitation", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    role: roleEnum("role").default("member"),
    token: text("token").unique().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    status: text("status").default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const usageRecords = pgTable("usage_record", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    organizationId: text("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    metric: text("metric").notNull(),
    quantity: integer("quantity").notNull(),
    timestamp: timestamp("timestamp").defaultNow(),
});
