import { useCallback, useState, useContext, useMemo } from "react";
import { View, Text, FlatList, Pressable, Alert, TextInput } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { AppContext } from "../contexts/AppContext";
import { formatDate, formatMoney } from "../utils/format";

const typeLabel = (t) =>
  t === "income" ? "รายรับ" : t === "expense" ? "รายจ่าย" : "เงินเก็บ";

const typeColor = (t) =>
  t === "income" ? "#10B981" : t === "expense" ? "#EF4444" : "#F59E0B";

const typeIcon = (t) =>
  t === "income" ? "📈" : t === "expense" ? "📉" : "🏦";

export default function HistoryScreen({ navigation }) {
  const { state, deleteTransaction } = useContext(AppContext);

  const [txs, setTxs] = useState(state.transactions);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  useFocusEffect(
    useCallback(() => {
      setTxs(state.transactions);
    }, [state.transactions])
  );

  const onDelete = (id) => {
    Alert.alert("ลบรายการ", "แน่ใจว่าต้องการลบ?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          await deleteTransaction(id);
          setTxs(state.transactions.filter((t) => t.id !== id));
        },
      },
    ]);
  };

  const filteredTransactions = useMemo(() => {
    return txs.filter((t) => {
      const matchSearch =
        (t.note || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.category || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.categoryLabel || "").toLowerCase().includes(search.toLowerCase());

      const matchType = filterType === "all" || t.type === filterType;

      return matchSearch && matchType;
    });
  }, [txs, search, filterType]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: "900" }}>📋 ธุรกรรมทั้งหมด</Text>
        <Text style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
          แสดง {filteredTransactions.length} / {txs.length} รายการ
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <TextInput
          placeholder="🔎 ค้นหาหมวดหรือโน้ต..."
          value={search}
          onChangeText={setSearch}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 10 }}>
        {[
          { label: "ทั้งหมด", value: "all" },
          { label: "รายรับ", value: "income" },
          { label: "รายจ่าย", value: "expense" },
          { label: "เงินเก็บ", value: "save_in" }, 
        ].map((btn) => (
          <Pressable
            key={btn.value}
            onPress={() => setFilterType(btn.value)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: filterType === btn.value ? "#6366f1" : "#e5e7eb",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: filterType === btn.value ? "white" : "black",
                fontWeight: "700",
                fontSize: 12,
              }}
            >
              {btn.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {filteredTransactions.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 48 }}>📭</Text>
          <Text style={{ opacity: 0.6, fontWeight: "700" }}>ไม่พบรายการ</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 30 }}
          renderItem={({ item }) => {
            const color = typeColor(item.type);

            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("TransactionForm", { mode: "edit", tx: item })
                }
                style={{
                  backgroundColor: "white",
                  borderRadius: 14,
                  padding: 14,
                  gap: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: color,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{typeIcon(item.type)}</Text>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "900", fontSize: 14 }}>
                        {item.categoryLabel || item.category}
                      </Text>

                      <Text style={{ opacity: 0.6, fontSize: 12 }}>
                        {typeLabel(item.type)} • {formatDate(item.date)}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontWeight: "900",
                      fontSize: 16,
                      color: color,
                    }}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {formatMoney(item.amount)} ฿
                  </Text>
                </View>

                {item.note ? (
                  <Text
                    style={{
                      opacity: 0.7,
                      fontSize: 12,
                      paddingLeft: 34,
                      fontStyle: "italic",
                    }}
                  >
                    💬 {item.note}
                  </Text>
                ) : null}

                <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("TransactionForm", { mode: "edit", tx: item })
                    }
                    style={{
                      flex: 1,
                      backgroundColor: color,
                      borderRadius: 10,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "800",
                        color: "white",
                        fontSize: 13,
                      }}
                    >
                      ✏️ แก้ไข
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => onDelete(item.id)}
                    style={{
                      flex: 1,
                      backgroundColor: "#fee2e2",
                      borderRadius: 10,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "800",
                        color: "#dc2626",
                        fontSize: 13,
                      }}
                    >
                      🗑️ ลบ
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}