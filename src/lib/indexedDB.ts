import type { HistoryItem } from "@/types";

const DB_NAME = "LineSketcher";
const DB_VERSION = 1;
const STORE_NAME = "history";
const MAX_HISTORY_ITEMS = 20;

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt", { unique: false });
        }
      };
    });
  }

  async addHistoryItem(item: HistoryItem): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error("Database not initialized");
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      // Add the new item
      const addRequest = store.add(item);

      addRequest.onsuccess = async () => {
        // Clean up old items if we exceed the limit
        await this.cleanupOldItems();
        resolve();
      };

      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  async getHistoryItems(): Promise<HistoryItem[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error("Database not initialized");
      const transaction = this.db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("createdAt");

      // Get all items sorted by creation date (newest first)
      const request = index.openCursor(null, "prev");
      const items: HistoryItem[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          resolve(items.slice(0, MAX_HISTORY_ITEMS));
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async deleteHistoryItem(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error("Database not initialized");
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearHistory(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error("Database not initialized");
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async cleanupOldItems(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) throw new Error("Database not initialized");
      const transaction = this.db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("createdAt");

      // Get all items sorted by creation date (oldest first)
      const request = index.openCursor(null, "next");
      const items: { id: string; createdAt: Date }[] = [];

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          items.push({
            id: cursor.value.id,
            createdAt: cursor.value.createdAt,
          });
          cursor.continue();
        } else {
          // Delete excess items (keep only the most recent MAX_HISTORY_ITEMS)
          if (items.length > MAX_HISTORY_ITEMS) {
            const itemsToDelete = items.slice(
              0,
              items.length - MAX_HISTORY_ITEMS,
            );
            Promise.all(
              itemsToDelete.map((item) => this.deleteHistoryItem(item.id)),
            )
              .then(() => resolve())
              .catch(reject);
          } else {
            resolve();
          }
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBManager = new IndexedDBManager();
