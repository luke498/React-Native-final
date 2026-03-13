import { useEffect, useMemo, useState, useContext } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { AppContext } from "../contexts/AppContext";
import { TYPES } from "../utils/categories";
import Chip from "../components/Chip";

export default function TransactionFormScreen({ navigation, route }) {
  const mode = route?.params?.mode || "create";
  const editingTx = route?.params?.tx || null;
  const presetType = route?.params?.presetType || null;

  const { state, addTransaction, updateTransaction, refreshCategories } = useContext(AppContext);
  const [type, setType] = useState(editingTx?.type || presetType || "expense");
  const [categories, setCategories] = useState(state.categories);
  const [category, setCategory] = useState(editingTx?.category || null);
  const [amount, setAmount] = useState(editingTx?.amount ? String(editingTx.amount) : "");
  const [note, setNote] = useState(editingTx?.note || "");

  const categoryLabel = useMemo(() => {
    if (type === "save_in") return "เงินเก็บ";
    return categories.find((c) => c.key === category)?.label || category;
  }, [type, category, categories]);

  useEffect(() => {
    setCategories(state.categories);
    if (category === null && state.categories.length > 0) {
      setCategory(state.categories[0].key);
    }
  }, [state.categories]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await refreshCategories();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (type === "save_in") setCategory("savings");
    else if (category === "savings") {
      setCategory(categories.length > 0 ? categories[0].key : null);
    }
  }, [type, categories]);

  const onSave = async () => {
    try {
      const amt = Number(amount);
      if (!amt || amt <= 0) return Alert.alert("จำนวนเงินไม่ถูกต้อง");

      const tx = {
        type,
        category: type === "save_in" ? "savings" : category,
        categoryLabel,
        amount: amt,
        note,
        date: editingTx?.date || new Date().toISOString(),
      };

      if (mode === "edit" && editingTx?.id) {
        await updateTransaction(editingTx.id, tx);
      } else {
        await addTransaction(tx);
      }

      navigation.goBack();
    } catch (e) {
      Alert.alert("บันทึกไม่สำเร็จ", e.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 16 }}>
      {/* Header */}
      <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "900" }}>
          {mode === "edit" ? "✏️ แก้ไขรายการ" : "➕ เพิ่มรายการ"}
        </Text>
      </View>

      {/* Type Selector */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: "900", fontSize: 14, marginBottom: 10 }}>ประเภท</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {TYPES.map((t) => (
            <Chip
              key={t.key}
              icon={t.key === "income" ? "📈" : t.key === "expense" ? "📉" : "🏦"}
              label={t.label}
              active={type === t.key}
              onPress={() => setType(t.key)}
            />
          ))}
        </View>
      </View>

      {/* Category Selector */}
      {type === "income" || type === "expense" ? (
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontWeight: "900", fontSize: 14 }}>หมวดหมู่</Text>
            <Pressable
              onPress={() => navigation.navigate("ManageCategories")}
              style={{ backgroundColor: "#667eea", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 }}
            >
              <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>+ เพิ่ม</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {categories.map((c) => (
              <Chip
                key={c.key}
                label={c.label}
                active={category === c.key}
                onPress={() => setCategory(c.key)}
              />
            ))}
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 14,
            padding: 14,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: "#F59E0B",
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 14, marginBottom: 6 }}>🏦 หมวดหมู่: เงินเก็บ</Text>
          <Text style={{ opacity: 0.7, fontSize: 13 }}>รายการนี้จะถูกนับเป็น "เงินเก็บสะสม"</Text>
        </View>
      )}

      {/* Amount Input */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontWeight: "900", fontSize: 14, marginBottom: 10 }}>จำนวนเงิน</Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 14,
            borderWidth: 2,
            borderColor: amount ? "#667eea" : "#e5e7eb",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 16 }}>฿</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#d1d5db"
            style={{
              flex: 1,
              paddingVertical: 14,
              fontSize: 18,
              fontWeight: "900",
            }}
          />
        </View>
      </View>

      {/* Note Input */}
      <View style={{ marginBottom: 20, flex: 1 }}>
        <Text style={{ fontWeight: "900", fontSize: 14, marginBottom: 10 }}>หมายเหตุ (ไม่บังคับ)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="เช่น กินข้าว, ซื้อเสื้อ, ค่าประกันรถ..."
          placeholderTextColor="#d1d5db"
          multiline
          numberOfLines={4}
          style={{
            backgroundColor: "white",
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            padding: 14,
            fontSize: 14,
            textAlignVertical: "top",
          }}
        />
      </View>

      {/* Save Button */}
      <Pressable
        onPress={onSave}
        style={{
          backgroundColor: "#667eea",
          padding: 16,
          borderRadius: 14,
          marginBottom: 20,
          shadowColor: "#667eea",
          shadowOpacity: 0.3,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "900", fontSize: 16 }}>
          💾 บันทึก
        </Text>
      </Pressable>
    </View>
  );
}