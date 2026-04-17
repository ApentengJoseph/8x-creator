import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { C } from "../constants/colors";
import { Campaign } from "../types";
import { formatPayout, formatDeadline } from "../utils/formatters";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 50, bounciness: 3 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 3 }).start();

  const isLowSpots = campaign.spotsLeft <= 10;
  const fillPct = Math.round(((campaign.spotsTotal - campaign.spotsLeft) / campaign.spotsTotal) * 100);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => router.push(`/campaign/${campaign.id}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{
        transform: [{ scale }],
        backgroundColor: C.card,
        borderRadius: 18,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: C.border,
        padding: 16,
        ...C.shadow,
      }}>

        {/* ── Top row: avatar + info + payout ─────────── */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <View style={{
            width: 42, height: 42, borderRadius: 13,
            backgroundColor: campaign.brandAvatarColor,
            alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800", letterSpacing: 0.2 }}>
              {campaign.brandAvatar}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "600", letterSpacing: 0.5, marginBottom: 2 }}>
              {campaign.brandName}
            </Text>
            <Text style={{ color: C.text, fontSize: 15, fontWeight: "700", lineHeight: 20 }} numberOfLines={1}>
              {campaign.title}
            </Text>
          </View>

          <View style={{
            backgroundColor: C.greenBg,
            paddingHorizontal: 11, paddingVertical: 6,
            borderRadius: 10, borderWidth: 1, borderColor: C.greenBorder,
            flexShrink: 0,
          }}>
            <Text style={{ color: C.greenText, fontSize: 15, fontWeight: "800", letterSpacing: -0.3 }}>
              {formatPayout(campaign.payout)}
            </Text>
          </View>
        </View>

        {/* ── Progress bar ─────────────────────────────── */}
        <View style={{ marginBottom: 12 }}>
          <View style={{ height: 4, backgroundColor: C.bgDeep, borderRadius: 2, overflow: "hidden" }}>
            <View style={{
              width: `${fillPct}%`, height: "100%", borderRadius: 2,
              backgroundColor: isLowSpots ? C.amber : C.green,
              opacity: 0.7,
            }} />
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
            <Text style={{ color: C.textDim, fontSize: 11 }}>
              {campaign.acceptedCount} of {campaign.spotsTotal} spots filled
            </Text>
            {isLowSpots ? (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Ionicons name="flash" size={10} color={C.amber} />
                <Text style={{ color: C.amber, fontSize: 11, fontWeight: "700" }}>{campaign.spotsLeft} left</Text>
              </View>
            ) : (
              <Text style={{ color: C.textDim, fontSize: 11 }}>{fillPct}%</Text>
            )}
          </View>
        </View>

        {/* ── Tags row ─────────────────────────────────── */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ backgroundColor: C.bgDeep, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
            <Text style={{ color: C.textMid, fontSize: 11, fontWeight: "500" }}>{campaign.type}</Text>
          </View>
          <PlatformBadge platform={campaign.platform} />
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Ionicons name="time-outline" size={11} color={C.textDim} />
            <Text style={{ color: C.textDim, fontSize: 11 }}>{formatDeadline(campaign.daysLeft)}</Text>
          </View>
        </View>

      </Animated.View>
    </TouchableOpacity>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  const base = { flexDirection: "row" as const, alignItems: "center" as const, gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 };

  if (platform === "tiktok") return (
    <View style={[base, { backgroundColor: "rgba(0,0,0,0.05)" }]}>
      <FontAwesome5 name="tiktok" size={9} color={C.textMid} />
      <Text style={{ color: C.textMid, fontSize: 11, fontWeight: "500" }}>TikTok</Text>
    </View>
  );

  if (platform === "instagram") return (
    <View style={[base, { backgroundColor: "rgba(190,24,93,0.07)" }]}>
      <Ionicons name="logo-instagram" size={10} color="#be185d" />
      <Text style={{ color: "#be185d", fontSize: 11, fontWeight: "500" }}>Instagram</Text>
    </View>
  );

  return (
    <View style={[base, { backgroundColor: C.bgDeep }]}>
      <FontAwesome5 name="tiktok" size={9} color={C.textMid} />
      <Text style={{ color: C.textDim, fontSize: 10 }}>/</Text>
      <Ionicons name="logo-instagram" size={9} color={C.textMid} />
      <Text style={{ color: C.textMid, fontSize: 11, fontWeight: "500" }}>Both</Text>
    </View>
  );
}
