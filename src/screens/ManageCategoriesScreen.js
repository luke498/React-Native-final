import { useCallback, useState, useContext } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { addCategory, deleteCategory, getCategories, renameCategory } from "../storage/categories";
import { AppContext } from "../contexts/AppContext";

export default function ManageCategoriesScreen() {
  const { state } = useContext(AppContext);
  const userId = state.user?.id;

  const [cats, setCats] = useState([]);
  const [newName, setNewName] = useState("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setCats(await getCategories(userId));
      })();
    }, [userId])
  );

  const onAdd = async () => {
    try {
      const next = await addCategory(userId, newName);
      setCats(next);
      setNewName("");
    } catch (e) {
      Alert.alert("เพิ่มไม่สำเร็จ", e.message || "เกิดข้อผิดพลาด");
    }
  };

  const onRename = (item) => {
    Alert.prompt(
      "แก้ไขชื่อหมวดหมู่",
      `แก้ชื่อ "${item.label}" เป็นอะไรดี?`,
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "บันทึก",
          onPress: async (value) => {
            try {
              const next = await renameCategory(userId, item.id, value);
              setCats(next);
            } catch (e) {
              Alert.alert("แก้ไขไม่สำเร็จ", e.message || "เกิดข้อผิดพลาด");
            }
          },
        },
      ],
      "plain-text",
      item.label
    );
  };

  const onDelete = (item) => {
    Alert.alert(
      "ลบหมวดหมู่",
      `แน่ใจว่าจะลบ "${item.label}" ?\n\nหมายเหตุ: ธุรกรรมเก่าที่เคยใช้หมวดนี้ จะถูกแสดงเป็น "อื่นๆ"`,
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          style: "destructive",
          onPress: async () => {
            try {
              const next = await deleteCategory(userId, item.id); 
              setCats(next);
            } catch (e) {
              Alert.alert("ลบไม่สำเร็จ", e.message || "เกิดข้อผิดพลาด");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>จัดการหมวดหมู่</Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="เพิ่มหมวดใหม่ เช่น เสื้อผ้า"
          style={{ flex: 1, borderWidth: 1, borderRadius: 14, padding: 12 }}
        />
        <Pressable
          onPress={onAdd}
          style={{ backgroundColor: "#10b981", borderRadius: 14, paddingHorizontal: 14, justifyContent: "center" }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>เพิ่ม</Text>
        </Pressable>
      </View>

      <FlatList
        data={cats}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 16,
              padding: 12,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ fontWeight: "900", fontSize: 16 }}>{item.label}</Text>
              <Text style={{ opacity: 0.6 }}>
                {item.isDefault ? "🏷️ หมวดเริ่มต้น (แก้/ลบได้)" : "👤 หมวดของคุณ"}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => onRename(item)}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 12 }}
              >
                <Text style={{ fontWeight: "900" }}>แก้ไข</Text>
              </Pressable>

              <Pressable
                onPress={() => onDelete(item)}
                style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: "#fee2e2" }}
              >
                <Text style={{ fontWeight: "900", color: "#b91c1c" }}>ลบ</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}