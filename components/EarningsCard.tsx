import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { C } from "../constants/colors";
import { useSubmissionsStore } from "../store/submissionsStore";

export function EarningsCard() {
  const totalEarnings  = useSubmissionsStore((s) => s.totalEarnings);
  const submissions    = useSubmissionsStore((s) => s.submissions);

  const approvedCount  = submissions.filter((s) => s.status === "approved").length;
  const pendingCount   = submissions.filter((s) => s.status === "pending").length;
  const pendingValue   = submissions
    .filter((s) => s.status === "pending")
    .reduce((sum, s) => sum + s.payout, 0);
  const totalCount     = submissions.length;
  const approvalRate   = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  // Animated earnings counter
  const animVal = useRef(new Animated.Value(totalEarnings)).current;
  const [displayNum, setDisplayNum] = useState(totalEarnings);

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: totalEarnings,
      duration: 800,
      useNativeDriver: false,
    }).start();
    const id = animVal.addListener(({ value }) => setDisplayNum(Math.round(value)));
    return () => animVal.removeListener(id);
  }, [totalEarnings]);

  return (
    <View style={{ marginBottom: 28, borderRadius: 22, overflow: "hidden", ...C.shadowMd }}>
      <LinearGradient
        colors={["#f0fdf4", "#dcfce7", "#bbf7d0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 20,
          borderWidth: 1,
          borderColor: C.greenBorder,
          borderRadius: 22,
        }}
      >
        {/* Top specular */}
        <View style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 22,
        }} />

        {/* Header row */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.green }} />
              <Text style={{ color: C.greenText, fontSize: 11, fontWeight: "700", letterSpacing: 1.2 }}>
                THIS MONTH
              </Text>
            </View>
            <Text style={{ color: C.text, fontSize: 44, fontWeight: "800", letterSpacing: -2, lineHeight: 48 }}>
              ${displayNum.toLocaleString("en-US")}
            </Text>
            <Text style={{ color: C.textMid, fontSize: 13, marginTop: 3 }}>total earned</Text>
          </View>

          <View style={{
            width: 48, height: 48, borderRadius: 15,
            backgroundColor: C.greenBgMid,
            alignItems: "center", justifyContent: "center",
            borderWidth: 1, borderColor: C.greenBorder,
          }}>
            <Ionicons name="trending-up" size={22} color={C.green} />
          </View>
        </View>

        {/* Stats row */}
        <View style={{
          flexDirection: "row",
          backgroundColor: "rgba(255,255,255,0.6)",
          borderRadius: 14, padding: 12,
          borderWidth: 1, borderColor: "rgba(22,163,74,0.15)",
          gap: 0,
        }}>
          {[
            { icon: "checkmark-circle-outline" as const, label: "Approved", value: String(approvedCount), color: C.green },
            { icon: "hourglass-outline" as const,         label: "Pending",  value: String(pendingCount),  color: C.amber },
            { icon: "bar-chart-outline" as const,         label: "Rate",     value: `${approvalRate}%`,    color: C.text },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Ionicons name={stat.icon} size={14} color={stat.color} style={{ marginBottom: 4 }} />
                <Text style={{ color: stat.color, fontSize: 16, fontWeight: "800", letterSpacing: -0.5 }}>
                  {stat.value}
                </Text>
                <Text style={{ color: C.textDim, fontSize: 10, marginTop: 2 }}>{stat.label}</Text>
              </View>
              {i < 2 && (
                <View style={{ width: 1, backgroundColor: "rgba(22,163,74,0.18)", marginVertical: 2 }} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Pending payout row */}
        {pendingCount > 0 && (
          <View style={{
            marginTop: 12, paddingTop: 12,
            borderTopWidth: 1, borderTopColor: C.greenBorder,
            flexDirection: "row", alignItems: "center", gap: 8,
          }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.amber }} />
            <Text style={{ color: C.textMid, fontSize: 13, flex: 1 }}>
              <Text style={{ fontWeight: "700", color: C.amber }}>
                ${pendingValue.toLocaleString("en-US")} pending
              </Text>
              {" "}· {pendingCount} {pendingCount === 1 ? "review" : "reviews"} in progress
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}
