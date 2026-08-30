import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Role is a plain string ("ADMIN" | "CUSTOMER") — SQLite has no native enum.
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("CUSTOMER"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const vehicles = sqliteTable("vehicles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  type: text("type").notNull(),
  seats: integer("seats").notNull(),
  luggage: integer("luggage").notNull(),
  transmission: text("transmission").notNull(),
  fuelType: text("fuel_type").notNull(),
  pricePerDay: real("price_per_day").notNull(),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
  location: text("location").notNull(),
  // JSON-encoded string[] — SQLite has no native array type.
  featuresJson: text("features_json").notNull().default("[]"),
  image: text("image").notNull(),
  available: integer("available", { mode: "boolean" }).notNull().default(true),
  popular: integer("popular", { mode: "boolean" }).notNull().default(false),
  mileage: text("mileage").notNull().default("Unlimited"),
  description: text("description").notNull(),
  stockCount: integer("stock_count").notNull().default(1),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(3),
  inspectionExpiry: text("inspection_expiry").notNull(),
  warranty: text("warranty").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// Bookings intentionally hold no foreign key to vehicles — a booking is a
// point-in-time snapshot of an inquiry (it keeps its own vehicleName /
// vehicleImage), so it stays valid even if the referenced vehicle is later
// edited or deleted.
export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  vehicleId: text("vehicle_id").notNull(),
  vehicleName: text("vehicle_name").notNull(),
  vehicleImage: text("vehicle_image").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  pickupDate: text("pickup_date").notNull(),
  dropoffDate: text("dropoff_date").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  payment: text("payment").notNull(),
  status: text("status").notNull(),
  amount: real("amount").notNull(),
  source: text("source").notNull(),
  leadScore: integer("lead_score"),
  leadQualification: text("lead_qualification"),
  aiNote: text("ai_note"),
});

export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  discountPct: integer("discount_pct").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type UserRow = typeof users.$inferSelect;
export type VehicleRow = typeof vehicles.$inferSelect;
export type BookingRow = typeof bookings.$inferSelect;
export type CampaignRow = typeof campaigns.$inferSelect;
