import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { C } from "../constants/colors";

export function SkeletonCard() {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const Bone = ({ w, h, radius = 6 }: { w: number | string; h: number; radius?: number }) => (
    <Animated.View style={{ width: w as any, height: h, borderRadius: radius, backgroundColor: C.bg3, opacity: pulse }} />
  );

  return (
    <View style={{
      backgroundColor: C.bg1,
      borderRadius: 16, padding: 16,
      borderWidth: 1, borderColor: C.border,
      flexDirection: "row", alignItems: "center", gap: 14,
      ...C.shadow,
    }}>
      {/* Avatar circle */}
      <Bone w={46} h={46} radius={23} />

      {/* Text lines */}
      <View style={{ flex: 1, gap: 8 }}>
        <Bone w="70%" h={14} radius={6} />
        <Bone w="50%" h={11} radius={5} />
      </View>

      {/* Payout */}
      <Bone w={44} h={18} radius={6} />
    </View>
  );
}
