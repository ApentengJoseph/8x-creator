import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../constants/colors";
import { Submission } from "../types";
import { formatPayout, formatTimeAgo } from "../utils/formatters";

const STATUS = {
  pending: {
    label: "Pending",
    icon: "time-outline" as const,
    color: C.amber,
    bg: C.amberBg,
    border: C.amberBorder,
  },
  approved: {
    label: "Approved",
    icon: "checkmark-circle" as const,
    color: C.greenText,
    bg: C.greenBg,
    border: C.greenBorder,
  },
  rejected: {
    label: "Rejected",
    icon: "close-circle" as const,
    color: C.red,
    bg: C.redBg,
    border: C.redBorder,
  },
};

export function SubmissionCard({ submission }: { submission: Submission }) {
  const router = useRouter();
  const cfg = STATUS[submission.status];
  const initials = submission.brandName.slice(0, 2).toUpperCase();

  return (
    <View style={{
      backgroundColor: C.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: C.border,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      ...C.shadow,
    }}>
      {/* Brand initial circle */}
      <View style={{
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: C.bgDeep,
        alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        borderWidth: 1, borderColor: C.border,
      }}>
        <Text style={{ color: C.textMid, fontSize: 12, fontWeight: "800" }}>{initials}</Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: C.text, fontSize: 15, fontWeight: "700", lineHeight: 20 }} numberOfLines={1}>
          {submission.campaignTitle}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: C.textMid, fontSize: 13 }}>{submission.brandName}</Text>
          <Text style={{ color: C.textDim, fontSize: 13 }}>·</Text>
          <Text style={{ color: C.greenText, fontSize: 13, fontWeight: "600" }}>
            {formatPayout(submission.payout)}
          </Text>
          <Text style={{ color: C.textDim, fontSize: 13 }}>·</Text>
          <Text style={{ color: C.textDim, fontSize: 13 }}>{formatTimeAgo(submission.submittedAt)}</Text>
        </View>

        {/* Feedback + resubmit for rejected */}
        {submission.status === "rejected" && submission.reviewFeedback && (
          <Text style={{ color: C.textMid, fontSize: 12, lineHeight: 17, fontStyle: "italic", marginTop: 2 }} numberOfLines={2}>
            "{submission.reviewFeedback}"
          </Text>
        )}
        {submission.status === "rejected" && (
          <TouchableOpacity
            onPress={() => router.push(`/submit/${submission.campaignId}`)}
            style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}
          >
            <Ionicons name="refresh-outline" size={12} color={C.greenText} />
            <Text style={{ color: C.greenText, fontSize: 12, fontWeight: "600" }}>Revise & resubmit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status pill */}
      <View style={{
        backgroundColor: cfg.bg,
        borderWidth: 1, borderColor: cfg.border,
        borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
        flexDirection: "row", alignItems: "center", gap: 4,
        flexShrink: 0,
      }}>
        <Ionicons name={cfg.icon} size={11} color={cfg.color} />
        <Text style={{ color: cfg.color, fontSize: 12, fontWeight: "700" }}>{cfg.label}</Text>
      </View>
    </View>
  );
}
