import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from "react-native";
import { registerUser } from "../storage/auth";
import { AppContext } from "../contexts/AppContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerSection: {
    backgroundColor: "#667EEA",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  appLogo: {
    fontSize: 40,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "white",
    marginBottom: 6,
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  contentSection: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  formSection: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "white",
    color: "#333",
  },
  inputFocused: {
    borderColor: "#667EEA",
    backgroundColor: "#F5F7FF",
  },
  registerButton: {
    backgroundColor: "#667EEA",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonPressed: {
    backgroundColor: "#5568D3",
  },
  registerButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  linkSection: {
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    textAlign: "center",
    color: "#667EEA",
    fontWeight: "600",
  },
});

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const { refreshUser } = useContext(AppContext);

  const onRegister = async () => {
    try {
      if (!username || !password || !confirm) return Alert.alert("กรอกข้อมูลให้ครบ");
      if (password !== confirm) return Alert.alert("รหัสผ่านไม่ตรงกัน");
      await registerUser({ username: username.trim(), password });
      await refreshUser();
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("สมัครสมาชิกไม่สำเร็จ", e.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.appLogo}>💰</Text>
        <Text style={styles.appTitle}>สร้างบัญชี</Text>
        <Text style={styles.appSubtitle}>เข้าร่วม BudgetTracker วันนี้</Text>
      </View>

      {/* Form Section */}
      <View style={styles.contentSection}>
        <View style={styles.formSection}>
          <View>
            <Text style={styles.inputLabel}>ชื่อผู้ใช้</Text>
            <TextInput
              placeholder="สร้างชื่อผู้ใช้ของคุณ"
              value={username}
              onChangeText={setUsername}
              onFocus={() => setUsernameFocused(true)}
              onBlur={() => setUsernameFocused(false)}
              autoCapitalize="none"
              placeholderTextColor="#999"
              style={[styles.input, usernameFocused && styles.inputFocused]}
            />
          </View>

          <View>
            <Text style={styles.inputLabel}>รหัสผ่าน</Text>
            <TextInput
              placeholder="สร้างรหัสผ่านที่ปลอดภัย"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
              placeholderTextColor="#999"
              style={[styles.input, passwordFocused && styles.inputFocused]}
            />
          </View>

          <View>
            <Text style={styles.inputLabel}>ยืนยันรหัสผ่าน</Text>
            <TextInput
              placeholder="ยืนยันรหัสผ่านของคุณ"
              value={confirm}
              onChangeText={setConfirm}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              secureTextEntry
              placeholderTextColor="#999"
              style={[styles.input, confirmFocused && styles.inputFocused]}
            />
          </View>

          <Pressable 
            onPress={onRegister}
            style={({ pressed }) => [styles.registerButton, pressed && styles.registerButtonPressed]}
          >
            <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
          </Pressable>
        </View>

        {/* Sign In Link */}
        <View style={styles.linkSection}>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkText}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}