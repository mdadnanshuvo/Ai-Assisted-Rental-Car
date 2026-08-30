import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/db/client";
import { users, vehicles, bookings, campaigns } from "../src/db/schema";
import { vehicles as mockVehicles } from "../src/data/vehicles";
import { bookings as mockBookings } from "../src/data/bookings";
import { createId } from "../src/lib/id";

const ADMIN_EMAIL = "admin@bestauto.com";
const ADMIN_PASSWORD = "Admin123!";
const CUSTOMER_EMAIL = "customer@bestauto.com";
const CUSTOMER_PASSWORD = "Customer123!";

async function main() {
  console.log("Seeding database...");

  // --- Users ---
  db.delete(users).run();
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const customerHash = await bcrypt.hash(CUSTOMER_PASSWORD, 10);

  db.insert(users)
    .values([
      { id: createId("user"), name: "Mike Witzel", email: ADMIN_EMAIL, passwordHash: adminHash, role: "ADMIN" },
      {
        id: createId("user"),
        name: "Demo Customer",
        email: CUSTOMER_EMAIL,
        passwordHash: customerHash,
        role: "CUSTOMER",
      },
    ])
    .run();
  console.log(`  users: 2 (1 admin, 1 customer)`);

  // --- Vehicles ---
  db.delete(vehicles).run();
  db.insert(vehicles)
    .values(
      mockVehicles.map((v) => ({
        id: v.id,
        name: v.name,
        brand: v.brand,
        type: v.type,
        seats: v.seats,
        luggage: v.luggage,
        transmission: v.transmission,
        fuelType: v.fuelType,
        pricePerDay: v.pricePerDay,
        rating: v.rating,
        reviewCount: v.reviewCount,
        location: v.location,
        featuresJson: JSON.stringify(v.features),
        image: v.image,
        available: v.available,
        popular: v.popular,
        mileage: v.mileage,
        description: v.description,
        stockCount: v.stockCount,
        lowStockThreshold: v.lowStockThreshold,
        inspectionExpiry: v.inspectionExpiry,
        warranty: v.warranty,
      })),
    )
    .run();
  console.log(`  vehicles: ${mockVehicles.length}`);

  // --- Bookings ---
  db.delete(bookings).run();
  db.insert(bookings)
    .values(
      mockBookings.map((b) => ({
        id: b.id,
        reference: b.reference,
        vehicleId: b.vehicleId,
        vehicleName: b.vehicleName,
        vehicleImage: b.vehicleImage,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        customerPhone: b.customerPhone,
        pickupLocation: b.pickupLocation,
        dropoffLocation: b.dropoffLocation,
        pickupDate: b.pickupDate,
        dropoffDate: b.dropoffDate,
        createdAt: b.createdAt,
        payment: b.payment,
        status: b.status,
        amount: b.amount,
        source: b.source,
        leadScore: b.leadScore ?? null,
        leadQualification: b.leadQualification ?? null,
        aiNote: b.aiNote ?? null,
      })),
    )
    .run();
  console.log(`  bookings: ${mockBookings.length}`);

  // --- Campaigns ---
  db.delete(campaigns).run();
  db.insert(campaigns)
    .values([
      {
        id: createId("campaign"),
        name: "Weekend SUV Special",
        discountPct: 15,
        vehicleType: "SUV",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        active: true,
      },
      {
        id: createId("campaign"),
        name: "Electric Week",
        discountPct: 10,
        vehicleType: "Small Car",
        startDate: "2026-09-10",
        endDate: "2026-09-17",
        active: true,
      },
    ])
    .run();
  console.log("  campaigns: 2");

  console.log("\nSeed complete. Login credentials:");
  console.log(`  Admin:    ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`  Customer: ${CUSTOMER_EMAIL} / ${CUSTOMER_PASSWORD}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
