import AsyncStorage from "@react-native-async-storage/async-storage";
import { USERS_KEY, SESSION_KEY } from "./keys";

const safeParse = (s, fallback) => {
  try { return JSON.parse(s); } catch { return fallback; }
};

export async function getUsers() {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? safeParse(raw, []) : [];
}

export async function registerUser({ username, password }) {
  const users = await getUsers();
  const exists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  if (exists) throw new Error("ชื่อผู้ใช้นี้ถูกใช้แล้ว");

  const user = { id: String(Date.now()), username, password };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  return user;
}

export async function loginUser({ username, password }) {
  const users = await getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  return user;
}

export async function getSession() {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? safeParse(raw, null) : null;
}

export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;
  const users = await getUsers();
  return users.find((u) => u.id === session.userId) || null;
}