import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Animated, Image, ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../../constants/colors";
import { CAMPAIGNS } from "../../data/campaigns";
import { useSubmissionsStore } from "../../store/submissionsStore";
import { validateVideoUrl } from "../../utils/urlValidator";
import { formatPayout } from "../../utils/formatters";

type SubmitPlatform = "tiktok" | "instagram";

interface LinkPreview {
  title: string;
  description: string;
  image: string;
  url: string;
}

const LINKPREVIEW_KEY = "303f76a662e63951ff154577aa2ae98f";

const PLATFORM_CONFIG = {
  tiktok:    { label: "TikTok",    placeholder: "https://www.tiktok.com/@user/video/..." },
  instagram: { label: "Instagram", placeholder: "https://www.instagram.com/reel/..." },
};

function PlatformIcon({ platform, size, color }: { platform: SubmitPlatform; size: number; color: string }) {
  return platform === "tiktok"
    ? <FontAwesome5 name="tiktok" size={size} color={color} />
    : <Ionicons name="logo-instagram" size={size + 1} color={color} />;
}

export default function SubmitScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const router = useRouter();
  const addSubmission = useSubmissionsStore((s) => s.addSubmission);

  const campaign = CAMPAIGNS.find((c) => c.id === campaignId);
  const [selectedPlatform, setSelectedPlatform] = useState<SubmitPlatform>("tiktok");
  const [url, setUrl]             = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [urlTouched, setUrlTouched] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // Link preview
  const [preview, setPreview]           = useState<LinkPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const lastFetchedUrl = useRef("");

  const isUrlValid = validateVideoUrl(url, selectedPlatform);
  const canSubmit  = isUrlValid && confirmed;

  // Entrance animations
  const section1 = useRef(new Animated.Value(0)).current;
  const section2 = useRef(new Animated.Value(0)).current;
  const section3 = useRef(new Animated.Value(0)).current;
  const section4 = useRef(new Animated.Value(0)).current;

  // Preview card animation
  const previewAnim = useRef(new Animated.Value(0)).current;

  // Shake animation for invalid URL
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Success animations
  const successCircle  = useRef(new Animated.Value(0)).current;
  const successContent = useRef(new Animated.Value(0)).current;
  const successRing    = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (campaign?.platform === "instagram") setSelectedPlatform("instagram");
    else setSelectedPlatform("tiktok");
  }, [campaign]);

  // Stagger entrance
  useEffect(() => {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const run = async () => {
      await delay(50);
      Animated.spring(section1, { toValue: 1, useNativeDriver: true, damping: 22, stiffness: 200 }).start();
      await delay(80);
      Animated.spring(section2, { toValue: 1, useNativeDriver: true, damping: 22, stiffness: 200 }).start();
      await delay(80);
      Animated.spring(section3, { toValue: 1, useNativeDriver: true, damping: 22, stiffness: 200 }).start();
      await delay(80);
      Animated.spring(section4, { toValue: 1, useNativeDriver: true, damping: 22, stiffness: 200 }).start();
    };
    run();
  }, []);

  // Fetch link preview whenever a new valid URL is entered
  useEffect(() => {
    if (!isUrlValid) {
      setPreview(null);
      setPreviewLoading(false);
      lastFetchedUrl.current = "";
      Animated.timing(previewAnim, { toValue: 0, duration: 160, useNativeDriver: true }).start();
      return;
    }

    // Skip if we already fetched this exact URL
    if (url === lastFetchedUrl.current) return;
    lastFetchedUrl.current = url;

    setPreview(null);
    setPreviewLoading(true);

    // Show card shell immediately while loading
    Animated.spring(previewAnim, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 180 }).start();

    const controller = new AbortController();
    fetch(
      `https://api.linkpreview.net/?q=${encodeURIComponent(url)}`,
      {
        headers: { "X-Linkpreview-Api-Key": LINKPREVIEW_KEY },
        signal: controller.signal,
      }
    )
      .then((r) => r.json())
      .then((data: LinkPreview) => {
        setPreview(data);
        setPreviewLoading(false);
      })
      .catch(() => {
        setPreviewLoading(false);
      });

    return () => controller.abort();
  }, [isUrlValid, url]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 7,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -7, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const handleBlur = () => {
    setInputFocused(false);
    setUrlTouched(true);
    if (url.length > 0 && !isUrlValid) shake();
  };

  const handleSubmit = async () => {
    if (!canSubmit || !campaign) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addSubmission({
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      brandName: campaign.brandName,
      payout: campaign.payout,
      platform: selectedPlatform,
      url,
    });
    setSubmitted(true);
    Animated.sequence([
      Animated.spring(successCircle, { toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200 }),
      Animated.timing(successContent, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(successRing, { toValue: 1.25, duration: 900, useNativeDriver: true }),
        Animated.timing(successRing, { toValue: 0.6,  duration: 900, useNativeDriver: true }),
      ])
    ).start();
    setTimeout(() => router.replace("/(tabs)/"), 2800);
  };

  const animStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
  });

  if (!campaign) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: C.textMid }}>Campaign not found</Text>
      </SafeAreaView>
    );
  }

  // ── Success screen ───────────────────────────────────────────────
  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
          <Animated.View style={{
            position: "absolute",
            width: 140, height: 140, borderRadius: 70,
            backgroundColor: "rgba(168,85,247,0.12)",
            transform: [{ scale: successRing }],
          }} />
          <Animated.View style={{
            width: 80, height: 80, borderRadius: 40,
            alignItems: "center", justifyContent: "center",
            marginBottom: 28,
            transform: [{ scale: successCircle }],
            overflow: "hidden",
          }}>
            <LinearGradient
              colors={[C.accentGradStart, C.accentGradEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <Ionicons name="checkmark" size={40} color="#fff" />
          </Animated.View>
          <Animated.View style={{ alignItems: "center", opacity: successContent }}>
            <Text style={{ color: C.text, fontSize: 28, fontWeight: "800", marginBottom: 10, letterSpacing: -0.6, textAlign: "center" }}>
              Submitted!
            </Text>
            <Text style={{ color: C.textMid, fontSize: 15, textAlign: "center", lineHeight: 24, marginBottom: 20 }}>
              Your video is under review.{"\n"}You'll hear back within 24 hours.
            </Text>
            <View style={{
              backgroundColor: "rgba(168,85,247,0.12)", borderWidth: 1, borderColor: "rgba(168,85,247,0.35)",
              borderRadius: 100, paddingHorizontal: 20, paddingVertical: 9,
            }}>
              <Text style={{ color: C.accent, fontSize: 15, fontWeight: "700" }}>
                {formatPayout(campaign.payout)} on the line 💸
              </Text>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  const borderColor = inputFocused
    ? C.accent
    : urlTouched && url.length > 0
      ? (isUrlValid ? C.greenBorder : C.redBorder)
      : C.border;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 12,
          paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14,
          borderBottomWidth: 1, borderBottomColor: C.border,
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
            <Text style={{ color: C.textMid, fontSize: 13 }}>{campaign.brandName}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "700", color: C.text, textAlign: "right" }}>Submit video</Text>
          </View>
          <View style={{
            backgroundColor: "rgba(168,85,247,0.12)", borderWidth: 1, borderColor: "rgba(168,85,247,0.35)",
            borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5,
          }}>
            <Text style={{ color: C.accent, fontSize: 14, fontWeight: "700" }}>
              {formatPayout(campaign.payout)}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── 1. Platform ──────────────────────────────────── */}
          <Animated.View style={[animStyle(section1), { marginTop: 24 }]}>
            <SectionLabel step="1" title="Where did you post it?" />
            <View style={{
              flexDirection: "row",
              backgroundColor: C.bg2,
              borderRadius: 12, padding: 4,
              marginTop: 12,
            }}>
              {(["tiktok", "instagram"] as SubmitPlatform[]).map((p) => {
                const active = selectedPlatform === p;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedPlatform(p);
                      setUrl(""); setUrlTouched(false);
                      setPreview(null); lastFetchedUrl.current = "";
                      Animated.timing(previewAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start();
                    }}
                    activeOpacity={0.85}
                    style={{
                      flex: 1, flexDirection: "row",
                      alignItems: "center", justifyContent: "center",
                      gap: 8, paddingVertical: 13,
                      borderRadius: 9,
                      borderWidth: active ? 1.5 : 0,
                      borderColor: active ? C.accent : "transparent",
                      backgroundColor: active ? `${C.accent}15` : "transparent",
                    }}
                  >
                    <PlatformIcon platform={p} size={14} color={active ? C.accent : C.textDim} />
                    <Text style={{
                      fontSize: 14, fontWeight: active ? "700" : "500",
                      color: active ? C.accent : C.textDim,
                    }}>
                      {PLATFORM_CONFIG[p].label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* ── 2. Video URL ─────────────────────────────────── */}
          <Animated.View style={[animStyle(section2), { marginTop: 28 }]}>
            <SectionLabel step="2" title="Paste your video link" />

            <Animated.View style={[{ marginTop: 12 }, { transform: [{ translateX: shakeAnim }] }]}>
              <View style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: C.bg1, borderRadius: 12,
                borderWidth: 1.5, paddingHorizontal: 14,
                borderColor, ...C.shadow,
              }}>
                <View style={{ marginRight: 10 }}>
                  <PlatformIcon
                    platform={selectedPlatform}
                    size={15}
                    color={inputFocused || (urlTouched && isUrlValid) ? C.green : C.textDim}
                  />
                </View>
                <TextInput
                  value={url}
                  onChangeText={(v) => { setUrl(v); if (!urlTouched && v.length > 5) setUrlTouched(true); }}
                  onFocus={() => setInputFocused(true)}
                  onBlur={handleBlur}
                  placeholder={PLATFORM_CONFIG[selectedPlatform].placeholder}
                  placeholderTextColor={C.textDim}
                  style={{ flex: 1, color: C.text, fontSize: 13, paddingVertical: 16 }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
                {url.length > 0 && (
                  <TouchableOpacity onPress={() => {
                    setUrl(""); setUrlTouched(false);
                    setPreview(null); lastFetchedUrl.current = "";
                    Animated.timing(previewAnim, { toValue: 0, duration: 120, useNativeDriver: true }).start();
                  }}>
                    <Ionicons
                      name={isUrlValid ? "checkmark-circle" : "close-circle"}
                      size={20}
                      color={isUrlValid ? C.green : urlTouched ? C.red : C.textDim}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>

            {urlTouched && !isUrlValid && url.length > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8 }}>
                <Ionicons name="alert-circle-outline" size={13} color={C.red} />
                <Text style={{ color: C.red, fontSize: 12 }}>
                  Paste a valid {selectedPlatform === "tiktok" ? "TikTok video" : "Instagram Reel"} URL
                </Text>
              </View>
            )}

            {/* ── Link preview card ─────────────────────────── */}
            <Animated.View style={{
              marginTop: 10,
              opacity: previewAnim,
              transform: [{ scale: previewAnim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) }],
            }}>
              {isUrlValid && (previewLoading || preview) && (
                <View style={{
                  backgroundColor: C.card,
                  borderRadius: 14,
                  borderWidth: 1, borderColor: C.greenBorder,
                  overflow: "hidden",
                  ...C.shadowMd,
                }}>
                  {/* Green accent bar */}
                  <View style={{ height: 3, backgroundColor: C.green }} />

                  {previewLoading ? (
                    /* Loading skeleton */
                    <View style={{ padding: 14 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.green }} />
                        <Text style={{ color: C.green, fontSize: 10, fontWeight: "700", letterSpacing: 0.5 }}>
                          LOADING PREVIEW…
                        </Text>
                        <ActivityIndicator size="small" color={C.green} style={{ marginLeft: 4 }} />
                      </View>
                      <SkeletonRow width="90%" height={13} />
                      <SkeletonRow width="70%" height={11} style={{ marginTop: 8 }} />
                      <SkeletonRow width="55%" height={11} style={{ marginTop: 6 }} />
                    </View>
                  ) : preview ? (
                    /* Rich preview */
                    <>
                      {!!preview.image && (
                        <Image
                          source={{ uri: preview.image }}
                          style={{ width: "100%", height: 180 }}
                          resizeMode="cover"
                        />
                      )}
                      <View style={{ padding: 14 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.green }} />
                          <Text style={{ color: C.green, fontSize: 10, fontWeight: "700", letterSpacing: 0.5 }}>
                            VIDEO DETECTED
                          </Text>
                          <View style={{ flex: 1 }} />
                          <PlatformIcon platform={selectedPlatform} size={12} color={C.textDim} />
                        </View>

                        {!!preview.title && (
                          <Text
                            numberOfLines={2}
                            style={{ color: C.text, fontSize: 14, fontWeight: "700", lineHeight: 20, marginBottom: 5 }}
                          >
                            {preview.title}
                          </Text>
                        )}

                        {!!preview.description && (
                          <Text
                            numberOfLines={2}
                            style={{ color: C.textMid, fontSize: 12, lineHeight: 18 }}
                          >
                            {preview.description}
                          </Text>
                        )}
                      </View>
                    </>
                  ) : null}
                </View>
              )}
            </Animated.View>
          </Animated.View>

          {/* ── 3. Brief reminder ─────────────────────────── */}
          <Animated.View style={[animStyle(section3), { marginTop: 28 }]}>
            <SectionLabel step="3" title="Before you submit" />
            <View style={{
              marginTop: 12, backgroundColor: C.bg1, borderRadius: 12,
              borderWidth: 1, borderColor: C.border, padding: 14, ...C.shadow,
            }}>
              {[
                "Video follows the campaign brief",
                "You own the content or have rights",
                "Posted on the correct platform",
              ].map((point, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                  <View style={{
                    width: 20, height: 20, borderRadius: 10,
                    backgroundColor: C.bg3, borderWidth: 1, borderColor: C.border,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Ionicons name="checkmark" size={11} color={C.textDim} />
                  </View>
                  <Text style={{ color: C.textMid, fontSize: 13, flex: 1 }}>{point}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── 4. Confirm ───────────────────────────────── */}
          <Animated.View style={[animStyle(section4), { marginTop: 24 }]}>
            <TouchableOpacity
              onPress={() => { Haptics.selectionAsync(); setConfirmed((v) => !v); }}
              activeOpacity={0.8}
              style={{
                flexDirection: "row", alignItems: "center", gap: 14,
                backgroundColor: C.bg1,
                borderRadius: 14, padding: 16,
                borderWidth: 1, borderColor: C.border,
                ...C.shadow,
              }}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                borderWidth: 1.5,
                borderColor: confirmed ? C.green : C.borderMid,
                backgroundColor: confirmed ? C.green : "transparent",
                alignItems: "center", justifyContent: "center",
              }}>
                {confirmed && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Text style={{ color: C.textMid, fontSize: 14, flex: 1, lineHeight: 21 }}>
                I confirm this video is my original work and meets the brief.
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* ── Sticky CTA ───────────────────────────────────── */}
        <LinearGradient
          colors={["transparent", C.bg]}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            paddingHorizontal: 20, paddingTop: 24, paddingBottom: 38,
          }}
        >
          {!canSubmit && (
            <Text style={{ textAlign: "center", color: C.textDim, fontSize: 12, marginBottom: 10 }}>
              {!isUrlValid ? "Add a valid video link to continue" : "Check the confirmation box above"}
            </Text>
          )}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            {canSubmit ? (
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
                  Submit Video →
                </Text>
              </LinearGradient>
            ) : (
              <View style={{
                backgroundColor: C.bg2,
                borderRadius: 14, paddingVertical: 17,
                alignItems: "center",
                borderWidth: 1, borderColor: C.border,
              }}>
                <Text style={{ color: C.textDim, fontSize: 16, fontWeight: "700" }}>
                  Submit Video →
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionLabel({ step, title }: { step: string; title: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View style={{
        width: 22, height: 22, borderRadius: 11,
        backgroundColor: "rgba(168,85,247,0.2)",
        borderWidth: 1, borderColor: "rgba(168,85,247,0.4)",
        alignItems: "center", justifyContent: "center",
      }}>
        <Text style={{ color: C.accent, fontSize: 11, fontWeight: "800" }}>{step}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: "700", color: C.text }}>{title}</Text>
    </View>
  );
}

function SkeletonRow({ width, height, style }: { width: string | number; height: number; style?: object }) {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <Animated.View style={[{
      width, height,
      borderRadius: 4,
      backgroundColor: C.bg3,
      opacity: pulse,
    }, style]} />
  );
}
