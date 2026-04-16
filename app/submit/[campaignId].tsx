import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../../constants/colors";
import { CAMPAIGNS } from "../../data/campaigns";
import { useSubmissionsStore } from "../../store/submissionsStore";
import { validateVideoUrl } from "../../utils/urlValidator";
import { parseVideoUrl } from "../../utils/urlParser";
import { formatPayout, formatPlatform } from "../../utils/formatters";

type SubmitPlatform = "tiktok" | "instagram";

const PLATFORM_CONFIG = {
  tiktok: {
    label: "TikTok",
    placeholder: "https://www.tiktok.com/@user/video/...",
    icon: "musical-notes" as const,
    color: "#18181b",
    activeBg: "rgba(0,0,0,0.05)",
    activeBorder: "rgba(0,0,0,0.2)",
  },
  instagram: {
    label: "Instagram",
    placeholder: "https://www.instagram.com/reel/...",
    icon: "logo-instagram" as const,
    color: "#be185d",
    activeBg: "rgba(190,24,93,0.07)",
    activeBorder: "rgba(190,24,93,0.25)",
  },
};

export default function SubmitScreen() {
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const router = useRouter();
  const addSubmission = useSubmissionsStore((s) => s.addSubmission);

  const campaign = CAMPAIGNS.find((c) => c.id === campaignId);
  const [selectedPlatform, setSelectedPlatform] = useState<SubmitPlatform>("tiktok");
  const [url, setUrl] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [urlTouched, setUrlTouched] = useState(false);

  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.88)).current;

  const isUrlValid = validateVideoUrl(url, selectedPlatform);
  const parsed = isUrlValid ? parseVideoUrl(url) : null;
  const canSubmit = isUrlValid && confirmed;

  // Default to the campaign's preferred platform; user can always switch
  useEffect(() => {
    if (campaign?.platform === "instagram") setSelectedPlatform("instagram");
    else setSelectedPlatform("tiktok");
  }, [campaign]);

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
    Animated.parallel([
      Animated.timing(successOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(successScale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180 }),
    ]).start();
    setTimeout(() => router.replace("/(tabs)/submissions"), 2400);
  };

  if (!campaign) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: C.textMid }}>Campaign not found</Text>
      </SafeAreaView>
    );
  }

  // ── Success state ────────────────────────────────────────────────
  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <Animated.View style={{
          flex: 1, alignItems: "center", justifyContent: "center",
          paddingHorizontal: 40, opacity: successOpacity,
          transform: [{ scale: successScale }],
        }}>
          {[
            { color: C.green,  top: 130, left: 55  },
            { color: C.amber,  top: 170, left: 290 },
            { color: "#60a5fa",top: 210, left: 85  },
            { color: "#f472b6",top: 110, left: 240 },
            { color: "#a78bfa",top: 250, left: 310 },
          ].map((dot, i) => (
            <View key={i} style={{
              position: "absolute", top: dot.top, left: dot.left,
              width: 9, height: 9, borderRadius: 5,
              backgroundColor: dot.color, opacity: 0.55,
            }} />
          ))}

          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: C.greenBg,
            borderWidth: 1.5, borderColor: C.greenBorder,
            alignItems: "center", justifyContent: "center", marginBottom: 24,
            ...C.shadowMd,
          }}>
            <Ionicons name="checkmark" size={38} color={C.green} />
          </View>

          <Text style={{ color: C.text, fontSize: 26, fontWeight: "800", marginBottom: 12, textAlign: "center", letterSpacing: -0.5 }}>
            Submitted!
          </Text>
          <Text style={{ color: C.textMid, fontSize: 15, textAlign: "center", lineHeight: 24 }}>
            In review now. You'll hear back within 24 hours — {formatPayout(campaign.payout)} is on the line.
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const platformCfg = PLATFORM_CONFIG[selectedPlatform];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
          flexDirection: "row", alignItems: "center", gap: 12,
          borderBottomWidth: 1, borderBottomColor: C.border,
          backgroundColor: C.bg,
        }}>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); router.back(); }}
            style={{
              width: 36, height: 36, borderRadius: 12,
              backgroundColor: C.card, alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: C.border, ...C.shadow,
            }}
          >
            <Ionicons name="close" size={18} color={C.textMid} />
          </TouchableOpacity>
          <Text style={{ color: C.text, fontSize: 18, fontWeight: "700" }}>Submit video</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Campaign reminder */}
          <View style={{
            backgroundColor: C.card, borderRadius: 16, padding: 14,
            marginTop: 16, marginBottom: 24,
            flexDirection: "row", alignItems: "center",
            borderWidth: 1, borderColor: C.border, ...C.shadow,
          }}>
            <View style={{
              width: 40, height: 40, borderRadius: 12,
              backgroundColor: campaign.brandAvatarColor,
              alignItems: "center", justifyContent: "center", marginRight: 12,
            }}>
              <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 12, fontWeight: "800" }}>
                {campaign.brandAvatar}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.textDim, fontSize: 11, marginBottom: 2 }}>{campaign.brandName}</Text>
              <Text style={{ color: C.text, fontSize: 13, fontWeight: "600" }} numberOfLines={1}>
                {campaign.title}
              </Text>
            </View>
            <View style={{
              backgroundColor: C.greenBg, paddingHorizontal: 11, paddingVertical: 6,
              borderRadius: 20, borderWidth: 1, borderColor: C.greenBorder,
            }}>
              <Text style={{ color: C.greenText, fontSize: 15, fontWeight: "700" }}>
                {formatPayout(campaign.payout)}
              </Text>
            </View>
          </View>

          {/* Platform toggle — always visible so creators can choose */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "700", letterSpacing: 0.8 }}>
                PLATFORM
              </Text>
              {campaign.platform !== "both" && (
                <Text style={{ color: C.textDim, fontSize: 11 }}>
                  Campaign prefers {campaign.platform === "tiktok" ? "TikTok" : "Instagram"}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {(["tiktok", "instagram"] as SubmitPlatform[]).map((p) => {
                const cfg = PLATFORM_CONFIG[p];
                const active = selectedPlatform === p;
                const preferred = campaign.platform === p || campaign.platform === "both";
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => { Haptics.selectionAsync(); setSelectedPlatform(p); setUrl(""); setUrlTouched(false); }}
                    style={{
                      flex: 1, flexDirection: "row", alignItems: "center",
                      justifyContent: "center", gap: 7, paddingVertical: 12,
                      borderRadius: 12, borderWidth: 1.5,
                      backgroundColor: active ? cfg.activeBg : C.card,
                      borderColor: active ? cfg.activeBorder : C.border,
                      ...C.shadow,
                    }}
                  >
                    <Ionicons name={cfg.icon} size={15} color={active ? cfg.color : C.textDim} />
                    <View>
                      <Text style={{ color: active ? cfg.color : C.textMid, fontSize: 13, fontWeight: "600" }}>
                        {cfg.label}
                      </Text>
                      {preferred && campaign.platform !== "both" && (
                        <Text style={{ color: active ? cfg.color : C.textDim, fontSize: 9, fontWeight: "600", opacity: 0.8 }}>
                          preferred
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* URL input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 10 }}>
              {formatPlatform(selectedPlatform).toUpperCase()} VIDEO URL
            </Text>
            <View style={{
              flexDirection: "row", alignItems: "center",
              backgroundColor: C.card, borderRadius: 14,
              borderWidth: 1.5, paddingHorizontal: 14,
              borderColor: urlTouched
                ? (isUrlValid ? C.greenBorder : C.redBorder)
                : C.border,
              ...C.shadow,
            }}>
              <Ionicons
                name={platformCfg.icon}
                size={16}
                color={urlTouched && isUrlValid ? C.green : C.textDim}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={url}
                onChangeText={(v) => { setUrl(v); if (!urlTouched && v.length > 5) setUrlTouched(true); }}
                onBlur={() => setUrlTouched(true)}
                placeholder={platformCfg.placeholder}
                placeholderTextColor={C.textDim}
                style={{ flex: 1, color: C.text, fontSize: 13, paddingVertical: 15 }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
              {urlTouched && url.length > 0 && (
                <Ionicons
                  name={isUrlValid ? "checkmark-circle" : "close-circle"}
                  size={20}
                  color={isUrlValid ? C.green : C.red}
                />
              )}
            </View>
            {urlTouched && !isUrlValid && url.length > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 7 }}>
                <Ionicons name="information-circle-outline" size={13} color={C.red} />
                <Text style={{ color: C.red, fontSize: 12 }}>
                  Paste a {selectedPlatform === "tiktok" ? "TikTok video" : "Instagram Reel"} URL
                </Text>
              </View>
            )}
          </View>

          {/* Live URL preview */}
          {isUrlValid && parsed && (
            <View style={{
              backgroundColor: C.card, borderRadius: 14, marginBottom: 24,
              borderWidth: 1, borderColor: C.greenBorder, overflow: "hidden",
              ...C.shadow,
            }}>
              {/* Platform color strip */}
              <View style={{ height: 3, backgroundColor: parsed.platform === "tiktok" ? "#18181b" : "#be185d" }} />

              <View style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{
                  width: 46, height: 46, borderRadius: 13,
                  backgroundColor: parsed.platform === "tiktok" ? "rgba(0,0,0,0.06)" : "rgba(190,24,93,0.08)",
                  alignItems: "center", justifyContent: "center",
                  borderWidth: 1,
                  borderColor: parsed.platform === "tiktok" ? C.borderMid : "rgba(190,24,93,0.2)",
                }}>
                  <Ionicons
                    name={parsed.platform === "tiktok" ? "musical-notes" : "logo-instagram"}
                    size={22}
                    color={parsed.platform === "tiktok" ? "#18181b" : "#be185d"}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.green }} />
                    <Text style={{ color: C.greenText, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 }}>
                      VIDEO DETECTED
                    </Text>
                  </View>
                  {parsed.username && (
                    <Text style={{ color: C.text, fontSize: 14, fontWeight: "700", marginBottom: 2 }}>
                      @{parsed.username}
                    </Text>
                  )}
                  <Text style={{ color: C.textMid, fontSize: 12 }} numberOfLines={1}>
                    {parsed.displayUrl}
                  </Text>
                </View>

                <Ionicons name="open-outline" size={16} color={C.textDim} />
              </View>
            </View>
          )}

          {/* Confirmation checkbox */}
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); setConfirmed((v) => !v); }}
            style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}
            activeOpacity={0.7}
          >
            <View style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0,
              borderWidth: 1.5,
              borderColor: confirmed ? C.green : C.borderMid,
              backgroundColor: confirmed ? C.greenBg : C.card,
              alignItems: "center", justifyContent: "center",
              marginRight: 12, marginTop: 1,
            }}>
              {confirmed && <Ionicons name="checkmark" size={14} color={C.green} />}
            </View>
            <Text style={{ color: C.textMid, fontSize: 13, lineHeight: 21, flex: 1 }}>
              My video matches the brief and I own the content or have rights to submit it.
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Sticky CTA */}
        <View style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36,
          backgroundColor: "rgba(244,243,241,0.97)",
          borderTopWidth: 1, borderTopColor: C.border,
        }}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={{
              backgroundColor: canSubmit ? C.green : C.bgDeep,
              borderRadius: 16, paddingVertical: 17,
              alignItems: "center", flexDirection: "row",
              justifyContent: "center", gap: 8,
              borderWidth: 1,
              borderColor: canSubmit ? "transparent" : C.border,
              ...(canSubmit ? C.shadow : {}),
            }}
            activeOpacity={0.88}
          >
            <Text style={{ color: canSubmit ? "#fff" : C.textDim, fontSize: 16, fontWeight: "800" }}>
              {canSubmit ? "Submit for review" : "Add video URL to continue"}
            </Text>
            {canSubmit && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
