import { CATEGORIES } from '../types/equipment';
import type {
  Category,
  EquipmentFormValues,
  EquipmentInput,
  FormErrors,
} from '../types/equipment';

// Reusable, pure validation helpers. Nothing here touches React, so they are unit tested.
// keyboardType only changes which keyboard appears; it does NOT stop a user pasting
// "3abc" or "-5". Every value is therefore validated here as text before it is used.

export const LIMITS = {
  nameMax: 60,
  descriptionMax: 300,
  quantityMax: 9999,
  priceMax: 1_000_000,
  imageUrlMax: 500,
} as const;

export type FieldResult<T> = { ok: true; value: T } | { ok: false; error: string };

function pass<T>(value: T): FieldResult<T> {
  return { ok: true, value };
}

function fail<T>(error: string): FieldResult<T> {
  return { ok: false, error };
}

export function validateName(raw: string): FieldResult<string> {
  const value = raw.trim();
  if (value.length === 0) {
    return fail('Equipment name is required.');
  }
  if (value.length > LIMITS.nameMax) {
    return fail(`Name must be ${LIMITS.nameMax} characters or fewer.`);
  }
  return pass(value);
}

export function validateDescription(raw: string): FieldResult<string> {
  const value = raw.trim();
  if (value.length === 0) {
    return fail('A short description is required.');
  }
  if (value.length > LIMITS.descriptionMax) {
    return fail(`Description must be ${LIMITS.descriptionMax} characters or fewer.`);
  }
  return pass(value);
}

export function validateCategory(raw: string): FieldResult<Category> {
  const match = CATEGORIES.find((category) => category === raw);
  if (match === undefined) {
    return fail('Please choose a category.');
  }
  return pass(match);
}

/**
 * Quantity must be a whole number, zero or more.
 * We do NOT use parseInt: parseInt("3abc") returns 3 and would accept bad input.
 * An empty field is an error, not a silent zero.
 */
export function validateQuantity(raw: string): FieldResult<number> {
  const text = raw.trim();
  if (text.length === 0) {
    return fail('Quantity is required. Enter 0 if none are available.');
  }
  if (text.startsWith('-')) {
    return fail('Quantity cannot be negative.');
  }
  if (/^\d+[.,]\d*$/.test(text)) {
    return fail('Quantity must be a whole number, for example 4.');
  }
  if (!/^\d+$/.test(text)) {
    return fail('Quantity must contain digits only, for example 4.');
  }
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value > LIMITS.quantityMax) {
    return fail(`Quantity cannot be more than ${LIMITS.quantityMax}.`);
  }
  return pass(value);
}

/**
 * Unit price in rand. Accepts "1250", "1250.5", "1250.50" and the South African
 * decimal comma "1250,50". At most two decimal places, because rand has cents.
 * Zero is allowed (for example a donated item); negatives and text are rejected.
 * The stored number is rounded to whole cents.
 */
export function validatePrice(raw: string): FieldResult<number> {
  const text = raw.trim();
  if (text.length === 0) {
    return fail('Unit price is required. Enter 0 if the item has no cost.');
  }
  if (text.startsWith('-')) {
    return fail('Unit price cannot be negative.');
  }
  if (/^\d+[.,]\d{3,}$/.test(text)) {
    return fail('Use at most 2 decimal places, for example 1250.50.');
  }
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(text)) {
    return fail('Enter a valid amount in rand, for example 1250 or 1250.50.');
  }
  const value = Math.round(Number(text.replace(',', '.')) * 100) / 100;
  if (!Number.isFinite(value) || value > LIMITS.priceMax) {
    return fail(`Unit price cannot be more than R${LIMITS.priceMax.toLocaleString('en-US')}.`);
  }
  return pass(value);
}

// http(s) only, a dotted host name, optional port, optional path. Deliberately a regular
// expression rather than the URL class so it behaves the same on every JavaScript engine.
const IMAGE_URL_PATTERN = /^https?:\/\/(?:[A-Za-z0-9-]+\.)+[A-Za-z0-9-]+(?::\d{1,5})?(?:[/?#]\S*)?$/;

/** Image URL is optional. An empty value is valid and means "no image". */
export function validateImageUrl(raw: string): FieldResult<string> {
  const value = raw.trim();
  if (value.length === 0) {
    return pass('');
  }
  if (value.length > LIMITS.imageUrlMax) {
    return fail(`Image URL must be ${LIMITS.imageUrlMax} characters or fewer.`);
  }
  if (!IMAGE_URL_PATTERN.test(value)) {
    return fail('Enter a web address starting with http:// or https://, or leave this blank.');
  }
  return pass(value);
}

export type FormValidationResult =
  | { ok: true; input: EquipmentInput }
  | { ok: false; errors: FormErrors };

/** Validates every field and returns either clean typed input or a map of field errors. */
export function validateEquipmentForm(values: EquipmentFormValues): FormValidationResult {
  const name = validateName(values.name);
  const description = validateDescription(values.description);
  const category = validateCategory(values.category);
  const quantity = validateQuantity(values.quantity);
  const price = validatePrice(values.unitPrice);
  const imageUrl = validateImageUrl(values.imageUrl);

  if (
    name.ok &&
    description.ok &&
    category.ok &&
    quantity.ok &&
    price.ok &&
    imageUrl.ok
  ) {
    return {
      ok: true,
      input: {
        name: name.value,
        description: description.value,
        category: category.value,
        quantityAvailable: quantity.value,
        unitPrice: price.value,
        imageUrl: imageUrl.value,
      },
    };
  }

  const errors: FormErrors = {};
  if (!name.ok) errors.name = name.error;
  if (!description.ok) errors.description = description.error;
  if (!category.ok) errors.category = category.error;
  if (!quantity.ok) errors.quantity = quantity.error;
  if (!price.ok) errors.unitPrice = price.error;
  if (!imageUrl.ok) errors.imageUrl = imageUrl.error;
  return { ok: false, errors };
}

/** Returns the error for one field only (used when a field loses focus). */
export function validateSingleField(
  field: keyof EquipmentFormValues,
  values: EquipmentFormValues,
): string | undefined {
  const result = validateEquipmentForm(values);
  return result.ok ? undefined : result.errors[field];
}
