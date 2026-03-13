import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { getSession } from "../storage/auth";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      const s = await getSession();
      navigation.replace(s?.userId ? "Main" : "Auth");
    })();
  }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Expense Bank</Text>
      <ActivityIndicator />
      <Text style={{ opacity: 0.6 }}>กำลังโหลด...</Text>
    </View>
  );
}