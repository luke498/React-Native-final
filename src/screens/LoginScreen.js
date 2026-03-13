import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from "react-native";
import { loginUser } from "../storage/auth";
import { AppContext } from "../contexts/AppContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerSection: {
    backgroundColor: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerSectionWeb: {
    backgroundColor: "#667EEA",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  appLogo: {
    fontSize: 48,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  appDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    fontStyle: "italic",
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
  loginButton: {
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
  loginButtonPressed: {
    backgroundColor: "#5568D3",
  },
  loginButtonText: {
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

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { refreshUser } = useContext(AppContext);

  const onLogin = async () => {
    try {
      if (!username || !password) return Alert.alert("กรอกข้อมูลให้ครบ");
      await loginUser({ username: username.trim(), password });
      await refreshUser();
      navigation.replace("Main");
    } catch (e) {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", e.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with App Info */}
      <View style={styles.headerSectionWeb}>
        <Text style={styles.appLogo}>💰</Text>
        <Text style={styles.appTitle}>BudgetTracker</Text>
        <Text style={styles.appDescription}>แอปบันทึกรายรับ/รายจ่าย</Text>
        <Text style={styles.tagline}>จัดการการเงิน ติดตามรายรับรายจ่าย ได้อย่างง่าย</Text>
      </View>

      {/* Form Section */}
      <View style={styles.contentSection}>
        <View style={styles.formSection}>
          <View>
            <Text style={styles.inputLabel}>ชื่อผู้ใช้</Text>
            <TextInput
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
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
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
              placeholderTextColor="#999"
              style={[styles.input, passwordFocused && styles.inputFocused]}
            />
          </View>

          <Pressable 
            onPress={onLogin}
            style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}
          >
            <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
          </Pressable>
        </View>

        {/* Sign Up Link */}
        <View style={styles.linkSection}>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>ยังไม่มีบัญชี? สมัครสมาชิก</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}