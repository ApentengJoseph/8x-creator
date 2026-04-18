import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
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
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 2 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 2 }).start();

  const isLowSpots = campaign.spotsLeft <= 10;

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
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        ...C.shadow,
      }}>
        {/* Brand logo */}
        <BrandLogo
          logoUrl={campaign.logoUrl}
          fallbackInitials={campaign.brandAvatar}
          fallbackColor={campaign.brandAvatarColor}
        />

        {/* Info block */}
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: C.text, fontSize: 15, fontWeight: "700", lineHeight: 20 }} numberOfLines={1}>
            {campaign.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
            <Text style={{ color: C.textMid, fontSize: 13 }}>{campaign.brandName}</Text>
            <Text style={{ color: C.textDim, fontSize: 13 }}>·</Text>
            <PlatformLabel platform={campaign.platform} />
            <Text style={{ color: C.textDim, fontSize: 13 }}>·</Text>
            <Text style={{ color: C.textMid, fontSize: 13 }}>{formatDeadline(campaign.daysLeft)}</Text>
          </View>
          {isLowSpots && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 }}>
              <Ionicons name="flash" size={10} color={C.amber} />
              <Text style={{ color: C.amber, fontSize: 11, fontWeight: "600" }}>
                {campaign.spotsLeft} spots left
              </Text>
            </View>
          )}
        </View>

        {/* Payout + chevron */}
        <View style={{ alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
          <Text style={{ color: C.greenText, fontSize: 16, fontWeight: "800", letterSpacing: -0.3 }}>
            {formatPayout(campaign.payout)}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={C.textDim} />
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
      width: 46, height: 46, borderRadius: 12,
      backgroundColor: showLogo ? C.bgDeep : fallbackColor,
      alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
      borderWidth: showLogo ? 1 : 0,
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

function PlatformLabel({ platform }: { platform: string }) {
  if (platform === "tiktok") return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
      <FontAwesome5 name="tiktok" size={9} color={C.textMid} />
      <Text style={{ color: C.textMid, fontSize: 13 }}>TikTok</Text>
    </View>
  );
  if (platform === "instagram") return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
      <Ionicons name="logo-instagram" size={10} color={C.textMid} />
      <Text style={{ color: C.textMid, fontSize: 13 }}>Instagram</Text>
    </View>
  );
  return <Text style={{ color: C.textMid, fontSize: 13 }}>TikTok / IG</Text>;
}
