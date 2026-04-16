import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { C } from "../constants/colors";

function Bone({ width, height, borderRadius = 8, opacity }: {
  width: number | string; height: number; borderRadius?: number; opacity: Animated.Value;
}) {
  return (
    <Animated.View style={{
      width: width as any, height, borderRadius,
      backgroundColor: C.bgDeep, opacity,
    }} />
  );
}

export function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 850, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <View style={{
      backgroundColor: C.card,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: C.border,
      padding: 16,
      ...C.shadow,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
        <Bone width={44} height={44} borderRadius={14} opacity={opacity} />
        <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
          <Bone width={68} height={9} opacity={opacity} />
          <Bone width={150} height={14} opacity={opacity} />
        </View>
        <Bone width={58} height={32} borderRadius={20} opacity={opacity} />
      </View>
      <View style={{ height: 1, backgroundColor: C.border, marginBottom: 12 }} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Bone width={68} height={26} borderRadius={8} opacity={opacity} />
        <Bone width={58} height={26} borderRadius={8} opacity={opacity} />
      </View>
    </View>
  );
}
