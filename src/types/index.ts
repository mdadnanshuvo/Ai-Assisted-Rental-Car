export type VehicleType = "Small Car" | "Large Car" | "Exclusive Car" | "SUV";

export type Transmission = "Automatic" | "Manual";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: VehicleType;
  seats: number;
  luggage: number;
  transmission: Transmission;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  location: string;
  features: string[];
  image: string;
  available: boolean;
  popular: boolean;
  mileage: string;
  description: string;
  stockCount: number;
  lowStockThreshold: number;
  inspectionExpiry: string;
  warranty: string;
}

export type BookingStatus = "Success" | "Pending" | "Cancelled";
export type PaymentMethod =
  | "Paypal"
  | "Apple Pay"
  | "Stripe"
  | "PayU"
  | "Paytm"
  | "Card";

export interface Booking {
  id: string;
  reference: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  createdAt: string;
  payment: PaymentMethod;
  status: BookingStatus;
  amount: number;
  source: "Website" | "AI Assistant" | "Admin";
  leadScore?: number;
  leadQualification?: "Hot" | "Warm" | "Cold";
  aiNote?: string;
}

export interface DashboardStats {
  weeklyEarning: number;
  weeklyEarningChangePct: number;
  totalSales: number;
  purchasedGoods: number;
  activeRentals: number;
  availableVehicles: number;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export interface RegionSales {
  region: string;
  sales: number;
  highlighted?: boolean;
}

export interface AIRecommendRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface AIRecommendedVehicle {
  vehicle: Vehicle;
  matchScore: number;
  reasons: string[];
}

export interface AIRecommendResponse {
  reply: string;
  extracted: {
    seats?: number;
    type?: VehicleType;
    maxBudget?: number;
    tripLength?: string;
    features?: string[];
  };
  recommendations: AIRecommendedVehicle[];
  usedLLM: boolean;
  provider?: "gemini" | "anthropic";
}
