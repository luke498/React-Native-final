import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#667eea",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          paddingBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "หน้าแรก",
          tabBarLabel: "หน้าแรก",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "บัญชี",
          tabBarLabel: "บัญชี",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💎</Text>,
        }}
      />

      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: "สรุป",
          tabBarLabel: "สรุป",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "ตั้งค่า",
          tabBarLabel: "ตั้งค่า",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}