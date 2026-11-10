// ============================================================
// Code Attribution
// Usage: Implemented using the documented AsyncStorage API (getItem, setItem, and the
//        recommended try/catch around each call, with JSON.stringify/JSON.parse for
//        object values). The wrapper, validation and recovery logic are original
//        AI-assisted code written for this project.
// Author: React Native Async Storage contributors (react-native-async-storage project)
// Link: https://react-native-async-storage.github.io/async-storage/docs/usage
// Date Accessed: 10 November 2026
// Date Published: Not stated
// Version: Documentation for @react-native-async-storage/async-storage 2.x
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseStoredState, serialiseState } from './storageParser';
import type { PersistedState } from './storageParser';

export const STORAGE_KEY = 'campusfit.inventory.v1';
const CORRUPT_BACKUP_KEY = `${STORAGE_KEY}.corrupt-backup`;

export type LoadOutcome =
  /** Nothing saved yet: start with an empty inventory. */
  | { kind: 'empty' }
  /** Saved data loaded. droppedCount > 0 means some damaged records were skipped. */
  | { kind: 'loaded'; state: PersistedState; droppedCount: number }
  /** Saved text could not be understood. A copy was kept under a backup key. */
  | { kind: 'corrupt' }
  /** The storage itself failed to read. We must NOT save over whatever is there. */
  | { kind: 'read-error'; message: string };

export async function loadInventory(): Promise<LoadOutcome> {
  let raw: string | null;
  try {
    raw = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return { kind: 'read-error', message: describeError(error) };
  }

  const result = parseStoredState(raw);
  if (result.status === 'empty') return { kind: 'empty' };
  if (result.status === 'ok') {
    return { kind: 'loaded', state: result.state, droppedCount: result.droppedCount };
  }

  // Corrupt: keep the unreadable text so it is not lost, then start fresh.
  if (raw !== null) {
    try {
      await AsyncStorage.setItem(CORRUPT_BACKUP_KEY, raw);
    } catch {
      // The backup is best effort. Starting fresh must still work.
    }
  }
  return { kind: 'corrupt' };
}

/** Throws if the write fails; the caller decides how to show that to the user. */
export async function saveInventorySerialised(serialised: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, serialised);
}

export async function saveInventory(state: PersistedState): Promise<void> {
  await saveInventorySerialised(serialiseState(state));
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown storage error';
}
