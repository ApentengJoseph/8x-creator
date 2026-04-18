import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useSubmissionsStore } from '../../store/submissionsStore';
import { UserAvatar } from '../../components/UserAvatar';

const USER_PHOTO = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces&q=90";
const BANNER_IMAGE = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=300&fit=crop&q=80";

const MENU_ITEMS = [
  { icon: 'card-outline',             label: 'Payout settings',    sublabel: 'Bank · PayPal · Venmo',            badge: undefined },
  { icon: 'notifications-outline',    label: 'Notifications',      sublabel: 'Campaign alerts & review updates', badge: undefined },
  { icon: 'shield-checkmark-outline', label: 'Connected accounts', sublabel: 'TikTok · Instagram',               badge: '2' },
  { icon: 'help-circle-outline',      label: 'Help & support',     sublabel: 'FAQs, contact team',               badge: undefined },
  { icon: 'document-text-outline',    label: 'Creator agreement',  sublabel: 'Terms & payment policy',           badge: undefined },
] as const;

export default function ProfileScreen() {
  const router = useRouter();
  const submissions   = useSubmissionsStore((s) => s.submissions);
  const totalEarnings = useSubmissionsStore((s) => s.totalEarnings);

  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const pendingCount  = submissions.filter((s) => s.status === 'pending').length;
  const approvalRate  = submissions.length > 0
    ? Math.round((approvedCount / submissions.length) * 100)
    : 0;

  const avatarScale   = useRef(new Animated.Value(0.75)).current;
  const contentFade   = useRef(new Animated.Value(0)).current;
  const coverFade     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(coverFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    Animated.spring(avatarScale, { toValue: 1, useNativeDriver: true, damping: 14, stiffness: 180, delay: 150 }).start();
    Animated.timing(contentFade, { toValue: 1, duration: 400, delay: 280, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10,
      }}>
        <TouchableOpacity
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={{
            paddingHorizontal: 14, paddingVertical: 6,
            borderRadius: 99,
            backgroundColor: "rgba(255,255,255,0.08)",
            flexDirection: 'row', alignItems: 'center', gap: 6,
          }}
        >
          <Ionicons name="chevron-back" size={14} color={C.textMid} />
          <Text style={{ fontSize: 13, color: C.textMid }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '700', color: C.text, marginRight: 44 }}>
          Profile
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* ── Cover photo ─────────────────────────────────── */}
        <Animated.View style={{ height: 140, overflow: 'hidden', opacity: coverFade }}>
          <Image
            source={{ uri: BANNER_IMAGE }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
          }} />
        </Animated.View>

        {/* ── Avatar + identity ────────────────────────────── */}
        <Animated.View style={{
          alignItems: 'center',
          marginTop: -44,
          paddingBottom: 24,
          transform: [{ scale: avatarScale }],
        }}>
          <View style={{ marginBottom: 14 }}>
            <UserAvatar name="Theo Johnson" imageUrl={USER_PHOTO} size={88} showRing showOnline />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: C.text, letterSpacing: -0.3, marginBottom: 4 }}>
            Theo Johnson
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.green }} />
            <Text style={{ color: C.green, fontSize: 13, fontWeight: '600' }}>Creator · Active</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: contentFade }}>

          {/* ── Stats ───────────────────────────────────────── */}
          <View style={{
            flexDirection: 'row',
            marginHorizontal: 20, marginBottom: 20,
            backgroundColor: C.bg1, borderRadius: 16,
            borderWidth: 1, borderColor: C.border,
            overflow: 'hidden', ...C.shadow,
          }}>
            {[
              { label: 'Earned',    value: `$${totalEarnings.toLocaleString('en-US')}`, color: C.accent },
              { label: 'Submitted', value: String(submissions.length),                   color: C.text },
              { label: 'Approval',  value: submissions.length > 0 ? `${approvalRate}%` : '—', color: C.text },
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <View style={{ flex: 1, alignItems: 'center', paddingVertical: 18 }}>
                  <Text style={{ fontSize: 21, fontWeight: '800', color: stat.color, letterSpacing: -0.5, marginBottom: 5 }}>
                    {stat.value}
                  </Text>
                  <Text style={{ color: C.textDim, fontSize: 11, fontWeight: '600', letterSpacing: 0.2 }}>{stat.label}</Text>
                </View>
                {i < 2 && <View style={{ width: 1, backgroundColor: C.border, marginVertical: 14 }} />}
              </React.Fragment>
            ))}
          </View>

          {/* ── In-review notice ────────────────────────────── */}
          {pendingCount > 0 && (
            <View style={{
              marginHorizontal: 20, marginBottom: 20,
              backgroundColor: C.amberBg, borderRadius: 14,
              borderWidth: 1, borderColor: C.amberBorder,
              padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10,
            }}>
              <View style={{
                width: 32, height: 32, borderRadius: 10,
                backgroundColor: 'rgba(245,158,11,0.14)',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name="time-outline" size={17} color={C.amber} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.amber, fontSize: 14, fontWeight: '700' }}>
                  {pendingCount} video{pendingCount !== 1 ? 's' : ''} in review
                </Text>
                <Text style={{ color: C.amber, fontSize: 12, opacity: 0.8, marginTop: 1 }}>
                  Expected response within 24 hours
                </Text>
              </View>
            </View>
          )}

          {/* ── Settings ────────────────────────────────────── */}
          <Text style={{
            color: C.textDim, fontSize: 11, fontWeight: '700',
            letterSpacing: 0.8, marginLeft: 20, marginBottom: 10,
          }}>
            SETTINGS
          </Text>

          <View style={{
            marginHorizontal: 20,
            backgroundColor: C.bg1, borderRadius: 16,
            borderWidth: 1, borderColor: C.border,
            overflow: 'hidden', ...C.shadow,
          }}>
            {MENU_ITEMS.map((item, i) => (
              <MenuItem key={item.label} item={item} isLast={i === MENU_ITEMS.length - 1} />
            ))}
          </View>

          {/* ── Sign out ────────────────────────────────────── */}
          <TouchableOpacity
            onPress={() => Haptics.selectionAsync()}
            activeOpacity={0.7}
            style={{
              marginHorizontal: 20, marginTop: 16,
              backgroundColor: C.bg1, borderRadius: 14,
              borderWidth: 1, borderColor: C.border,
              paddingVertical: 15, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
              ...C.shadow,
            }}
          >
            <Ionicons name="log-out-outline" size={17} color={C.red} />
            <Text style={{ color: C.red, fontSize: 15, fontWeight: '600' }}>Sign out</Text>
          </TouchableOpacity>

          <Text style={{ color: C.textDim, fontSize: 12, textAlign: 'center', marginTop: 20 }}>
            8x Creator · v1.0.0
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ item, isLast }: { item: typeof MENU_ITEMS[number]; isLast: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 3 }).start();
    Haptics.selectionAsync();
  };

  return (
    <TouchableOpacity
      onPressIn={pressIn}
      onPressOut={pressOut}
      activeOpacity={0.9}
      style={{ borderBottomWidth: isLast ? 0 : 1, borderBottomColor: C.border }}
    >
      <Animated.View style={{
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 16, paddingVertical: 14,
        transform: [{ scale }],
      }}>
        <View style={{
          width: 36, height: 36, borderRadius: 10,
          backgroundColor: C.bg2,
          alignItems: 'center', justifyContent: 'center',
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {item.badge && (
            <View style={{
              backgroundColor: 'rgba(168,85,247,0.12)', borderRadius: 100,
              paddingHorizontal: 8, paddingVertical: 2,
              borderWidth: 1, borderColor: 'rgba(168,85,247,0.35)',
            }}>
              <Text style={{ color: C.accent, fontSize: 11, fontWeight: '700' }}>{item.badge}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={14} color={C.textDim} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
