import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { ExampleVideo } from "../types";
import { C } from "../constants/colors";

interface Props {
  video: ExampleVideo;
}

export function VideoPlayer({ video }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const isTikTok = video.url.includes("tiktok.com");

  const player = useVideoPlayer(video.videoUrl, (p) => {
    p.loop = true;
  });

  // Pause + reset when the component unmounts (e.g. navigating back from campaign detail).
  // Without this, a playing TextureView surface gets destroyed mid-frame → white screen flash.
  useEffect(() => {
    return () => {
      player.pause();
      player.currentTime = 0;
    };
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setIsBuffering(true);
    player.play();
  }, [player]);

  const handleStop = useCallback(() => {
    player.pause();
    player.currentTime = 0;
    setIsPlaying(false);
    setIsBuffering(false);
  }, [player]);

  return (
    <View
      style={{
        width: 140,
        aspectRatio: 9 / 16,
        borderRadius: 16,
        overflow: "hidden",
        marginRight: 12,
        backgroundColor: video.thumbnailColor,
        ...C.shadow,
      }}
    >
      {/*
       * VideoView is ALWAYS mounted here.
       * Conditional mounting was the bug: player.play() fired before the view
       * existed, so the player had no rendering surface and showed nothing.
       * Now the poster is just an overlay on top of the always-present view.
       */}
      <VideoView
        player={player}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
        contentFit="cover"
        nativeControls={false}
        surfaceType="textureView"
        onFirstFrameRender={() => setIsBuffering(false)}
      />

      {/* ── Poster overlay (visible when not playing) ── */}
      {!isPlaying && (
        <TouchableOpacity
          onPress={handlePlay}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={0.88}
        >
          {/* Solid brand-color background covers the empty video surface */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: video.thumbnailColor }} />
          {/* Dark tint for legibility */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.28)" }} />

          {/* Subtle dot texture */}
          {([
            [14, undefined, 12, undefined],
            [24, undefined, undefined, 16],
            [44, undefined, 18, undefined],
            [58, undefined, undefined, 12],
            [72, undefined, 10, undefined],
            [36, undefined, undefined, 28],
          ] as [number, undefined, number | undefined, number | undefined][]).map(([top, , left, right], i) => (
            <View key={i} style={{
              position: "absolute",
              top: `${top}%` as any,
              ...(left !== undefined ? { left: `${left}%` } : {}),
              ...(right !== undefined ? { right: `${right}%` } : {}),
              width: 3, height: 3, borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.18)",
            }} />
          ))}

          {/* Platform badge */}
          <View style={{
            position: "absolute", top: 10, left: 10,
            flexDirection: "row", alignItems: "center", gap: 4,
            backgroundColor: "rgba(0,0,0,0.55)",
            borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4,
            borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
          }}>
            <Ionicons
              name={isTikTok ? "musical-notes" : "logo-instagram"}
              size={9}
              color={isTikTok ? "#fff" : "#e1306c"}
            />
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 9, fontWeight: "700" }}>
              {isTikTok ? "TikTok" : "Reels"}
            </Text>
          </View>

          {/* Duration badge */}
          <View style={{
            position: "absolute", top: 10, right: 10,
            backgroundColor: "rgba(0,0,0,0.55)",
            borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3,
          }}>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 9, fontWeight: "600" }}>
              {video.duration}
            </Text>
          </View>

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

          {/* Creator strip */}
          <View style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            paddingHorizontal: 10, paddingVertical: 9,
            backgroundColor: "rgba(0,0,0,0.52)",
          }}>
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700", marginBottom: 2 }}>
              {video.creator}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="eye-outline" size={9} color="rgba(255,255,255,0.55)" />
              <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 9 }}>
                {video.views}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* ── Playback controls (visible when playing) ── */}
      {isPlaying && (
        <>
          {isBuffering && (
            <View style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              alignItems: "center", justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}>
              <ActivityIndicator color="#fff" />
            </View>
          )}

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
