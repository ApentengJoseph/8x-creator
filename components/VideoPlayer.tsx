import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
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
  const [isReady, setIsReady]       = useState(false);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [realDuration, setRealDuration] = useState<string | null>(null);

  const player = useVideoPlayer(video.videoUrl, (p) => {
    p.loop  = true;
    p.muted = true; // visual examples — muting eliminates audio crackle
  });

  // Once the asset is loaded, seek to 1 s so the VideoView shows a real
  // frame as a thumbnail rather than a black/empty surface.
  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status }: { status: string }) => {
      if (status === "readyToPlay") {
        try { player.currentTime = 1; } catch {}
        setIsReady(true);
        if (player.duration > 0 && isFinite(player.duration)) {
          setRealDuration(formatSeconds(player.duration));
        }
      }
    });
    return () => sub.remove();
  }, [player]);

  // Pause on unmount to prevent white-screen flash during back navigation.
  // Wrapped in try/catch because expo-video may release the native player
  // before this effect cleanup runs, causing an "already released" error.
  useEffect(() => {
    return () => {
      try {
        player.pause();
        player.currentTime = 0;
      } catch {}
    };
  }, []);

  const handlePlay = useCallback(() => {
    try { player.currentTime = 0; } catch {}
    player.play();
    setIsPlaying(true);
  }, [player]);

  const handleStop = useCallback(() => {
    player.pause();
    setIsPlaying(false);
    // Seek back to poster frame
    try { player.currentTime = 1; } catch {}
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
      {/* Always-mounted VideoView — holds the thumbnail frame when paused */}
      <VideoView
        player={player}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
        contentFit="cover"
        nativeControls={false}
        surfaceType="textureView"
      />

      {/* Solid colour cover: only shown while the asset hasn't loaded yet.
          Once isReady, the real video frame shows through. */}
      {!isReady && (
        <View style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: video.thumbnailColor,
        }} />
      )}

      {/* ── Poster overlay (tap-to-play state) ── */}
      {!isPlaying && (
        <TouchableOpacity
          onPress={handlePlay}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={0.88}
        >
          {/* Gradient scrim so the play button is readable over any frame */}
          <LinearGradient
            colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.52)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />

          {/* Duration badge — shown once metadata is parsed */}
          {realDuration != null && (
            <View style={{
              position: "absolute", top: 10, right: 10,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
            }}>
              <Text style={{ color: "#fff", fontSize: 9, fontWeight: "600" }}>
                {realDuration}
              </Text>
            </View>
          )}

          {/* Play button */}
          <View style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            alignItems: "center", justifyContent: "center",
          }}>
            <View style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: "rgba(255,255,255,0.22)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1.5, borderColor: "rgba(255,255,255,0.7)",
            }}>
              <Ionicons name="play" size={18} color="#fff" style={{ marginLeft: 2 }} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* ── Playing controls ── */}
      {isPlaying && (
        <>
          <TouchableOpacity
            onPress={handleStop}
            style={{
              position: "absolute", top: 10, right: 10,
              width: 30, height: 30, borderRadius: 15,
              backgroundColor: "rgba(0,0,0,0.6)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
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
