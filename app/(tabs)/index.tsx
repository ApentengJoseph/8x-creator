import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, RefreshControl, useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../../constants/colors";
import { CAMPAIGNS } from "../../data/campaigns";
import { useSubmissionsStore } from "../../store/submissionsStore";
import { CampaignCard } from "../../components/CampaignCard";
import { SubmissionCard } from "../../components/SubmissionCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import { UserAvatar } from "../../components/UserAvatar";
import { Campaign, SubmissionStatus } from "../../types";
import { formatPayout } from "../../utils/formatters";

type Section = "discover" | "work";
type Filter = "all" | SubmissionStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",      label: "All" },
  { key: "pending",  label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const USER_PHOTO = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces&q=90";

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  // 20px padding each side + 8px inner segment padding = 48px total inset
  const segPillWidth = (width - 48) / 2;

  const [section, setSection] = useState<Section>("discover");
  const [filter, setFilter]   = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns]   = useState<Campaign[]>([]);
  const fadeAnims   = useRef(CAMPAIGNS.map(() => new Animated.Value(0))).current;
  const slideAnim   = useRef(new Animated.Value(0)).current;
  const heroScale   = useRef(new Animated.Value(0.92)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;

  const submissions   = useSubmissionsStore((s) => s.submissions);
  const totalEarnings = useSubmissionsStore((s) => s.totalEarnings);
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const pendingCount  = submissions.filter((s) => s.status === "pending").length;
  const pendingValue  = submissions.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.payout, 0);

  const filtered = filter === "all"
    ? submissions
    : submissions.filter((s) => s.status === filter);

  const animateIn = () =>
    Animated.stagger(60, fadeAnims.map((a) =>
      Animated.timing(a, { toValue: 1, duration: 280, useNativeDriver: true })
    )).start();

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 180 }),
      Animated.timing(heroOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => { setCampaigns(CAMPAIGNS); setLoading(false); animateIn(); }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  const switchSection = (s: Section) => {
    Haptics.selectionAsync();
    Animated.spring(slideAnim, {
      toValue: s === "discover" ? 0 : 1,
      useNativeDriver: true,
      damping: 22,
      stiffness: 260,
    }).start();
    setSection(s);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* ── Top app bar ──────────────────────────────────── */}
      <View style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10,
        backgroundColor: C.bg,
      }}>
        <Text style={{ flex: 1, fontSize: 22, fontWeight: "900", color: C.text, letterSpacing: -0.5 }}>
          8x
        </Text>
        <TouchableOpacity
          onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/profile"); }}
          activeOpacity={0.85}
        >
          <UserAvatar name="Theo Johnson" imageUrl={USER_PHOTO} size={38} showRing showOnline />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={C.green}
            colors={[C.green]}
          />
        }
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* ── Profile hero ─────────────────────────────────── */}
        <Animated.View style={{
          alignItems: "center", paddingTop: 20, paddingBottom: 28, paddingHorizontal: 20,
          opacity: heroOpacity,
          transform: [{ scale: heroScale }],
        }}>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); router.push("/(tabs)/profile"); }}
            activeOpacity={0.9}
            style={{ marginBottom: 14 }}
          >
            <UserAvatar name="Theo Johnson" imageUrl={USER_PHOTO} size={84} showRing showOnline />
          </TouchableOpacity>

          <Text style={{ fontSize: 24, fontWeight: "800", color: C.text, letterSpacing: -0.4, marginBottom: 4 }}>
            Theo Johnson
          </Text>
          <Text style={{ fontSize: 14, color: C.textMid, marginBottom: totalEarnings > 0 ? 12 : 0 }}>
            Creator · 8x Social
          </Text>

          {totalEarnings > 0 && (
            <View style={{
              backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder,
              borderRadius: 100, paddingHorizontal: 16, paddingVertical: 7,
            }}>
              <Text style={{ color: C.greenText, fontSize: 14, fontWeight: "700" }}>
                ${totalEarnings.toLocaleString("en-US")} earned
              </Text>
            </View>
          )}
        </Animated.View>

        {/* ── Segmented pill control ───────────────────────── */}
        <View style={{
          flexDirection: "row", backgroundColor: C.bgDeep,
          borderRadius: 100, padding: 4,
          marginHorizontal: 20, marginBottom: 28,
          position: "relative",
        }}>
          {/* Sliding white pill — always rendered, width derived from screen */}
          <Animated.View style={{
            position: "absolute",
            top: 4, bottom: 4, left: 4,
            width: segPillWidth,
            borderRadius: 100,
            backgroundColor: C.card,
            transform: [{ translateX: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, segPillWidth] }) }],
            ...C.shadow,
          }} />
          {(["discover", "work"] as Section[]).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => switchSection(s)}
              activeOpacity={0.8}
              style={{ flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 100, zIndex: 1 }}
            >
              <Text style={{
                fontSize: 14, fontWeight: section === s ? "700" : "500",
                color: section === s ? C.text : C.textMid,
              }}>
                {s === "discover" ? "Discover" : `My Work${submissions.length > 0 ? ` (${submissions.length})` : ""}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Discover section ─────────────────────────────── */}
        {section === "discover" && (
          <>
            {/* Section header */}
            <View style={{
              flexDirection: "row", alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20, marginBottom: 14,
            }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: C.textDim, letterSpacing: 0.6 }}>
                ACTIVE CAMPAIGNS
              </Text>
              <View style={{
                flexDirection: "row", alignItems: "center", gap: 5,
                backgroundColor: C.greenBg, paddingHorizontal: 10, paddingVertical: 4,
                borderRadius: 100, borderWidth: 1, borderColor: C.greenBorder,
              }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.green }} />
                <Text style={{ color: C.greenText, fontSize: 12, fontWeight: "600" }}>
                  {CAMPAIGNS.length} live
                </Text>
              </View>
            </View>

            <View style={{ paddingHorizontal: 20, gap: 10 }}>
              {loading
                ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : campaigns.map((campaign, index) => (
                    <Animated.View key={campaign.id} style={{ opacity: fadeAnims[index] }}>
                      <CampaignCard campaign={campaign} />
                    </Animated.View>
                  ))
              }
            </View>
          </>
        )}

        {/* ── My Work section ──────────────────────────────── */}
        {section === "work" && (
          <>
            {/* Earnings strip — only when there are earnings */}
            {totalEarnings > 0 && (
              <View style={{
                marginHorizontal: 20, marginBottom: 20,
                backgroundColor: C.card, borderRadius: 16,
                borderWidth: 1, borderColor: C.border,
                padding: 16, ...C.shadow,
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <View>
                    <Text style={{ fontSize: 11, fontWeight: "700", color: C.textDim, letterSpacing: 0.5, marginBottom: 4 }}>
                      THIS MONTH
                    </Text>
                    <Text style={{ fontSize: 32, fontWeight: "800", color: C.text, letterSpacing: -1 }}>
                      ${totalEarnings.toLocaleString("en-US")}
                    </Text>
                  </View>
                  <View style={{
                    width: 42, height: 42, borderRadius: 12,
                    backgroundColor: C.greenBg, borderWidth: 1, borderColor: C.greenBorder,
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <Ionicons name="trending-up" size={20} color={C.greenText} />
                  </View>
                </View>
                <View style={{
                  flexDirection: "row", backgroundColor: C.bg,
                  borderRadius: 10, padding: 10,
                  borderWidth: 1, borderColor: C.border,
                }}>
                  {[
                    { label: "Approved", value: String(approvedCount), color: C.greenText },
                    { label: "Pending",  value: String(pendingCount),  color: C.amber },
                    { label: "Total",    value: String(submissions.length), color: C.text },
                  ].map((stat, i) => (
                    <React.Fragment key={i}>
                      <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 17, fontWeight: "800", color: stat.color, letterSpacing: -0.3 }}>
                          {stat.value}
                        </Text>
                        <Text style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{stat.label}</Text>
                      </View>
                      {i < 2 && <View style={{ width: 1, backgroundColor: C.border }} />}
                    </React.Fragment>
                  ))}
                </View>
                {pendingCount > 0 && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.border }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.amber }} />
                    <Text style={{ color: C.amber, fontSize: 13, fontWeight: "600" }}>
                      ${pendingValue.toLocaleString("en-US")} pending
                    </Text>
                    <Text style={{ color: C.textMid, fontSize: 13 }}>· in review</Text>
                  </View>
                )}
              </View>
            )}

            {/* Filter chips */}
            <ScrollView
              horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
              style={{ marginBottom: 16 }}
            >
              {FILTERS.map((f) => {
                const active = f.key === filter;
                const count = f.key === "all"
                  ? submissions.length
                  : submissions.filter((s) => s.status === f.key).length;
                return (
                  <TouchableOpacity
                    key={f.key}
                    onPress={() => { Haptics.selectionAsync(); setFilter(f.key); }}
                    style={{
                      flexDirection: "row", alignItems: "center", gap: 5,
                      paddingHorizontal: 14, paddingVertical: 8,
                      borderRadius: 100, borderWidth: 1,
                      backgroundColor: active ? C.text : C.card,
                      borderColor: active ? C.text : C.border,
                      ...C.shadow,
                    }}
                  >
                    <Text style={{
                      fontSize: 13, fontWeight: "600",
                      color: active ? "#fff" : C.textMid,
                    }}>
                      {f.label}
                    </Text>
                    {count > 0 && (
                      <View style={{
                        backgroundColor: active ? "rgba(255,255,255,0.2)" : C.bgDeep,
                        borderRadius: 100, paddingHorizontal: 6, paddingVertical: 1,
                      }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: active ? "#fff" : C.textDim }}>
                          {count}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Submission cards */}
            {filtered.length > 0 ? (
              <View style={{ paddingHorizontal: 20, gap: 10 }}>
                {filtered.map((submission) => (
                  <SubmissionCard key={submission.id} submission={submission} />
                ))}
              </View>
            ) : (
              <View style={{ paddingTop: 52, alignItems: "center", paddingHorizontal: 32 }}>
                <View style={{
                  width: 60, height: 60, borderRadius: 30,
                  backgroundColor: C.bgDeep, borderWidth: 1, borderColor: C.border,
                  alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  <Ionicons name="layers-outline" size={26} color={C.textDim} />
                </View>
                <Text style={{ color: C.text, fontSize: 17, fontWeight: "700", marginBottom: 8, textAlign: "center" }}>
                  {filter === "all" ? "No submissions yet" : `No ${filter} submissions`}
                </Text>
                <Text style={{ color: C.textMid, fontSize: 14, textAlign: "center", lineHeight: 22 }}>
                  {filter === "all"
                    ? "Find a campaign and submit your first video."
                    : "Switch filters to see your other submissions."}
                </Text>
                {filter === "all" && (
                  <TouchableOpacity
                    onPress={() => switchSection("discover")}
                    style={{
                      marginTop: 20, backgroundColor: C.green,
                      borderRadius: 100, paddingHorizontal: 24, paddingVertical: 12,
                    }}
                  >
                    <Text style={{ color: C.text, fontSize: 14, fontWeight: "700" }}>Browse campaigns</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
