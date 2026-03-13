import { View, Text, Pressable } from "react-native";

export default function ServicesScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 16 }}>
      {/* Header */}
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "900" }}>📝 ทำธุรกรรม</Text>
        <Text style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>เพิ่มรายรับ, รายจ่าย หรือเงินเก็บของคุณ</Text>
      </View>

      {/* Quick Action Buttons */}
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
        <ServiceBtn
          icon="📈"
          label="เพิ่มรายรับ"
          color="#10B981"
          onPress={() => navigation.navigate("TransactionForm", { mode: "create", presetType: "income" })}
        />
        <ServiceBtn
          icon="📉"
          label="บันทึกรายจ่าย"
          color="#EF4444"
          onPress={() => navigation.navigate("TransactionForm", { mode: "create", presetType: "expense" })}
        />
        <ServiceBtn
          icon="🏦"
          label="เงินเก็บ"
          color="#F59E0B"
          onPress={() => navigation.navigate("TransactionForm", { mode: "create", presetType: "save_in" })}
        />
      </View>

      {/* Info Card */}
      <View style={{ backgroundColor: "white", borderRadius: 14, padding: 14, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: "#667eea" }}>
        <Text style={{ fontWeight: "900", fontSize: 13, marginBottom: 8 }}>📚 ธุรกรรมของคุณคืออะไร?</Text>
        <Text style={{ fontSize: 12, opacity: 0.7, lineHeight: 18 }}>
          <Text style={{ fontWeight: "700" }}>📈 รายรับ:</Text> เงินที่คุณได้รับ{"\n"}
          <Text style={{ fontWeight: "700" }}>📉 รายจ่าย:</Text> เงินที่คุณใช้จ่าย{"\n"}
          <Text style={{ fontWeight: "700" }}>🏦 เงินเก็บ:</Text> เงินที่คุณต้องการออม
        </Text>
      </View>

      {/* View All Transactions */}
      <Pressable
        onPress={() => navigation.navigate("History")}
        style={{
          backgroundColor: "#667eea",
          borderRadius: 14,
          padding: 16,
          shadowColor: "#667eea",
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "900", fontSize: 16 }}>
          📋 ดูธุรกรรมทั้งหมด
        </Text>
      </Pressable>
    </View>
  );
}

function ServiceBtn({ icon, label, color, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: color,
        padding: 16,
        borderRadius: 14,
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: color,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: 24 }}>{icon}</Text>
      <Text style={{ color: "white", textAlign: "center", fontWeight: "900", fontSize: 12 }}>{label}</Text>
    </Pressable>
  );
}