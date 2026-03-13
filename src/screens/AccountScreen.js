import { useCallback, useState } from "react";
import { View, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentUser } from "../storage/auth";
import { listTransactions } from "../storage/transactions";
import { summarize } from "../utils/calc";
import { formatMoney } from "../utils/format";

export default function AccountScreen() {
  const [sum, setSum] = useState({ total: 0, savings: 0, balance: 0, income: 0, expense: 0, saveIn: 0 });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const user = await getCurrentUser();
        if (!user) return;
        const txs = await listTransactions(user.id);
        setSum(summarize(txs));
      })();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 16 }}>
      {/* Header */}
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "900" }}>💎 บัญชีของฉัน</Text>
      </View>

      {/* Primary Card */}
      <Card
        icon="💰"
        label="ยอดเงินทั้งหมด"
        value={`${formatMoney(sum.total)} ฿`}
        description="เงินคงเหลือ + เงินเก็บ"
        color="#667eea"
      />

      {/* Balance Card */}
      <Card
        icon="📊"
        label="ยอดใช้ได้ตอนนี้"
        value={`${formatMoney(sum.balance)} ฿`}
        description="รายรับ - รายจ่าย - เงินเก็บ"
        color="#10B981"
      />

      {/* Savings Card */}
      <Card
        icon="🏆"
        label="เงินเก็บสะสม"
        value={`${formatMoney(sum.savings)} ฿`}
        description="จำนวนเงินที่ถูกเก็บไว้"
        color="#F59E0B"
      />

      {/* Income & Expense Row */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        <Card
          icon="📈"
          label="รายรับสะสม"
          value={`${formatMoney(sum.income)} ฿`}
          color="#10B981"
          small
        />
        <Card
          icon="📉"
          label="รายจ่ายสะสม"
          value={`${formatMoney(sum.expense)} ฿`}
          color="#EF4444"
          small
        />
      </View>

      {/* Summary Info */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 14,
          padding: 14,
          borderLeftWidth: 4,
          borderLeftColor: "#667eea",
        }}
      >
        <Text style={{ fontWeight: "900", fontSize: 13, marginBottom: 8 }}>ℹ️ สรุป</Text>
        <Text style={{ opacity: 0.7, fontSize: 12, lineHeight: 18 }}>
          ข้อมูลการเงินของคุณจะอัปเดตเมื่อคุณเพิ่มหรือแก้ไขรายการ ดูส่วน "สรุป" เพื่อวิเคราะห์การใช้จ่ายตามประเภท
        </Text>
      </View>
    </View>
  );
}

function Card({ label, value, icon, description, color, small }) {
  if (small) {
    return (
      <View style={{ flex: 1, marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: color,
            borderRadius: 14,
            padding: 12,
            gap: 8,
            shadowColor: color,
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={{ fontWeight: "700", fontSize: 12, color: "white", opacity: 0.9 }}>{label}</Text>
            <Text style={{ fontSize: 18 }}>{icon}</Text>
          </View>
          <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>{value}</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        gap: 8,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: color,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", opacity: 0.9, fontWeight: "700", fontSize: 13, marginBottom: 6 }}>
          {label}
        </Text>
        <Text style={{ color: "white", fontSize: 28, fontWeight: "900" }}>{value}</Text>
        {description ? (
          <Text style={{ color: "white", opacity: 0.7, fontSize: 12, marginTop: 4 }}>{description}</Text>
        ) : null}
      </View>
      <Text style={{ fontSize: 40 }}>{icon}</Text>
    </View>
  );
}