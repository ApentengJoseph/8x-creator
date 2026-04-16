import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { C } from "../constants/colors";

const TABS = [
  { name: "index",       label: "Discover",    icon: "compass-outline" as const,   iconActive: "compass" as const },
  { name: "submissions", label: "My Work",     icon: "layers-outline" as const,     iconActive: "layers" as const },
  { name: "profile",     label: "Profile",     icon: "person-outline" as const,     iconActive: "person" as const },
];

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20,
        left: 16,
        right: 16,
        height: 66,
        borderRadius: 33,
        overflow: "hidden",
        ...C.shadowLg,
      }}
      pointerEvents="box-none"
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={75}
          tint="light"
          style={{ position: "absolute", inset: 0 }}
        />
      ) : (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        />
      )}

      {/* Border ring */}
      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 33,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.07)",
        }}
      />

      {/* Tab items */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 9,
                borderRadius: 26,
                backgroundColor: isFocused ? C.greenBg : "transparent",
                marginHorizontal: 4,
              }}
            >
              <Ionicons
                name={isFocused ? tab.iconActive : tab.icon}
                size={21}
                color={isFocused ? C.green : C.textDim}
              />
              <Text
                style={{
                  color: isFocused ? C.green : C.textDim,
                  fontSize: 10,
                  fontWeight: isFocused ? "700" : "400",
                  marginTop: 3,
                  letterSpacing: 0.1,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
