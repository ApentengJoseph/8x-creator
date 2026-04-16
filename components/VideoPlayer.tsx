import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { ExampleVideo } from "../types";
import { C } from "../constants/colors";

interface Props {
  video: ExampleVideo;
}

function formatSeconds(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({ video }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [realDuration, setRealDuration] = useState<string | null>(null);

  const player = useVideoPlayer(video.videoUrl, (p) => {
    p.loop = true;
    p.muted = true; // visual examples only — muting eliminates audio crackle
  });

  // Read actual duration once the player has loaded the asset metadata
  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status }: { status: string }) => {
      if (status === "readyToPlay" && player.duration > 0 && isFinite(player.duration)) {
        setRealDuration(formatSeconds(player.duration));
      }
    });
    return () => sub.remove();
  }, [player]);

  // Pause + reset on unmount to prevent white-screen flash during back navigation
  useEffect(() => {
    return () => {
      player.pause();
      player.currentTime = 0;
    };
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    player.play();
  }, [player]);

  const handleStop = useCallback(() => {
    player.pause();
    player.currentTime = 0;
    setIsPlaying(false);
  }, [player]);

  return (
    <View style={{
      width: 140,
      aspectRatio: 9 / 16,
      borderRadius: 16,
      overflow: "hidden",
      marginRight: 12,
      backgroundColor: video.thumbnailColor,
      ...C.shadow,
    }}>
      {/* VideoView always mounted — unmounting while playing causes surface destruction */}
      <VideoView
        player={player}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
        contentFit="cover"
        nativeControls={false}
        surfaceType="textureView"
      />

      {/* ── Poster (shown before play) ── */}
      {!isPlaying && (
        <TouchableOpacity
          onPress={handlePlay}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={0.88}
        >
          {/* Brand-color base */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: video.thumbnailColor }} />
          {/* Dark tint */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.32)" }} />

          {/* Duration — real value once loaded, blank until then */}
          {realDuration != null && (
            <View style={{
              position: "absolute", top: 10, right: 10,
              backgroundColor: "rgba(0,0,0,0.55)",
              borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
            }}>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 9, fontWeight: "600" }}>
                {realDuration}
              </Text>
            </View>
          )}

          {/* Play button */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
            <View style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1.5, borderColor: "rgba(255,255,255,0.6)",
            }}>
              <Ionicons name="play" size={17} color="#fff" style={{ marginLeft: 2 }} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* ── Playback controls (shown while playing) ── */}
      {isPlaying && (
        <>
          <TouchableOpacity
            onPress={handleStop}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 30, height: 30, borderRadius: 15,
              backgroundColor: "rgba(0,0,0,0.6)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="stop" size={12} color="#fff" />
          </TouchableOpacity>

          <View style={{
            position: "absolute", top: 10, left: 10,
            flexDirection: "row", alignItems: "center", gap: 4,
            backgroundColor: "rgba(0,0,0,0.55)",
            borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4,
          }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.red }} />
            <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700", letterSpacing: 0.5 }}>
              PLAYING
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
