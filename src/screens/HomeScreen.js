import { useCallback, useState, useMemo, useContext } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { AppContext } from "../contexts/AppContext";
import { summarize } from "../utils/calc";
import { formatMoney } from "../utils/format";
import BudgetCard from "../components/BudgetCard";
import { filterByCycle, CYCLES } from "../utils/cycle";

export default function HomeScreen({ navigation }) {
  const { state } = useContext(AppContext);

  const [username, setUsername] = useState(state.user?.username || "");
  const [cycle, setCycle] = useState(CYCLES.MONTH);
  const [txs, setTxs] = useState(state.transactions);

  useFocusEffect(
    useCallback(() => {
      setUsername(state.user?.username || "");
      setTxs(state.transactions);
    }, [state.user, state.transactions])
  );

  const cycleLabel = useMemo(
    () => ({
      [CYCLES.DAY]: "รายวัน",
      [CYCLES.WEEK]: "รายสัปดาห์",
      [CYCLES.MONTH]: "รายเดือน",
    }),
    []
  );

  const filteredTxs = useMemo(() => filterByCycle(txs, cycle), [txs, cycle]);

  const sum = useMemo(() => summarize(filteredTxs), [filteredTxs]);

  const expenseThisCycle = useMemo(() => {
    return filteredTxs
      .filter((t) => t?.type === "expense")
      .reduce((total, t) => total + Number(t?.amount || 0), 0);
  }, [filteredTxs]);

  const isNegative = sum.balance < 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 110 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: "900" }}>👋 สวัสดี, {username}</Text>
          <Text style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>ยินดีต้อนรับกลับมา</Text>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>

          {/* ✅ แจ้งเตือนสีแดงเมื่อยอดติดลบ */}
          {isNegative && (
            <View
              style={{
                backgroundColor: "#fee2e2",
                borderRadius: 14,
                padding: 14,
                borderLeftWidth: 4,
                borderLeftColor: "#ef4444",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={{ fontSize: 22 }}>🚨</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "900", color: "#b91c1c", fontSize: 14 }}>
                  ใช้จ่ายเกินรายรับแล้ว!
                </Text>
                <Text style={{ color: "#dc2626", fontSize: 12, marginTop: 2 }}>
                  รายจ่ายมากกว่ารายรับ {formatMoney(Math.abs(sum.balance))} ฿ ในช่วงนี้
                </Text>
              </View>
            </View>
          )}

          {/* Balance Card */}
          <View
            style={{
              backgroundColor: isNegative ? "#ef4444" : "#667eea", 
              borderRadius: 20,
              padding: 24,
              gap: 12,
              shadowColor: isNegative ? "#ef4444" : "#667eea",
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 8 },
              elevation: 8,
            }}
          >
            <Text style={{ color: "white", opacity: 0.9, fontWeight: "700", fontSize: 14 }}>
              💰 ยอดเงินคงเหลือ (ตามรอบตัดยอด)
            </Text>

            <Text style={{ color: "white", fontSize: 42, fontWeight: "900" }}>
              {formatMoney(sum.balance)} ฿
            </Text>

            <Text style={{ color: "white", opacity: 0.7, fontSize: 12 }}>
              รายรับ {formatMoney(sum.income)} ฿ • รายจ่าย {formatMoney(sum.expense)} ฿
            </Text>
          </View>

          {/* ปุ่มเลือกช่วงตัดยอด */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => setCycle(CYCLES.DAY)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                backgroundColor: cycle === CYCLES.DAY ? "#6366f1" : "#e5e7eb",
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: "900", color: cycle === CYCLES.DAY ? "white" : "black" }}>
                1 วัน
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCycle(CYCLES.WEEK)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                backgroundColor: cycle === CYCLES.WEEK ? "#6366f1" : "#e5e7eb",
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: "900", color: cycle === CYCLES.WEEK ? "white" : "black" }}>
                1 อาทิตย์
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setCycle(CYCLES.MONTH)}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                backgroundColor: cycle === CYCLES.MONTH ? "#6366f1" : "#e5e7eb",
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: "900", color: cycle === CYCLES.MONTH ? "white" : "black" }}>
                1 เดือน
              </Text>
            </Pressable>
          </View>

          {/* สถานะรอบตัดยอด */}
          <View style={{ alignItems: "center", marginTop: -6 }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ fontSize: 12, opacity: 0.8, fontWeight: "800" }}>
                📊 กำลังแสดงข้อมูลแบบ: {cycleLabel[cycle]}
              </Text>
            </View>
          </View>

          {/* Budget */}
          <BudgetCard
            navigation={navigation}
            expenseThisMonth={expenseThisCycle}
            transactions={filteredTxs}
          />

          {/* Quick Stats */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <StatBox title="เงินเก็บ" value={formatMoney(sum.savings)} color="#10B981" icon="🏆" />
            {/* ✅ เปลี่ยนสีตาม positive/negative */}
            <StatBox
              title="ยอดคงเหลือสุทธิ"
              value={formatMoney(sum.total)}
              color={sum.total < 0 ? "#ef4444" : "#3B82F6"}
              icon={sum.total < 0 ? "⚠️" : "💎"}
            />
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 10, marginTop: 8 }}>
            <Pressable
              onPress={() => navigation.navigate("TransactionForm", { mode: "create" })}
              style={{
                backgroundColor: "#10B981",
                padding: 16,
                borderRadius: 14,
                shadowColor: "#10B981",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
              }}
            >
              <Text style={{ color: "white", textAlign: "center", fontWeight: "900", fontSize: 16 }}>
                ➕ เพิ่มรายการ
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("History")}
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: "#e5e7eb",
              }}
            >
              <Text style={{ textAlign: "center", fontWeight: "900", fontSize: 16 }}>
                📋 ธุรกรรมทั้งหมด
              </Text>
            </Pressable>
          </View>

          {/* Tip */}
          <View style={{ marginTop: 8, padding: 12, backgroundColor: "white", borderRadius: 14 }}>
            <Text style={{ fontSize: 12, opacity: 0.7, lineHeight: 18 }}>
              ℹ️ <Text style={{ fontWeight: "700" }}>เคล็ดลับ:</Text> ดูส่วน "สรุป" เพื่อวิเคราะห์การใช้จ่ายตามหมวดหมู่
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ title, value, color, icon }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color,
        borderRadius: 14,
        padding: 14,
        gap: 8,
        shadowColor: color,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "700", fontSize: 13, color: "white", opacity: 0.9 }}>{title}</Text>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <Text style={{ color: "white", fontWeight: "900", fontSize: 18 }}>{value} ฿</Text>
    </View>
  );
}