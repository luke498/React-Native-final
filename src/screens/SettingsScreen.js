import { useCallback, useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getCurrentUser, logout } from "../storage/auth";

export default function SettingsScreen({ navigation }) {
  const [username, setUsername] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const user = await getCurrentUser();
        if (user) setUsername(user.username);
      })();
    }, [])
  );

  const onLogout = async () => {
    Alert.alert("ออกจากระบบ", "แน่ใจว่าจะออกจากระบบ?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ออกจากระบบ",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.replace("Auth");
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb", paddingHorizontal: 16 }}>
      {/* Header */}
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "900" }}>⚙️ ตั้งค่า</Text>
      </View>

      {/* User Card */}
      <View
        style={{
          backgroundColor: "#667eea",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          gap: 8,
          shadowColor: "#667eea",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        }}
      >
        <Text style={{ color: "white", opacity: 0.9, fontWeight: "700", fontSize: 13 }}>บัญชีของคุณ</Text>
        <Text style={{ color: "white", fontSize: 24, fontWeight: "900" }}>{username}</Text>
        <Text style={{ color: "white", opacity: 0.7, fontSize: 12, marginTop: 4 }}>
          
        </Text>
      </View>

      {/* Settings Options */}
      <View style={{ gap: 12, marginBottom: 24 }}>
        <Pressable
          onPress={() => navigation.navigate("ManageCategories")}
          style={{ backgroundColor: "white", borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#e5e7eb" }}
        >
          <Text style={{ fontSize: 20 }}>🏷️</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "900", fontSize: 14 }}>จัดการหมวดหมู่</Text>
            <Text style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>เพิ่ม, แก้ไข, ลบหมวดหมู่</Text>
          </View>
          <Text style={{ fontSize: 14, opacity: 0.5 }}>›</Text>
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable
        onPress={onLogout}
        style={{
          backgroundColor: "#EF4444",
          borderRadius: 14,
          padding: 16,
          shadowColor: "#EF4444",
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "900", fontSize: 16 }}>
          🚪 ออกจากระบบ
        </Text>
      </Pressable>
    </View>
  );
}