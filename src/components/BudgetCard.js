import { useEffect, useState, useMemo, useCallback, useContext } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBudget, setBudget } from "../storage/budget";
import { getCategories } from "../storage/categories";
import { formatMoney } from "../utils/format";
import { AppContext } from "../contexts/AppContext";
import Chip from "./Chip";

export default function BudgetCard({ navigation, expenseThisMonth, transactions }) {
  const { state } = useContext(AppContext);
  const userId = state.user?.id;

  const [budget, setBudgetState] = useState({});
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const [b, cats] = await Promise.all([
        getBudget(userId),       
        getCategories(userId),   
      ]);
      setBudgetState(b || {});
      setCategories(cats || []);

      if (cats?.length > 0) {
        setSelectedCategory(cats[0].key || cats[0].id);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!selectedCategory) return;
    setInput("");
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      (async () => {
        const cats = await getCategories(userId); 
        setCategories(cats || []);

        if (!selectedCategory && cats?.length > 0) {
          setSelectedCategory(cats[0].key || cats[0].id);
        }
      })();
    }, [userId, selectedCategory])
  );

  const onSave = async () => {
    if (!selectedCategory) {
      return Alert.alert("กรุณาเลือกหมวดหมู่");
    }

    try {
      const b = await setBudget(input, selectedCategory, userId); 
      setBudgetState(b);
      setInput("");
      Alert.alert("บันทึกแล้ว", "ตั้งงบประมาณเรียบร้อย");
    } catch (e) {
      Alert.alert("ผิดพลาด", e.message);
    }
  };

  const expenseForCategory = useMemo(() => {
    if (!selectedCategory) return 0;

    const now = new Date();

    return transactions
      .filter((t) => {
        if (t?.type !== "expense") return false;
        if (t?.category !== selectedCategory) return false;

        const d = new Date(t?.date);
        if (Number.isNaN(d.getTime())) return false;

        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((total, t) => total + Number(t?.amount || 0), 0);
  }, [transactions, selectedCategory]);

  const budgetAmount = Number(budget[selectedCategory] || 0);

  const percent =
    budgetAmount > 0 ? Math.min(100, (expenseForCategory / budgetAmount) * 100) : 0;

  const warn80 = percent >= 80 && percent < 100;
  const overBudget = percent >= 100;

  const categoryLabel =
    categories.find((c) => c.key === selectedCategory || c.id === selectedCategory)?.label || "";

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        gap: 8,
        backgroundColor: "white",
      }}
    >
      <Text style={{ fontWeight: "900", fontSize: 16 }}>
        งบประมาณรายเดือน
      </Text>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          keyboardType="numeric"
          placeholder="ตั้งงบ เช่น 5000"
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 12,
            padding: 10,
          }}
        />
        <Pressable
          onPress={onSave}
          style={{
            backgroundColor: "#6366f1",
            borderRadius: 12,
            paddingHorizontal: 14,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>บันทึก</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 8, gap: 10 }}>
        <Text style={{ fontWeight: "700", fontSize: 13 }}>
          👉 เลือกหมวดหมู่สำหรับงบนี้:
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {categories.map((c) => (
            <Chip
              key={c.key || c.id}
              label={c.label}
              active={selectedCategory === (c.key || c.id)}
              onPress={() => setSelectedCategory(c.key || c.id)}
            />
          ))}
        </View>
      </View>

      {budgetAmount > 0 && (
        <>
          <Text style={{ fontWeight: "600", fontSize: 12, marginTop: 4, opacity: 0.7 }}>
            {categoryLabel ? `งบประมาณหมวด: ${categoryLabel}` : "โปรดเลือกหมวดหมู่"}
          </Text>

          <Text>
            ใช้ไปแล้ว {formatMoney(expenseForCategory)} / {formatMoney(budgetAmount)} บาท
          </Text>

          <View
            style={{
              height: 10,
              backgroundColor: "#e5e7eb",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${percent}%`,
                height: "100%",
                backgroundColor: overBudget
                  ? "#ef4444"
                  : warn80
                  ? "#f59e0b"
                  : "#10b981",
              }}
            />
          </View>

          {warn80 && (
            <Text style={{ color: "#f59e0b", fontWeight: "800", marginTop: 4 }}>
              ⚠️ ใช้งบไปแล้ว {Math.round(percent)}% ใกล้ถึงงบประมาณแล้ว
            </Text>
          )}

          {overBudget && (
            <Text style={{ color: "#ef4444", fontWeight: "900", marginTop: 4 }}>
              🚨 ใช้จ่ายเกินงบประมาณแล้ว!
            </Text>
          )}
        </>
      )}
    </View>
  );
}