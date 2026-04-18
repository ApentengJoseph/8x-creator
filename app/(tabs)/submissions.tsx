import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useSubmissionsStore } from '../../store/submissionsStore';
import { SubmissionCard } from '../../components/SubmissionCard';
import { SubmissionStatus } from '../../types';

type Filter = 'all' | SubmissionStatus;

const TAB_BAR_HEIGHT = 104;

const FILTERS: { key: Filter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all',      label: 'All',      icon: 'layers-outline' },
  { key: 'pending',  label: 'Pending',  icon: 'hourglass-outline' },
  { key: 'approved', label: 'Approved', icon: 'checkmark-circle-outline' },
  { key: 'rejected', label: 'Rejected', icon: 'close-circle-outline' },
];

const FILTER_CONFIG: Record<Filter, { color: string; bg: string; border: string }> = {
  all:      { color: C.text,      bg: C.bgDeep,   border: C.borderMid },
  pending:  { color: C.amber,     bg: C.amberBg,  border: C.amberBorder },
  approved: { color: C.greenText, bg: C.greenBg,  border: C.greenBorder },
  rejected: { color: C.red,       bg: C.redBg,    border: C.redBorder },
};

export default function SubmissionsScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const submissions = useSubmissionsStore((s) => s.submissions);
  const totalEarnings = useSubmissionsStore((s) => s.totalEarnings);

  const counts: Record<Filter, number> = {
    all:      submissions.length,
    pending:  submissions.filter((s) => s.status === 'pending').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
  };

  const filtered = activeFilter === 'all'
    ? submissions
    : submissions.filter((s) => s.status === activeFilter);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 500);
  };

  const ListHeader = () => (
    <View style={{ paddingBottom: 8 }}>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: C.textMid, fontSize: 14, marginBottom: 5 }}>Your submissions,</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.8 }}>
            My Work
          </Text>
          {totalEarnings > 0 && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 5,
              backgroundColor: C.greenBg, paddingHorizontal: 12, paddingVertical: 6,
              borderRadius: 20, borderWidth: 1, borderColor: C.greenBorder,
            }}>
              <Ionicons name="trending-up" size={13} color={C.green} />
              <Text style={{ color: C.greenText, fontSize: 13, fontWeight: '700' }}>
                ${totalEarnings.toLocaleString('en-US')} earned
              </Text>
            </View>
          )}
        </View>
        {submissions.length > 0 && (
          <Text style={{ color: C.textDim, fontSize: 13, marginTop: 4 }}>
            {submissions.length} submission{submissions.length !== 1 ? 's' : ''} total
          </Text>
        )}
      </View>

      {/* Filter chips */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => {
          const active = f.key === activeFilter;
          const cfg = FILTER_CONFIG[f.key];
          const count = counts[f.key];
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => { Haptics.selectionAsync(); setActiveFilter(f.key); }}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 13, paddingVertical: 8,
                borderRadius: 20, borderWidth: 1.5,
                backgroundColor: active ? C.text : C.card,
                borderColor: active ? C.text : C.border,
                ...C.shadow,
              }}
            >
              <Ionicons
                name={f.icon}
                size={13}
                color={active ? "#fff" : C.textDim}
              />
              <Text style={{
                color: active ? "#fff" : C.textMid,
                fontSize: 13, fontWeight: active ? '700' : '500',
              }}>
                {f.label}
              </Text>
              {count > 0 && (
                <View style={{
                  backgroundColor: active ? "rgba(255,255,255,0.2)" : C.bgDeep,
                  borderRadius: 100, paddingHorizontal: 6, paddingVertical: 1,
                }}>
                  <Text style={{
                    color: active ? "#fff" : C.textDim,
                    fontSize: 11, fontWeight: '700',
                  }}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={{ paddingTop: 60, alignItems: 'center', paddingHorizontal: 32 }}>
      <View style={{
        width: 64, height: 64, borderRadius: 20,
        backgroundColor: C.bgDeep,
        borderWidth: 1, borderColor: C.border,
        alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        ...C.shadow,
      }}>
        <Ionicons name="layers-outline" size={28} color={C.textDim} />
      </View>
      <Text style={{ color: C.text, fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>
        {activeFilter === 'all' ? 'No submissions yet' : `No ${activeFilter} submissions`}
      </Text>
      <Text style={{ color: C.textMid, fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
        {activeFilter === 'all'
          ? 'Find a campaign and submit your first video — your next payout is 3 taps away.'
          : 'Switch filters to see your other submissions.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: TAB_BAR_HEIGHT + 16 }}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => <SubmissionCard submission={item} />}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={C.green}
            colors={[C.green]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
