import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { C } from "../constants/colors";
import { Campaign } from "../types";
import { formatPayout, formatDeadline } from "../utils/formatters";

const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  tiktok:    { label: "TikTok",  color: "#18181b", bg: "rgba(0,0,0,0.07)" },
  instagram: { label: "Reels",   color: "#be185d", bg: "rgba(190,24,93,0.09)" },
  both:      { label: "TT + IG", color: "#6d28d9", bg: "rgba(109,40,217,0.09)" },
};

// Convert hex to rgba for gradient end
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 50, bounciness: 3 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 3 }).start();

  const platform = PLATFORM_CONFIG[campaign.platform];
  const isLowSpots = campaign.spotsLeft <= 10;
  const fillPct = Math.round(((campaign.spotsTotal - campaign.spotsLeft) / campaign.spotsTotal) * 100);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => router.push(`/campaign/${campaign.id}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          backgroundColor: C.card,
          borderRadius: 22,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: C.border,
          overflow: "hidden",
          ...C.shadowMd,
        }}
      >
        {/* ── Gradient hero header ─────────────────────── */}
        <LinearGradient
          colors={[
            hexToRgba(campaign.brandAvatarColor, 0.92),
            hexToRgba(campaign.brandAvatarColor, 0.55),
            hexToRgba(campaign.brandAvatarColor, 0.08),
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14 }}
        >
          {/* Subtle top specular */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.35)" }} />

          {/* Dot texture */}
          {[
            { top: "10%", right: "15%" },
            { top: "30%", right: "40%" },
            { top: "55%", right: "20%" },
            { top: "20%", left: "75%" },
            { top: "45%", left: "88%" },
          ].map((pos, i) => (
            <View key={i} style={[{
              position: "absolute",
              width: 4, height: 4, borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.14)",
            }, pos as any]} />
          ))}

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {/* Brand avatar */}
            <View style={{
              width: 48, height: 48, borderRadius: 15,
              backgroundColor: "rgba(255,255,255,0.18)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1.5, borderColor: "rgba(255,255,255,0.35)",
            }}>
              <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800", letterSpacing: 0.3 }}>
                {campaign.brandAvatar}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600", letterSpacing: 0.5, marginBottom: 3 }}>
                {campaign.brandName.toUpperCase()}
              </Text>
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "700", lineHeight: 20 }} numberOfLines={1}>
                {campaign.title}
              </Text>
            </View>

            {/* Payout pill */}
            <View style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 12, paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1, borderColor: "rgba(255,255,255,0.35)",
            }}>
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800", letterSpacing: -0.3 }}>
                {formatPayout(campaign.payout)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Card body ──────────────────────────────── */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 14, paddingTop: 12 }}>
          {/* Spots progress bar */}
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text style={{ color: C.textDim, fontSize: 11 }}>
                {campaign.acceptedCount} of {campaign.spotsTotal} spots filled
              </Text>
              {isLowSpots ? (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="flash" size={11} color={C.amber} />
                  <Text style={{ color: C.amber, fontSize: 11, fontWeight: "700" }}>
                    {campaign.spotsLeft} left
                  </Text>
                </View>
              ) : (
                <Text style={{ color: C.textDim, fontSize: 11 }}>{fillPct}% full</Text>
              )}
            </View>
            <View style={{ height: 4, backgroundColor: C.bgDeep, borderRadius: 2, overflow: "hidden" }}>
              <View style={{
                width: `${fillPct}%`,
                height: "100%",
                borderRadius: 2,
                backgroundColor: isLowSpots ? C.amber : hexToRgba(campaign.brandAvatarColor, 0.7),
              }} />
            </View>
          </View>

          {/* Tags row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <View style={{ backgroundColor: C.bgDeep, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: C.textMid, fontSize: 11, fontWeight: "500" }}>{campaign.type}</Text>
            </View>

            <View style={{ backgroundColor: platform.bg, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: platform.color, fontSize: 11, fontWeight: "600" }}>{platform.label}</Text>
            </View>

            <View style={{ flex: 1 }} />

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="time-outline" size={12} color={C.textDim} />
              <Text style={{ color: C.textDim, fontSize: 12 }}>{formatDeadline(campaign.daysLeft)}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
