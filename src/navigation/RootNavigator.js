import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import TransactionFormScreen from "../screens/TransactionFormScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ManageCategoriesScreen from "../screens/ManageCategoriesScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />

      <Stack.Screen name="TransactionForm" component={TransactionFormScreen} options={{ title: "เพิ่ม/แก้ไขรายการ" }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: "ธุรกรรมทั้งหมด" }} />
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} options={{ title: "จัดการหมวดหมู่" }} />
    </Stack.Navigator>
  );
}