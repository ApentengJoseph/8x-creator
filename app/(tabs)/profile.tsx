import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useSubmissionsStore } from '../../store/submissionsStore';

const TAB_BAR_HEIGHT = 104;

const MENU_ITEMS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel: string;
  badge?: string;
}[] = [
  { icon: 'card-outline',         label: 'Payout settings',   sublabel: 'Bank · PayPal · Venmo' },
  { icon: 'notifications-outline', label: 'Notifications',     sublabel: 'Campaign alerts & review updates' },
  { icon: 'shield-checkmark-outline', label: 'Connected accounts', sublabel: 'TikTok · Instagram', badge: '2' },
  { icon: 'help-circle-outline',  label: 'Help & support',    sublabel: 'FAQs, contact team' },
  { icon: 'document-text-outline', label: 'Creator agreement', sublabel: 'Terms & payment policy' },
];

export default function ProfileScreen() {
  const submissions = useSubmissionsStore((s) => s.submissions);
  const totalEarnings = useSubmissionsStore((s) => s.totalEarnings);

  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const pendingCount  = submissions.filter((s) => s.status === 'pending').length;
  const approvalRate  = submissions.length > 0
    ? Math.round((approvedCount / submissions.length) * 100)
    : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: TAB_BAR_HEIGHT + 16 }}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: C.textMid, fontSize: 14, marginBottom: 5 }}>Your account,</Text>
          <Text style={{ color: C.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.8 }}>
            Profile
          </Text>
        </View>

        {/* Avatar + identity card */}
        <View style={{
          backgroundColor: C.card, borderRadius: 22,
          borderWidth: 1, borderColor: C.border,
          padding: 20, marginBottom: 16,
          ...C.shadowMd,
        }}>
          {/* Top shine */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 22, borderTopRightRadius: 22 }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            {/* Avatar */}
            <View style={{
              width: 62, height: 62, borderRadius: 20,
              backgroundColor: '#dbeafe',
              alignItems: 'center', justifyContent: 'center',
              borderWidth: 1.5, borderColor: 'rgba(59,130,246,0.2)',
            }}>
              <Text style={{ fontSize: 26 }}>👋</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontSize: 19, fontWeight: '800', letterSpacing: -0.3, marginBottom: 3 }}>
                Theo Johnson
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.green }} />
                <Text style={{ color: C.greenText, fontSize: 12, fontWeight: '600' }}>Creator · Active</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => Haptics.selectionAsync()}
              style={{
                width: 36, height: 36, borderRadius: 12,
                backgroundColor: C.bgDeep, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: C.border,
              }}
            >
              <Ionicons name="pencil-outline" size={16} color={C.textMid} />
            </TouchableOpacity>
          </View>

          {/* Stats row */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: C.bg, borderRadius: 14,
            padding: 14, borderWidth: 1, borderColor: C.border,
          }}>
            {[
              { label: 'EARNED',    value: `$${totalEarnings.toLocaleString('en-US')}`, color: C.greenText, icon: 'cash-outline' as const },
              { label: 'SUBMITTED', value: String(submissions.length),                  color: C.text,      icon: 'cloud-upload-outline' as const },
              { label: 'APPROVAL',  value: submissions.length > 0 ? `${approvalRate}%` : '—', color: C.text, icon: 'checkmark-done-outline' as const },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 }}>
                    <Ionicons name={stat.icon} size={11} color={C.textDim} />
                    <Text style={{ color: C.textDim, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 }}>{stat.label}</Text>
                  </View>
                  <Text style={{ color: stat.color, fontSize: 16, fontWeight: '800' }}>{stat.value}</Text>
                </View>
                {i < 2 && <View style={{ width: 1, backgroundColor: C.border, marginHorizontal: 4 }} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* In-review notice */}
        {pendingCount > 0 && (
          <View style={{
            backgroundColor: C.amberBg, borderRadius: 14,
            borderWidth: 1, borderColor: C.amberBorder,
            padding: 14, marginBottom: 16,
            flexDirection: 'row', alignItems: 'center', gap: 10,
          }}>
            <Ionicons name="hourglass-outline" size={16} color={C.amber} />
            <Text style={{ color: C.amber, fontSize: 14, fontWeight: '600', flex: 1 }}>
              {pendingCount} video{pendingCount !== 1 ? 's' : ''} in review — usually 24 hours
            </Text>
          </View>
        )}

        {/* Menu section */}
        <Text style={{ color: C.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10, marginTop: 8 }}>
          SETTINGS
        </Text>
        <View style={{
          backgroundColor: C.card, borderRadius: 18,
          borderWidth: 1, borderColor: C.border,
          overflow: 'hidden', ...C.shadow,
        }}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => Haptics.selectionAsync()}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 14,
                paddingHorizontal: 16, paddingVertical: 14,
                borderBottomWidth: i < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: C.border,
              }}
            >
              <View style={{
                width: 36, height: 36, borderRadius: 11,
                backgroundColor: C.bgDeep, alignItems: 'center', justifyContent: 'center',
                borderWidth: 1, borderColor: C.border,
              }}>
                <Ionicons name={item.icon} size={17} color={C.textMid} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 2 }}>
                  {item.label}
                </Text>
                <Text style={{ color: C.textDim, fontSize: 12 }}>{item.sublabel}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {item.badge && (
                  <View style={{
                    backgroundColor: C.greenBg, borderRadius: 10,
                    paddingHorizontal: 7, paddingVertical: 2,
                    borderWidth: 1, borderColor: C.greenBorder,
                  }}>
                    <Text style={{ color: C.greenText, fontSize: 11, fontWeight: '700' }}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={15} color={C.textDim} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity
          onPress={() => Haptics.selectionAsync()}
          activeOpacity={0.7}
          style={{
            marginTop: 16, backgroundColor: C.card,
            borderRadius: 16, borderWidth: 1, borderColor: C.border,
            paddingVertical: 15, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center', gap: 8,
            ...C.shadow,
          }}
        >
          <Ionicons name="log-out-outline" size={17} color={C.red} />
          <Text style={{ color: C.red, fontSize: 15, fontWeight: '600' }}>Sign out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={{ color: C.textDim, fontSize: 12, textAlign: 'center', marginTop: 20 }}>
          8x Creator · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
