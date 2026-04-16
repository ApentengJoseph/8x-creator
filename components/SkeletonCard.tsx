import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { C } from "../constants/colors";

function Bone({ w, h, radius = 8, style, anim }: {
  w: number | string; h: number; radius?: number;
  style?: object; anim: Animated.Value;
}) {
  return (
    <Animated.View style={[{
      width: w as any, height: h, borderRadius: radius,
      backgroundColor: C.bgDeep, opacity: anim,
    }, style]} />
  );
}

export function SkeletonCard() {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,    duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={{
      backgroundColor: C.card,
      borderRadius: 22,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: C.border,
      overflow: "hidden",
      ...C.shadowMd,
    }}>

      {/* ── Gradient header skeleton ── */}
      <Animated.View style={{
        paddingHorizontal: 16, paddingVertical: 18,
        backgroundColor: C.bgDeep,
        opacity: Animated.add(0.5, Animated.multiply(pulse, 0.3)),
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          {/* Brand avatar */}
          <Bone w={48} h={48} radius={15} anim={pulse} />

          <View style={{ flex: 1, gap: 9 }}>
            {/* Brand name */}
            <Bone w={72} h={9} radius={5} anim={pulse} />
            {/* Campaign title */}
            <Bone w="75%" h={14} radius={7} anim={pulse} />
          </View>

          {/* Payout pill */}
          <Bone w={58} h={34} radius={20} anim={pulse} />
        </View>
      </Animated.View>

      {/* ── Card body skeleton ── */}
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14 }}>

        {/* Progress bar labels */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 7 }}>
          <Bone w={130} h={9} radius={5} anim={pulse} />
          <Bone w={44} h={9} radius={5} anim={pulse} />
        </View>

        {/* Progress bar track */}
        <View style={{ height: 4, backgroundColor: C.bgDeep, borderRadius: 2, marginBottom: 14 }}>
          <Animated.View style={{
            width: "62%", height: "100%", borderRadius: 2,
            backgroundColor: C.border, opacity: pulse,
          }} />
        </View>

        {/* Tags row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Bone w={72} h={26} radius={8} anim={pulse} />
          <Bone w={60} h={26} radius={8} anim={pulse} />
          <View style={{ flex: 1 }} />
          <Bone w={68} h={16} radius={6} anim={pulse} />
        </View>
      </View>
    </View>
  );
}
