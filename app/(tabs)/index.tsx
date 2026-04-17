import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, RefreshControl, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../../constants/colors";
import { CAMPAIGNS } from "../../data/campaigns";
import { CampaignCard } from "../../components/CampaignCard";
import { SkeletonCard } from "../../components/SkeletonCard";
import { EarningsCard } from "../../components/EarningsCard";
import { Campaign } from "../../types";

const TAB_BAR_HEIGHT = 104;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DiscoverScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const fadeAnims = useRef(CAMPAIGNS.map(() => new Animated.Value(0))).current;

  const animateIn = () =>
    Animated.stagger(55, fadeAnims.map((a) =>
      Animated.timing(a, { toValue: 1, duration: 300, useNativeDriver: true })
    )).start();

  useEffect(() => {
    const t = setTimeout(() => { setCampaigns(CAMPAIGNS); setLoading(false); animateIn(); }, 650);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  };

  const ListHeader = () => (
    <View style={{ paddingBottom: 4 }}>
      {/* Greeting */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: C.textDim, fontSize: 13, marginBottom: 4, fontWeight: "500" }}>
          {getGreeting()}
        </Text>
        <Text style={{ color: C.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.8, lineHeight: 34 }}>
          Maya
        </Text>
      </View>

      <EarningsCard />

      {/* Section header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <Text style={{ color: C.text, fontSize: 18, fontWeight: "700", letterSpacing: -0.3 }}>
          Active campaigns
        </Text>
        <View style={{
          flexDirection: "row", alignItems: "center", gap: 5,
          backgroundColor: C.greenBg, paddingHorizontal: 10, paddingVertical: 5,
          borderRadius: 20, borderWidth: 1, borderColor: C.greenBorder,
        }}>
          <Ionicons name="ellipse" size={6} color={C.green} />
          <Text style={{ color: C.greenText, fontSize: 12, fontWeight: "600" }}>
            {CAMPAIGNS.length} live
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={{ marginBottom: 24 }}>
            <View style={{ height: 10, width: 110, backgroundColor: C.bgDeep, borderRadius: 5, marginBottom: 10 }} />
            <View style={{ height: 28, width: 130, backgroundColor: C.bgDeep, borderRadius: 7 }} />
          </View>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: TAB_BAR_HEIGHT + 16 }}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item, index }) => (
          <Animated.View style={{ opacity: fadeAnims[index] }}>
            <CampaignCard campaign={item} />
          </Animated.View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={C.green} colors={[C.green]} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
