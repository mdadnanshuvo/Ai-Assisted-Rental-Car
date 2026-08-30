import { eq, desc } from "drizzle-orm";
import { db } from "@/db/client";
import { vehicles as vehiclesTable, bookings as bookingsTable, campaigns as campaignsTable } from "@/db/schema";
import type { VehicleRow, BookingRow, CampaignRow } from "@/db/schema";
import { Vehicle, Booking, VehicleType, Transmission } from "@/types";
import { createId } from "@/lib/id";

// This module is the single data-access layer for vehicles, bookings, and
// campaigns — backed by SQLite via Drizzle (see src/db). better-sqlite3 is a
// synchronous driver, so every function here is synchronous too, matching
// the in-memory store this replaced; no calling code had to change.

// ---------------- Mappers (DB row <-> app type) ----------------

function vehicleRowToVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    type: row.type as VehicleType,
    seats: row.seats,
    luggage: row.luggage,
    transmission: row.transmission as Transmission,
    fuelType: row.fuelType as Vehicle["fuelType"],
    pricePerDay: row.pricePerDay,
    rating: row.rating,
    reviewCount: row.reviewCount,
    location: row.location,
    features: JSON.parse(row.featuresJson) as string[],
    image: row.image,
    available: row.available,
    popular: row.popular,
    mileage: row.mileage,
    description: row.description,
    stockCount: row.stockCount,
    lowStockThreshold: row.lowStockThreshold,
    inspectionExpiry: row.inspectionExpiry,
    warranty: row.warranty,
  };
}

function bookingRowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    reference: row.reference,
    vehicleId: row.vehicleId,
    vehicleName: row.vehicleName,
    vehicleImage: row.vehicleImage,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone,
    pickupLocation: row.pickupLocation,
    dropoffLocation: row.dropoffLocation,
    pickupDate: row.pickupDate,
    dropoffDate: row.dropoffDate,
    createdAt: row.createdAt,
    payment: row.payment as Booking["payment"],
    status: row.status as Booking["status"],
    amount: row.amount,
    source: row.source as Booking["source"],
    leadScore: row.leadScore ?? undefined,
    leadQualification: (row.leadQualification as Booking["leadQualification"]) ?? undefined,
    aiNote: row.aiNote ?? undefined,
  };
}

// ---------------- Vehicles ----------------

export function listVehicles(): Vehicle[] {
  return db.select().from(vehiclesTable).orderBy(desc(vehiclesTable.createdAt)).all().map(vehicleRowToVehicle);
}

export function getVehicle(id: string): Vehicle | undefined {
  const row = db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id)).get();
  return row ? vehicleRowToVehicle(row) : undefined;
}

export function addVehicle(vehicle: Vehicle): Vehicle {
  const row = db
    .insert(vehiclesTable)
    .values({
      id: vehicle.id,
      name: vehicle.name,
      brand: vehicle.brand,
      type: vehicle.type,
      seats: vehicle.seats,
      luggage: vehicle.luggage,
      transmission: vehicle.transmission,
      fuelType: vehicle.fuelType,
      pricePerDay: vehicle.pricePerDay,
      rating: vehicle.rating,
      reviewCount: vehicle.reviewCount,
      location: vehicle.location,
      featuresJson: JSON.stringify(vehicle.features),
      image: vehicle.image,
      available: vehicle.available,
      popular: vehicle.popular,
      mileage: vehicle.mileage,
      description: vehicle.description,
      stockCount: vehicle.stockCount,
      lowStockThreshold: vehicle.lowStockThreshold,
      inspectionExpiry: vehicle.inspectionExpiry,
      warranty: vehicle.warranty,
    })
    .returning()
    .get();
  return vehicleRowToVehicle(row);
}

export function updateVehicle(id: string, patch: Partial<Vehicle>): Vehicle | null {
  const existing = db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id)).get();
  if (!existing) return null;

  const dbPatch: Record<string, unknown> = { ...patch };
  if (patch.features) {
    dbPatch.featuresJson = JSON.stringify(patch.features);
    delete dbPatch.features;
  }

  const row = db
    .update(vehiclesTable)
    .set(dbPatch)
    .where(eq(vehiclesTable.id, id))
    .returning()
    .get();
  return vehicleRowToVehicle(row);
}

export function deleteVehicle(id: string): boolean {
  const existing = db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id)).get();
  if (!existing) return false;
  db.delete(vehiclesTable).where(eq(vehiclesTable.id, id)).run();
  return true;
}

// ---------------- Bookings ----------------

export function listBookings(): Booking[] {
  return db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt)).all().map(bookingRowToBooking);
}

export function addBooking(booking: Booking): Booking {
  const row = db
    .insert(bookingsTable)
    .values({
      id: booking.id,
      reference: booking.reference,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName,
      vehicleImage: booking.vehicleImage,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      pickupDate: booking.pickupDate,
      dropoffDate: booking.dropoffDate,
      createdAt: booking.createdAt,
      payment: booking.payment,
      status: booking.status,
      amount: booking.amount,
      source: booking.source,
      leadScore: booking.leadScore ?? null,
      leadQualification: booking.leadQualification ?? null,
      aiNote: booking.aiNote ?? null,
    })
    .returning()
    .get();
  return bookingRowToBooking(row);
}

export function getBookingById(id: string): Booking | undefined {
  const row = db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).get();
  return row ? bookingRowToBooking(row) : undefined;
}

export function updateBooking(id: string, patch: Partial<Booking>): Booking | null {
  const existing = db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).get();
  if (!existing) return null;
  const row = db
    .update(bookingsTable)
    .set(patch as Record<string, unknown>)
    .where(eq(bookingsTable.id, id))
    .returning()
    .get();
  return bookingRowToBooking(row);
}

// ---------------- Campaigns (Promo) ----------------

export interface Campaign {
  id: string;
  name: string;
  discountPct: number;
  vehicleType: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

function campaignRowToCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    name: row.name,
    discountPct: row.discountPct,
    vehicleType: row.vehicleType,
    startDate: row.startDate,
    endDate: row.endDate,
    active: row.active,
  };
}

export function listCampaigns(): Campaign[] {
  return db.select().from(campaignsTable).orderBy(desc(campaignsTable.createdAt)).all().map(campaignRowToCampaign);
}

export function addCampaign(campaign: Omit<Campaign, "id"> & { id?: string }): Campaign {
  const row = db
    .insert(campaignsTable)
    .values({ ...campaign, id: campaign.id ?? createId("campaign") })
    .returning()
    .get();
  return campaignRowToCampaign(row);
}

export function updateCampaign(id: string, patch: Partial<Campaign>): Campaign | null {
  const existing = db.select().from(campaignsTable).where(eq(campaignsTable.id, id)).get();
  if (!existing) return null;
  const row = db
    .update(campaignsTable)
    .set(patch as Record<string, unknown>)
    .where(eq(campaignsTable.id, id))
    .returning()
    .get();
  return campaignRowToCampaign(row);
}

export function deleteCampaign(id: string): boolean {
  const existing = db.select().from(campaignsTable).where(eq(campaignsTable.id, id)).get();
  if (!existing) return false;
  db.delete(campaignsTable).where(eq(campaignsTable.id, id)).run();
  return true;
}
