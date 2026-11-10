// Core domain types for CampusFit Inventory.
// One Equipment object is one inventory RECORD (a type of equipment),
// not one physical unit. quantityAvailable says how many units that record has.

export const CATEGORIES = ['Cardio', 'Strength', 'Accessories'] as const;

export type Category = (typeof CATEGORIES)[number];

/** Category filter used on the Inventory screen. */
export type CategoryFilter = 'All' | Category;

export interface Equipment {
  /** Stable unique identifier. Never reused and never derived from list position. */
  id: string;
  name: string;
  description: string;
  category: Category;
  /** Whole number of units available. 0 means out of stock. */
  quantityAvailable: number;
  /** Price of ONE unit in South African rand (replacement cost). */
  unitPrice: number;
  /** Optional remote image. Empty string means "no image". */
  imageUrl: string;
  /** ISO 8601 timestamps. */
  createdAt: string;
  updatedAt: string;
  /** Optional on the type so older stored records still load; treated as false when missing. */
  isFavourite?: boolean;
}

/** Validated data needed to create or update a record (no id or timestamps). */
export interface EquipmentInput {
  name: string;
  description: string;
  category: Category;
  quantityAvailable: number;
  unitPrice: number;
  imageUrl: string;
}

/** Raw text exactly as typed into the form. Everything is a string until validated. */
export interface EquipmentFormValues {
  name: string;
  description: string;
  /** Empty string means "nothing selected yet". */
  category: Category | '';
  quantity: string;
  unitPrice: string;
  imageUrl: string;
}

export type FormErrors = Partial<Record<keyof EquipmentFormValues, string>>;

export type SortOption =
  | 'updated-desc'
  | 'name-asc'
  | 'name-desc'
  | 'quantity-asc'
  | 'quantity-desc'
  | 'price-asc'
  | 'price-desc';

export type StockStatus = 'ok' | 'low' | 'out';
