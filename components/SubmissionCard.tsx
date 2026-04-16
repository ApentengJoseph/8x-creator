import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../constants/colors";
import { Submission } from "../types";
import { formatPayout, formatTimeAgo } from "../utils/formatters";

const STATUS = {
  pending: {
    label: "Under review",
    icon: "hourglass-outline" as const,
    iconColor: C.amber,
    pillBg: C.amberBg,
    pillBorder: C.amberBorder,
    pillText: C.amber,
    accentBar: C.amber,
  },
  approved: {
    label: "Approved",
    icon: "checkmark-circle" as const,
    iconColor: C.green,
    pillBg: C.greenBg,
    pillBorder: C.greenBorder,
    pillText: C.greenText,
    accentBar: C.green,
  },
  rejected: {
    label: "Needs revision",
    icon: "close-circle" as const,
    iconColor: C.red,
    pillBg: C.redBg,
    pillBorder: C.redBorder,
    pillText: C.red,
    accentBar: C.red,
  },
};

export function SubmissionCard({ submission }: { submission: Submission }) {
  const router = useRouter();
  const cfg = STATUS[submission.status];

  return (
    <View
      style={{
        backgroundColor: C.card,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: C.border,
        overflow: "hidden",
        ...C.shadow,
      }}
    >
      {/* Top specular */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.9)" }} />

      {/* Colored accent bar left */}
      <View style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 3, backgroundColor: cfg.accentBar, borderRadius: 2, opacity: 0.8 }} />

      <View style={{ padding: 16, paddingLeft: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "600", letterSpacing: 0.4, marginBottom: 4 }}>
              {submission.brandName.toUpperCase()}
            </Text>
            <Text style={{ color: C.text, fontSize: 15, fontWeight: "600", lineHeight: 21 }} numberOfLines={2}>
              {submission.campaignTitle}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: cfg.pillBg,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: cfg.pillBorder,
              marginLeft: 12,
              flexShrink: 0,
            }}
          >
            <Ionicons name={cfg.icon} size={13} color={cfg.iconColor} />
            <Text style={{ color: cfg.pillText, fontSize: 12, fontWeight: "700" }}>{cfg.label}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: C.border, marginBottom: 12 }} />

        {/* Status body */}
        {submission.status === "pending" && (
          <View>
            <View style={{ height: 3, backgroundColor: C.bgDeep, borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
              <View style={{ width: "33%", height: "100%", backgroundColor: C.amber, borderRadius: 2 }} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="ellipse" size={6} color={C.amber} />
              <Text style={{ color: C.textMid, fontSize: 12 }}>
                Review in ~24 hours · {formatPayout(submission.payout)} on approval
              </Text>
            </View>
          </View>
        )}

        {submission.status === "approved" && (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="cash-outline" size={15} color={C.green} />
              <Text style={{ color: C.greenText, fontSize: 14, fontWeight: "700" }}>
                {formatPayout(submission.payout)} paid out
              </Text>
            </View>
            <Text style={{ color: C.textDim, fontSize: 12 }}>{formatTimeAgo(submission.submittedAt)}</Text>
          </View>
        )}

        {submission.status === "rejected" && (
          <View>
            {submission.reviewFeedback && (
              <View
                style={{
                  backgroundColor: C.redBg,
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 12,
                  borderLeftWidth: 2,
                  borderLeftColor: C.redBorder,
                }}
              >
                <Text style={{ color: C.textMid, fontSize: 12, lineHeight: 18, fontStyle: "italic" }}>
                  "{submission.reviewFeedback}"
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => router.push(`/submit/${submission.campaignId}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: C.bgDeep,
                borderRadius: 10,
                paddingVertical: 9,
                paddingHorizontal: 14,
                alignSelf: "flex-start",
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Ionicons name="refresh-outline" size={14} color={C.textMid} />
              <Text style={{ color: C.text, fontSize: 13, fontWeight: "600" }}>Revise & resubmit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
