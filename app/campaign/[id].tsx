import React, { useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, Image, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../../constants/colors";
import { CAMPAIGNS } from "../../data/campaigns";
import { VideoPlayer } from "../../components/VideoPlayer";
import { formatDeadline, formatPlatform } from "../../utils/formatters";

type Tab = "brief" | "examples";

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("brief");
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [watchedAny, setWatchedAny] = useState(false);
  const handleVideoPlay = useCallback(() => setWatchedAny(true), []);

  const [scrolled, setScrolled] = useState(false);
  const ctaScale = useRef(new Animated.Value(1)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  const campaign = CAMPAIGNS.find((c) => c.id === id);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const shouldShow = y > 90;
    if (shouldShow !== scrolled) {
      setScrolled(shouldShow);
      Animated.timing(titleOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 160,
        useNativeDriver: true,
      }).start();
    }
  };

  if (!campaign) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: C.textMid }}>Campaign not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={["top"]}>

      {/* ── Sticky header ──────────────────────────────────── */}
      <View style={{
        flexDirection: "row", alignItems: "center", gap: 12,
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10,
        backgroundColor: C.bg,
        borderBottomWidth: 1, borderBottomColor: C.border,
        zIndex: 10,
      }}>
        <TouchableOpacity
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={{
            paddingHorizontal: 14, paddingVertical: 6,
            borderRadius: 99,
            backgroundColor: "rgba(255,255,255,0.08)",
            flexDirection: "row", alignItems: "center", gap: 6,
          }}
        >
          <Ionicons name="chevron-back" size={14} color={C.textMid} />
          <Text style={{ color: C.textMid, fontSize: 13 }}>Campaigns</Text>
        </TouchableOpacity>
        <Animated.Text
          numberOfLines={1}
          style={{
            flex: 1, fontSize: 15, fontWeight: "700", color: C.text,
            opacity: titleOpacity,
          }}
        >
          {campaign.title}
        </Animated.Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >

        {/* ── Hero — brand gradient ────────────────────────── */}
        <View style={{
          paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20,
          borderBottomWidth: 1, borderBottomColor: C.border,
          backgroundColor: `${campaign.brandAvatarColor}18`,
        }}>
          {/* Brand + payout row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <BrandLogoLarge
              logoUrl={campaign.logoUrl}
              fallbackInitials={campaign.brandAvatar}
              fallbackColor={campaign.brandAvatarColor}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: campaign.brandAvatarColor, fontWeight: "600", letterSpacing: 0.5, marginBottom: 2 }}>
                {campaign.type.toUpperCase()}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "700", color: C.text }}>{campaign.brandName}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 28, fontWeight: "800", color: C.accent, letterSpacing: -0.5 }}>
                ${campaign.payout}
              </Text>
              <Text style={{ fontSize: 11, color: C.textDim }}>per video</Text>
            </View>
          </View>

          <Text style={{ color: C.text, fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
            {campaign.title}
          </Text>

          {/* Meta row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons name="time-outline" size={12} color={C.textMid} />
              <Text style={{ color: C.textMid, fontSize: 12 }}>Deadline {formatDeadline(campaign.daysLeft)}</Text>
            </View>
            <Text style={{ color: C.textDim }}>·</Text>
            <Text style={{ color: C.textMid, fontSize: 12 }}>
              {campaign.spotsLeft} slot{campaign.spotsLeft !== 1 ? "s" : ""} remaining
            </Text>
            <Text style={{ color: C.textDim }}>·</Text>
            <Text style={{ color: C.textMid, fontSize: 12 }}>{formatPlatform(campaign.platform)}</Text>
          </View>
        </View>

        {/* ── Tab navigation ──────────────────────────────── */}
        <View style={{
          flexDirection: "row",
          borderBottomWidth: 1, borderBottomColor: C.border,
          backgroundColor: C.bg,
        }}>
          {(["brief", "examples"] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => { Haptics.selectionAsync(); setTab(t); }}
              style={{
                flex: 1, paddingVertical: 14, alignItems: "center",
                borderBottomWidth: 2,
                borderBottomColor: tab === t ? campaign.brandAvatarColor : "transparent",
              }}
            >
              <Text style={{
                fontSize: 14, fontWeight: "600",
                color: tab === t ? campaign.brandAvatarColor : C.textDim,
              }}>
                {t === "brief" ? "📋 Brief" : "🎬 Examples"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab content ─────────────────────────────────── */}
        <View style={{ padding: 20 }}>

          {tab === "brief" && (
            <>
              {/* Brief text */}
              <Text style={{ color: C.textMid, fontSize: 14, lineHeight: 24 }} numberOfLines={briefExpanded ? undefined : 6}>
                {campaign.brief}
              </Text>
              <TouchableOpacity
                onPress={() => { Haptics.selectionAsync(); setBriefExpanded((v) => !v); }}
                style={{ marginTop: 10, alignSelf: "flex-start" }}
              >
                <Text style={{ color: C.accent, fontSize: 14, fontWeight: "600" }}>
                  {briefExpanded ? "Show less" : "Read full brief →"}
                </Text>
              </TouchableOpacity>

              {/* Pro tip */}
              <View style={{
                marginTop: 20, padding: 14,
                backgroundColor: `${campaign.brandAvatarColor}10`,
                borderRadius: 12, borderWidth: 1,
                borderColor: `${campaign.brandAvatarColor}30`,
              }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: campaign.brandAvatarColor, marginBottom: 6 }}>
                  💡 Pro tip
                </Text>
                <Text style={{ fontSize: 13, color: C.textMid, lineHeight: 21 }}>
                  Videos that feel real outperform produced ones 3:1. Don't over-edit — creators who feel genuine earn 2–3× more from performance bonuses.
                </Text>
              </View>

              {/* Requirements */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: C.textDim, letterSpacing: 0.6, marginBottom: 12 }}>
                  MUST INCLUDE
                </Text>
                <View style={{
                  backgroundColor: C.bg1, borderRadius: 14,
                  borderWidth: 1, borderColor: C.border,
                  padding: 16, gap: 12,
                }}>
                  {campaign.requirements.map((req, i) => (
                    <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                      <View style={{
                        width: 20, height: 20, borderRadius: 4,
                        backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder,
                        alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0,
                      }}>
                        <Text style={{ fontSize: 10, color: C.green }}>✓</Text>
                      </View>
                      <Text style={{ color: C.textMid, fontSize: 14, lineHeight: 22, flex: 1 }}>{req}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {tab === "examples" && (
            <>
              <Text style={{ fontSize: 13, color: C.textMid, marginBottom: 14, lineHeight: 21 }}>
                Watch these examples to understand the tone and format this brand is looking for.
              </Text>

              <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
                {campaign.exampleVideos.map((video) => (
                  <VideoPlayer key={video.id} video={video} onPlayStart={handleVideoPlay} />
                ))}
              </View>

              <Text style={{ marginTop: 12, fontSize: 12, color: C.textDim }}>
                Tap to preview. Replicate the structure and tone.
              </Text>

              {watchedAny && (
                <View style={{
                  marginTop: 16,
                  backgroundColor: C.greenBg, borderRadius: 12,
                  borderWidth: 1, borderColor: C.greenBorder,
                  padding: 14, flexDirection: "row", alignItems: "center", gap: 10,
                }}>
                  <Ionicons name="checkmark-circle" size={16} color={C.green} />
                  <Text style={{ color: C.green, fontSize: 14, fontWeight: "600", flex: 1 }}>
                    Great! You're ready to submit your video.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky CTA ────────────────────────────────────── */}
      <LinearGradient
        colors={["transparent", C.bg]}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          paddingHorizontal: 20, paddingTop: 24, paddingBottom: 38,
        }}
      >
        {!watchedAny && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 10 }}>
            <Ionicons name="play-circle-outline" size={14} color={C.textDim} />
            <Text style={{ color: C.textDim, fontSize: 12 }}>Watch an example video to unlock</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            if (!watchedAny) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(`/submit/${campaign.id}`);
          }}
          onPressIn={() => {
            if (!watchedAny) return;
            Animated.spring(ctaScale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
          }}
          onPressOut={() => {
            Animated.spring(ctaScale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
          }}
          activeOpacity={watchedAny ? 1 : 0.6}
          style={{ opacity: watchedAny ? 1 : 0.65 }}
        >
          <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
            {watchedAny ? (
              <LinearGradient
                colors={[C.accentGradStart, C.accentGradEnd]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 14, paddingVertical: 17,
                  alignItems: "center", flexDirection: "row",
                  justifyContent: "center", gap: 8,
                  ...C.shadowAccent,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                  Submit a Video
                </Text>
                <Ionicons name="arrow-forward" size={17} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={{
                backgroundColor: C.bg2,
                borderRadius: 14, paddingVertical: 17,
                alignItems: "center", flexDirection: "row",
                justifyContent: "center", gap: 8,
                borderWidth: 1, borderColor: C.border,
              }}>
                <Text style={{ color: C.textDim, fontSize: 16, fontWeight: "700" }}>
                  Submit a Video
                </Text>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

function BrandLogoLarge({ logoUrl, fallbackInitials, fallbackColor }: {
  logoUrl?: string;
  fallbackInitials: string;
  fallbackColor: string;
}) {
  const [imgError, setImgError] = React.useState(false);
  const showLogo = !!logoUrl && !imgError;

  return (
    <View style={{
      width: 56, height: 56, borderRadius: 16,
      backgroundColor: showLogo ? '#fff' : fallbackColor,
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      borderWidth: 1, borderColor: C.border,
    }}>
      {showLogo ? (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>{fallbackInitials}</Text>
      )}
    </View>
  );
}
