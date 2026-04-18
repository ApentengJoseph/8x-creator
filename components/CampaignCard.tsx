import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { C } from "../constants/colors";
import { Campaign } from "../types";
import { formatDeadline } from "../utils/formatters";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 2 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();

  const isLowSpots = campaign.spotsLeft <= 10;
  const filledFraction = (campaign.spotsTotal - campaign.spotsLeft) / campaign.spotsTotal;
  const tags = [campaign.type, campaign.platform === "both" ? "TikTok + IG" : campaign.platform].filter(Boolean);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => router.push(`/campaign/${campaign.id}`)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={{
        transform: [{ scale }],
        backgroundColor: C.bg1,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: C.border,
        overflow: "hidden",
        ...C.shadow,
      }}>
        {/* Brand-color accent stripe */}
        <View style={{ height: 3, backgroundColor: campaign.brandAvatarColor, opacity: 0.75 }} />

        <View style={{ padding: 16 }}>
          {/* Top row: brand + payout */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <BrandLogo
              logoUrl={campaign.logoUrl}
              fallbackInitials={campaign.brandAvatar}
              fallbackColor={campaign.brandAvatarColor}
            />

            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Text style={{ color: C.text, fontSize: 15, fontWeight: "700" }}>
                  {campaign.brandName}
                </Text>
                <View style={{
                  backgroundColor: `${campaign.brandAvatarColor}22`,
                  borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2,
                  borderWidth: 1, borderColor: `${campaign.brandAvatarColor}44`,
                }}>
                  <Text style={{ color: campaign.brandAvatarColor, fontSize: 11, fontWeight: "600" }}>
                    {campaign.type}
                  </Text>
                </View>
              </View>
              <Text style={{ color: C.textMid, fontSize: 13 }} numberOfLines={1}>
                {campaign.title}
              </Text>
            </View>

            {/* Payout */}
            <View style={{ alignItems: "flex-end", flexShrink: 0 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color: C.accent, letterSpacing: -0.3 }}>
                ${campaign.payout}
              </Text>
              <Text style={{ fontSize: 10, color: C.textDim }}>per video</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap", marginTop: 10 }}>
            {tags.map((t) => (
              <View key={t} style={{
                backgroundColor: C.bg3, borderRadius: 6,
                paddingHorizontal: 8, paddingVertical: 2,
              }}>
                <Text style={{ color: C.textDim, fontSize: 11 }}>#{t}</Text>
              </View>
            ))}
          </View>

          {/* Footer: slots bar + deadline + chevron */}
          <View style={{
            flexDirection: "row", alignItems: "center", gap: 12,
            marginTop: 12, paddingTop: 12,
            borderTopWidth: 1, borderTopColor: C.border,
          }}>
            {/* Slots progress bar */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                <Text style={{ fontSize: 10, color: C.textDim }}>
                  {campaign.spotsLeft} slot{campaign.spotsLeft !== 1 ? "s" : ""} left
                </Text>
                <Text style={{ fontSize: 10, color: C.textDim }}>
                  {campaign.spotsTotal} total
                </Text>
              </View>
              <View style={{ height: 3, backgroundColor: C.bg3, borderRadius: 99, overflow: "hidden" }}>
                <View style={{
                  height: "100%", borderRadius: 99,
                  width: `${filledFraction * 100}%`,
                  backgroundColor: campaign.brandAvatarColor,
                }} />
              </View>
            </View>

            {/* Deadline */}
            <Text style={{
              fontSize: 12, fontWeight: "600",
              color: isLowSpots ? C.amber : C.textMid,
            }}>
              {isLowSpots ? "🔥 " : ""}{formatDeadline(campaign.daysLeft)}
            </Text>

            {/* Arrow */}
            <View style={{
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: C.bg3,
              alignItems: "center", justifyContent: "center",
            }}>
              <Ionicons name="chevron-forward" size={12} color={C.textDim} />
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

function BrandLogo({ logoUrl, fallbackInitials, fallbackColor }: {
  logoUrl?: string;
  fallbackInitials: string;
  fallbackColor: string;
}) {
  const [imgError, setImgError] = useState(false);
  const showLogo = !!logoUrl && !imgError;

  return (
    <View style={{
      width: 46, height: 46, borderRadius: 13,
      backgroundColor: showLogo ? "#fff" : fallbackColor,
      alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: C.border,
    }}>
      {showLogo ? (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: 34, height: 34 }}
          resizeMode="contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>
          {fallbackInitials}
        </Text>
      )}
    </View>
  );
}
