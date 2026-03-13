import { Alert } from "react-native";

export function confirmWithdrawTroll(amount, onConfirm) {
  Alert.alert("แน่ใจหรอ?", `จะถอนเงินเก็บ ${amount} บาทนะ`, [
    { text: "ยกเลิก", style: "cancel" },
    {
      text: "ต่อไป",
      onPress: () => {
        Alert.alert("คิดดีแล้วใช่ไหม", "เงินเก็บนะ…", [
          { text: "ยกเลิก", style: "cancel" },
          {
            text: "ต่อไป",
            onPress: () => {
              Alert.alert(
                "ครั้งสุดท้ายละ",
                "ยืนยันจริง ๆ ใช่ไหม (ห้ามมาร้องทีหลังนะ)",
                [
                  { text: "ยกเลิก", style: "cancel" },
                  { text: "ยืนยันถอน", style: "destructive", onPress: onConfirm },
                ]
              );
            },
          },
        ]);
      },
    },
  ]);
}

export function confirmWithdrawSimple(amount, onConfirm) {
  Alert.alert("ยืนยันถอนเงินเก็บ", `ถอน ${amount} บาท ใช่ไหม`, [
    { text: "ยกเลิก", style: "cancel" },
    { text: "ยืนยัน", style: "destructive", onPress: onConfirm },
  ]);
}