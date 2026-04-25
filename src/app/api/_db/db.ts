import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type DbShape = {
  hotels: unknown[];
  bookings: unknown[];
};

const DB_PATH = path.join(process.cwd(), "server", "db.json");

async function readDbUnsafe(): Promise<DbShape> {
  const raw = await readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as DbShape;
}

/**
 * Very small write queue to avoid concurrent writes corrupting `db.json`.
 * Good enough for local testing.
 */
let writeQueue: Promise<void> = Promise.resolve();

export async function readDb(): Promise<DbShape> {
  const db = await readDbUnsafe();
  return {
    hotels: Array.isArray(db.hotels) ? db.hotels : [],
    bookings: Array.isArray(db.bookings) ? db.bookings : [],
  };
}

export async function writeDb(next: DbShape): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    const json = JSON.stringify(next, null, 2);
    await writeFile(DB_PATH, json, "utf8");
  });
  return writeQueue;
}

