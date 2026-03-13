import AsyncStorage from "@react-native-async-storage/async-storage";
import { TX_KEY } from "./keys";

const safeParse = (s, fallback) => {
  try { return JSON.parse(s); } catch { return fallback; }
};

export async function listTransactions(userId) {
  const raw = await AsyncStorage.getItem(TX_KEY(userId));
  return raw ? safeParse(raw, []) : [];
}

export async function saveTransactions(userId, txs) {
  await AsyncStorage.setItem(TX_KEY(userId), JSON.stringify(txs));
}

export async function addTransaction(userId, tx) {
  const txs = await listTransactions(userId);
  const next = [{ ...tx, id: String(Date.now()) }, ...txs];
  await saveTransactions(userId, next);
  return next;
}

export async function updateTransaction(userId, id, patch) {
  const txs = await listTransactions(userId);
  const next = txs.map((t) => (t.id === id ? { ...t, ...patch } : t));
  await saveTransactions(userId, next);
  return next;
}

export async function deleteTransaction(userId, id) {
  const txs = await listTransactions(userId);
  const next = txs.filter((t) => t.id !== id);
  await saveTransactions(userId, next);
  return next;
}