import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../../constants/colors";
import { CAMPAIGNS } from "../../data/campaigns";
import { VideoPlayer } from "../../components/VideoPlayer";
import { formatPayout, formatDeadline, formatPlatform } from "../../utils/formatters";

const TAB_BAR_HEIGHT = 104;

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [briefExpanded, setBriefExpanded] = useState(false);

  const campaign = CAMPAIGNS.find((c) => c.id === id);

  if (!campaign) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: C.textMid }}>Campaign not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={["top"]}>
      {/* Back bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 }}>
        <TouchableOpacity
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={{ flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", padding: 8, marginLeft: -8 }}
        >
          <Ionicons name="chevron-back" size={20} color={C.textMid} />
          <Text style={{ color: C.textMid, fontSize: 15 }}>Campaigns</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 80 }}>
        {/* Hero card */}
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <View style={{ backgroundColor: C.card, borderRadius: 22, borderWidth: 1, borderColor: C.border, overflow: "hidden", ...C.shadowMd }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.95)" }} />

            {/* Brand header */}
            <View style={{ padding: 20, paddingBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <View style={{
                  width: 52, height: 52, borderRadius: 16,
                  backgroundColor: campaign.brandAvatarColor,
                  alignItems: "center", justifyContent: "center",
                  marginRight: 14,
                }}>
                  <Text style={{ color: "rgba(255,255,255,0.95)", fontSize: 15, fontWeight: "800" }}>{campaign.brandAvatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "600", letterSpacing: 0.8, marginBottom: 4 }}>
                    {campaign.brandName.toUpperCase()}
                  </Text>
                  <Text style={{ color: C.text, fontSize: 18, fontWeight: "700", lineHeight: 24 }}>{campaign.title}</Text>
                </View>
              </View>

              {/* Stats row */}
              <View style={{
                flexDirection: "row", backgroundColor: C.bg,
                borderRadius: 14, padding: 14,
                borderWidth: 1, borderColor: C.border,
              }}>
                {[
                  { label: "PAYOUT",   value: formatPayout(campaign.payout),        color: C.greenText, icon: "cash-outline" as const },
                  { label: "DEADLINE", value: formatDeadline(campaign.daysLeft),     color: C.text,      icon: "time-outline" as const },
                  { label: "PLATFORM", value: formatPlatform(campaign.platform),     color: C.text,      icon: "phone-portrait-outline" as const },
                ].map((stat, i) => (
                  <React.Fragment key={i}>
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 5 }}>
                        <Ionicons name={stat.icon} size={11} color={C.textDim} />
                        <Text style={{ color: C.textDim, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 }}>{stat.label}</Text>
                      </View>
                      <Text style={{ color: stat.color, fontSize: 15, fontWeight: "700" }}>{stat.value}</Text>
                    </View>
                    {i < 2 && <View style={{ width: 1, backgroundColor: C.border, marginHorizontal: 4 }} />}
                  </React.Fragment>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {/* Brief */}
          <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 10 }}>THE BRIEF</Text>
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: C.border, ...C.shadow }}>
            <Text style={{ color: C.textMid, fontSize: 14, lineHeight: 23 }} numberOfLines={briefExpanded ? undefined : 4}>
              {campaign.brief}
            </Text>
            <TouchableOpacity onPress={() => setBriefExpanded((v) => !v)} style={{ marginTop: 10 }}>
              <Text style={{ color: C.green, fontSize: 13, fontWeight: "600" }}>
                {briefExpanded ? "Show less" : "Read full brief →"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Requirements */}
          <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 10 }}>MUST INCLUDE</Text>
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: C.border, ...C.shadow }}>
            {campaign.requirements.map((req, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: i < campaign.requirements.length - 1 ? 12 : 0 }}>
                <View style={{
                  width: 20, height: 20, borderRadius: 10,
                  backgroundColor: C.greenBg, alignItems: "center", justifyContent: "center",
                  marginRight: 10, marginTop: 1, flexShrink: 0,
                  borderWidth: 1, borderColor: C.greenBorder,
                }}>
                  <Ionicons name="checkmark" size={11} color={C.green} />
                </View>
                <Text style={{ color: C.textMid, fontSize: 14, lineHeight: 21, flex: 1 }}>{req}</Text>
              </View>
            ))}
          </View>

          {/* Example videos — real playback via VideoPlayer */}
          <Text style={{ color: C.textDim, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 4 }}>
            WATCH THESE FIRST
          </Text>
          <Text style={{ color: C.textDim, fontSize: 13, marginBottom: 14 }}>
            Replicate the structure — tap to play inline.
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            {campaign.exampleVideos.map((video) => (
              <VideoPlayer key={video.id} video={video} />
            ))}
          </ScrollView>

          {/* Scarcity */}
          {campaign.spotsLeft <= 10 && (
            <View style={{
              backgroundColor: C.amberBg, borderRadius: 14, padding: 14, marginBottom: 24,
              borderWidth: 1, borderColor: C.amberBorder, flexDirection: "row", alignItems: "center", gap: 10,
            }}>
              <Ionicons name="flash" size={16} color={C.amber} />
              <Text style={{ color: C.amber, fontSize: 14, fontWeight: "600", flex: 1 }}>
                Only {campaign.spotsLeft} spots remaining
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 16, paddingTop: 12, paddingBottom: 36,
        backgroundColor: "rgba(244,243,241,0.97)",
        borderTopWidth: 1, borderTopColor: C.border,
      }}>
        <TouchableOpacity
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push(`/submit/${campaign.id}`); }}
          style={{
            backgroundColor: C.green, borderRadius: 16, paddingVertical: 17,
            alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8,
            ...C.shadow,
          }}
          activeOpacity={0.88}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>Submit your video</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
