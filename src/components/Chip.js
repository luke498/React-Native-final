import React from "react";
import { Pressable, Text } from "react-native";

export default function Chip({ label, icon, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: active ? "#667eea" : "white",
        borderColor: active ? "#667eea" : "#e5e7eb",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      {icon ? <Text>{icon}</Text> : null}
      <Text style={{ color: active ? "white" : "#333", fontWeight: "900", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}
