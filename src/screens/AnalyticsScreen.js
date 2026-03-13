import { useCallback, useMemo, useState, useContext } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";

import { AppContext } from "../contexts/AppContext";
import { formatMoney } from "../utils/format";
import { toNumber, toDate, startOfToday, startOfMonth, startOfYear, startOfLastNDays } from "../utils/date";
import Chip from "../components/Chip";

const W = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const { state } = useContext(AppContext);
  const [txs, setTxs] = useState(state.transactions);
  const [range, setRange] = useState("all");
  const [categories, setCategories] = useState(state.categories);

  useFocusEffect(
    useCallback(() => {
      setTxs(state.transactions);
      setCategories(state.categories);
    }, [state.transactions, state.categories])
  );

  const filtered = useMemo(() => {
    if (range === "all") return txs;

    const from =
      range === "today"
        ? startOfToday()
        : range === "week"
        ? startOfLastNDays(7)
        : range === "month"
        ? startOfMonth()
        : startOfYear();

    return txs.filter((t) => {
      const d = toDate(t?.date);
      if (!d) return false;
      return d >= from;
    });
  }, [txs, range]);

  const totals = useMemo(() => {
    let income = 0,
      expense = 0,
      saveIn = 0;

    for (const t of filtered) {
      const amt = toNumber(t?.amount);
      if (t?.type === "income") income += amt;
      else if (t?.type === "expense") expense += amt;
      else if (t?.type === "save_in") saveIn += amt;
    }

    const net = income - expense - saveIn;
    return { income, expense, saveIn, net };
  }, [filtered]);

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"];
  
  const pieData = useMemo(() => {
    const expenseTx = filtered.filter((t) => t?.type === "expense");

    if (expenseTx.length === 0) {
      return [
        {
          name: "ยังไม่มีข้อมูล",
          population: 1,
          color: "#d0d0d0",
          legendFontColor: "#333",
          legendFontSize: 12,
        },
      ];
    }

    const map = new Map();
    for (const t of expenseTx) {
      const key = t?.category;
      if (!key) continue;
      map.set(key, (map.get(key) || 0) + toNumber(t?.amount));
    }

    return Array.from(map.entries())
      .map(([key, total], idx) => ({
        name: categories.find((c) => c.key === key)?.label || key,
        population: total,
        color: colors[idx % colors.length],
        legendFontColor: "#333",
        legendFontSize: 12,
      }))
      .sort((a, b) => b.population - a.population);
  }, [filtered, categories]);

  const rangeTitle =
    range === "today"
      ? "วันนี้"
      : range === "week"
      ? "7 วันล่าสุด"
      : range === "month"
      ? "เดือนนี้"
      : range === "year"
      ? "ปีนี้"
      : "ทั้งหมด";

  const spendAlert = totals.expense > totals.income && (totals.expense > 0 || totals.income > 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: "900", marginBottom: 4 }}>สรุปการเงิน</Text>
        <Text style={{ opacity: 0.6, fontSize: 13 }}>ช่วงเวลา: {rangeTitle}</Text>
      </View>

      {/* Range Selector */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 16, paddingBottom: 12 }}>
        <Chip label="วันนี้" active={range === "today"} onPress={() => setRange("today")} />
        <Chip label="7 วัน" active={range === "week"} onPress={() => setRange("week")} />
        <Chip label="เดือนนี้" active={range === "month"} onPress={() => setRange("month")} />
        <Chip label="ปีนี้" active={range === "year"} onPress={() => setRange("year")} />
        <Chip label="ทั้งหมด" active={range === "all"} onPress={() => setRange("all")} />
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Summary Cards */}
        <View style={{ gap: 10, marginBottom: 16 }}>
          <StatCard 
            title="รายรับ" 
            value={formatMoney(totals.income)} 
            color="#10B981"
            icon="📈"
          />
          <StatCard 
            title="รายจ่าย" 
            value={formatMoney(totals.expense)} 
            color="#EF4444"
            icon="📉"
          />
          <StatCard 
            title="เงินเหลือใช้" 
            value={formatMoney(totals.net)} 
            color={totals.net >= 0 ? "#3B82F6" : "#F59E0B"}
            icon={totals.net >= 0 ? "✅" : "⚠️"}
          />
        </View>

        {/* Pie Chart */}
        <View style={{ backgroundColor: "white", borderRadius: 16, padding: 12, marginBottom: 16, marginHorizontal: -16, paddingHorizontal: 16 }}>
          <Text style={{ fontWeight: "900", fontSize: 16, marginBottom: 12 }}>การใช้จ่ายตามหมวดหมู่</Text>
          <View style={{ alignItems: "center" }}>
            <PieChart
              data={pieData}
              width={W - 32}
              height={240}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
              hasLegend={true}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function StatCard({ title, value, color, icon }) {
  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ color: "white", opacity: 0.9, fontWeight: "700", fontSize: 13, marginBottom: 4 }}>
          {title}
        </Text>
        <Text style={{ color: "white", fontWeight: "900", fontSize: 22 }}>{value} ฿</Text>
      </View>
      <Text style={{ fontSize: 32 }}>{icon}</Text>
    </View>
  );
}

function MiniCard({ title, value }) {
  return (
    <View style={{ flex: 1, borderWidth: 1, borderRadius: 14, padding: 10, gap: 4 }}>
      <Text style={{ opacity: 0.7, fontWeight: "800" }}>{title}</Text>
      <Text style={{ fontWeight: "900" }}>{value}</Text>
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <Text style={{ opacity: 0.8, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
  labelColor: () => "#333",
};