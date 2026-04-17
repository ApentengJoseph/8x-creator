import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { C } from "../constants/colors";

export function SkeletonCard() {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const Bone = ({ w, h, radius = 7 }: { w: number | string; h: number; radius?: number }) => (
    <Animated.View style={{ width: w as any, height: h, borderRadius: radius, backgroundColor: C.bgDeep, opacity: pulse }} />
  );

  return (
    <View style={{
      backgroundColor: C.card,
      borderRadius: 18,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: C.border,
      padding: 16,
      ...C.shadow,
    }}>
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Bone w={42} h={42} radius={13} />
        <View style={{ flex: 1, gap: 7 }}>
          <Bone w={72} h={9} radius={5} />
          <Bone w="68%" h={13} radius={6} />
        </View>
        <Bone w={58} h={32} radius={10} />
      </View>

      {/* Progress */}
      <Bone w="100%" h={4} radius={2} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6, marginBottom: 12 }}>
        <Bone w={130} h={9} radius={5} />
        <Bone w={28} h={9} radius={5} />
      </View>

      {/* Tags */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Bone w={68} h={24} radius={6} />
        <Bone w={64} h={24} radius={6} />
        <View style={{ flex: 1 }} />
        <Bone w={56} h={14} radius={5} />
      </View>
    </View>
  );
}
