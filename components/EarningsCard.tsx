import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../constants/colors";
import { useSubmissionsStore } from "../store/submissionsStore";

export function EarningsCard() {
  const totalEarnings = useSubmissionsStore((s) => s.totalEarnings);
  const submissions   = useSubmissionsStore((s) => s.submissions);

  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const pendingCount  = submissions.filter((s) => s.status === "pending").length;
  const pendingValue  = submissions.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.payout, 0);
  const approvalRate  = submissions.length > 0 ? Math.round((approvedCount / submissions.length) * 100) : 0;

  const animVal = useRef(new Animated.Value(totalEarnings)).current;
  const [displayNum, setDisplayNum] = useState(totalEarnings);

  useEffect(() => {
    Animated.timing(animVal, { toValue: totalEarnings, duration: 800, useNativeDriver: false }).start();
    const id = animVal.addListener(({ value }) => setDisplayNum(Math.round(value)));
    return () => animVal.removeListener(id);
  }, [totalEarnings]);

  return (
    <View style={{
      backgroundColor: C.card, borderRadius: 20,
      borderWidth: 1, borderColor: C.border,
      padding: 20, marginBottom: 24,
      ...C.shadowMd,
    }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 11, fontWeight: "700", color: C.textDim, letterSpacing: 0.6, marginBottom: 6 }}>
            THIS MONTH
          </Text>
          <Text style={{ fontSize: 38, fontWeight: "800", color: C.text, letterSpacing: -1.5, lineHeight: 42 }}>
            ${displayNum.toLocaleString("en-US")}
          </Text>
          <Text style={{ color: C.textMid, fontSize: 13, marginTop: 2 }}>total earned</Text>
        </View>
        <View style={{
          width: 44, height: 44, borderRadius: 12,
          backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder,
          alignItems: "center", justifyContent: "center",
        }}>
          <Ionicons name="trending-up" size={20} color={C.greenText} />
        </View>
      </View>

      {/* Stats row */}
      <View style={{
        flexDirection: "row", backgroundColor: C.bg,
        borderRadius: 12, padding: 12,
        borderWidth: 1, borderColor: C.border,
      }}>
        {[
          { label: "Approved", value: String(approvedCount), color: C.greenText },
          { label: "Pending",  value: String(pendingCount),  color: C.amber },
          { label: "Rate",     value: `${approvalRate}%`,    color: C.text },
        ].map((stat, i) => (
          <React.Fragment key={i}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: stat.color, letterSpacing: -0.5 }}>
                {stat.value}
              </Text>
              <Text style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{stat.label}</Text>
            </View>
            {i < 2 && <View style={{ width: 1, backgroundColor: C.border, marginVertical: 2 }} />}
          </React.Fragment>
        ))}
      </View>

      {/* Pending notice */}
      {pendingCount > 0 && (
        <View style={{
          flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 5,
          marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.border,
        }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.amber }} />
          <Text style={{ color: C.amber, fontSize: 13, fontWeight: "600" }}>
            ${pendingValue.toLocaleString("en-US")} pending
          </Text>
          <Text style={{ color: C.textMid, fontSize: 13 }}>
            · {pendingCount} {pendingCount === 1 ? "review" : "reviews"} in progress
          </Text>
        </View>
      )}
    </View>
  );
}
