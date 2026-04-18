import React, { useState, useCallback, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, Image, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../../constants/colors";
import { CAMPAIGNS } from "../../data/campaigns";
import { VideoPlayer } from "../../components/VideoPlayer";
import { formatPayout, formatDeadline, formatPlatform } from "../../utils/formatters";

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: C.bgDeep,
            alignItems: "center", justifyContent: "center",
            borderWidth: 1, borderColor: C.border,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={C.text} />
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

        {/* ── Brand banner ────────────────────────────────── */}
        <View style={{ height: 180, overflow: "hidden" }}>
          {campaign.bannerImageUrl ? (
            <Image
              source={{ uri: campaign.bannerImageUrl }}
              style={{ ...fill }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ ...fill, backgroundColor: campaign.brandAvatarColor, opacity: 0.18 }} />
          )}
          {/* Gradient overlay at bottom for text legibility */}
          <View style={{
            ...fill,
            backgroundColor: 'rgba(0,0,0,0.35)',
          }} />
          {/* Brand logo centered */}
          <View style={{ ...fill, alignItems: "center", justifyContent: "center" }}>
            <BrandLogoLarge
              logoUrl={campaign.logoUrl}
              fallbackInitials={campaign.brandAvatar}
              fallbackColor={campaign.brandAvatarColor}
            />
          </View>
        </View>

        {/* ── Brand identity ──────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 22, paddingBottom: 20 }}>
          <Text style={{ color: C.textMid, fontSize: 13, fontWeight: "600", marginBottom: 5, letterSpacing: 0.2 }}>
            {campaign.brandName}
          </Text>
          <Text style={{ color: C.text, fontSize: 22, fontWeight: "800", lineHeight: 28, letterSpacing: -0.4, marginBottom: 16 }}>
            {campaign.title}
          </Text>

          {/* Stats pills */}
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <StatPill icon="cash-outline" label={formatPayout(campaign.payout)} green />
            <StatPill icon="time-outline" label={formatDeadline(campaign.daysLeft)} />
            <StatPill icon="phone-portrait-outline" label={formatPlatform(campaign.platform)} />
            {campaign.spotsLeft <= 10 && (
              <StatPill icon="flash" label={`${campaign.spotsLeft} spots left`} amber />
            )}
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: 20, marginBottom: 24 }} />

        {/* ── The Brief ───────────────────────────────────── */}
        <Section title="THE BRIEF">
          <Text style={{ color: C.textMid, fontSize: 15, lineHeight: 25 }} numberOfLines={briefExpanded ? undefined : 4}>
            {campaign.brief}
          </Text>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); setBriefExpanded((v) => !v); }}
            style={{ marginTop: 12, alignSelf: "flex-start" }}
          >
            <Text style={{ color: C.greenText, fontSize: 14, fontWeight: "600" }}>
              {briefExpanded ? "Show less" : "Read full brief →"}
            </Text>
          </TouchableOpacity>
        </Section>

        {/* ── Requirements ────────────────────────────────── */}
        <Section title="MUST INCLUDE">
          <View style={{
            backgroundColor: C.card, borderRadius: 14,
            borderWidth: 1, borderColor: C.border,
            padding: 16, gap: 12, ...C.shadow,
          }}>
            {campaign.requirements.map((req, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                <View style={{
                  width: 22, height: 22, borderRadius: 11,
                  backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder,
                  alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0,
                }}>
                  <Ionicons name="checkmark" size={12} color={C.greenText} />
                </View>
                <Text style={{ color: C.text, fontSize: 14, lineHeight: 22, flex: 1 }}>{req}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* ── Example videos ──────────────────────────────── */}
        <View style={{ marginBottom: 28 }}>
          <View style={{ paddingHorizontal: 20, marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.textDim, letterSpacing: 0.6 }}>
                WATCH FIRST
              </Text>
              <View style={{
                backgroundColor: C.amberBg, borderRadius: 100,
                paddingHorizontal: 8, paddingVertical: 2,
                borderWidth: 1, borderColor: C.amberBorder,
              }}>
                <Text style={{ color: C.amber, fontSize: 10, fontWeight: "700" }}>Required to unlock</Text>
              </View>
            </View>
            <Text style={{ color: C.textMid, fontSize: 13, marginTop: 4 }}>
              Replicate the structure — tap to play.
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 0 }}
          >
            {campaign.exampleVideos.map((video) => (
              <VideoPlayer key={video.id} video={video} onPlayStart={handleVideoPlay} />
            ))}
          </ScrollView>
        </View>

        {/* ── Watched confirmation ────────────────────────── */}
        {watchedAny && (
          <View style={{
            marginHorizontal: 20, marginBottom: 16,
            backgroundColor: C.greenBg, borderRadius: 12,
            borderWidth: 1, borderColor: C.greenBorder,
            padding: 14, flexDirection: "row", alignItems: "center", gap: 10,
          }}>
            <Ionicons name="checkmark-circle" size={16} color={C.greenText} />
            <Text style={{ color: C.greenText, fontSize: 14, fontWeight: "600", flex: 1 }}>
              Great! You're ready to submit your video.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Sticky CTA ────────────────────────────────────── */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20, paddingTop: 14, paddingBottom: 38,
        backgroundColor: "rgba(247,247,245,0.97)",
        borderTopWidth: 1, borderTopColor: C.border,
      }}>
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
          style={{ opacity: watchedAny ? 1 : 0.7 }}
        >
          <Animated.View style={{
            backgroundColor: watchedAny ? C.green : C.bgDeep,
            borderRadius: 14, paddingVertical: 17,
            alignItems: "center", flexDirection: "row",
            justifyContent: "center", gap: 8,
            borderWidth: 1,
            borderColor: watchedAny ? "transparent" : C.border,
            transform: [{ scale: ctaScale }],
            ...C.shadowMd,
          }}>
            <Text style={{
              color: watchedAny ? C.text : C.textDim,
              fontSize: 16, fontWeight: "700",
            }}>
              Submit your video
            </Text>
            {watchedAny && <Ionicons name="arrow-forward" size={17} color={C.text} />}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: C.textDim, letterSpacing: 0.6, marginBottom: 12 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function StatPill({ icon, label, green, amber }: { icon: keyof typeof Ionicons.glyphMap; label: string; green?: boolean; amber?: boolean }) {
  const bg     = green ? C.greenBg   : amber ? C.amberBg   : C.card;
  const border = green ? C.greenBorder : amber ? C.amberBorder : C.border;
  const color  = green ? C.greenText : amber ? C.amber      : C.text;

  return (
    <View style={{
      flexDirection: "row", alignItems: "center", gap: 5,
      backgroundColor: bg, borderWidth: 1, borderColor: border,
      borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
    }}>
      <Ionicons name={icon} size={12} color={color} />
      <Text style={{ color, fontSize: 13, fontWeight: "600" }}>{label}</Text>
    </View>
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
      width: 72, height: 72, borderRadius: 20,
      backgroundColor: showLogo ? '#fff' : fallbackColor,
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      ...C.shadowMd,
    }}>
      {showLogo ? (
        <Image
          source={{ uri: logoUrl }}
          style={{ width: 54, height: 54 }}
          resizeMode="contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{fallbackInitials}</Text>
      )}
    </View>
  );
}

const fill = { position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0 };
