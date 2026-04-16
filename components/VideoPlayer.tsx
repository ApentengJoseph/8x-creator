import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StatusBar } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

// ── One-at-a-time: only one video plays across all VideoPlayer instances ──────
let _stopActive: (() => void) | null = null;

function claimPlayback(stopFn: () => void) {
  if (_stopActive && _stopActive !== stopFn) _stopActive();
  _stopActive = stopFn;
}
function releasePlayback(stopFn: () => void) {
  if (_stopActive === stopFn) _stopActive = null;
}

export function VideoPlayer({ video }: Props) {
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady]           = useState(false);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [expanded, setExpanded]         = useState(false);
  const [realDuration, setRealDuration] = useState<string | null>(null);

  const player = useVideoPlayer(video.videoUrl, (p) => {
    p.loop  = true;
    p.muted = true;
    // Buffer less aggressively — avoids stuttering on large local assets
    p.bufferOptions = {
      preferredForwardBufferDuration: 4,
      waitsToMinimizeStalling: false,
    };
  });

  // Seek to frame 1 s once loaded → real thumbnail
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

  // Pause on unmount — wrapped in try/catch because expo-video may release
  // the native player before this effect cleanup runs.
  useEffect(() => {
    return () => {
      releasePlayback(stopFn);
      try { player.pause(); player.currentTime = 0; } catch {}
    };
  }, []);

  const stopFn = useCallback(() => {
    try { player.pause(); } catch {}
    try { player.currentTime = 1; } catch {}
    setIsPlaying(false);
  }, [player]);

  const handlePlay = useCallback(() => {
    claimPlayback(stopFn);       // stops any other playing video first
    try { player.currentTime = 0; } catch {}
    player.play();
    setIsPlaying(true);
  }, [player, stopFn]);

  const handleStop = useCallback(() => {
    stopFn();
    releasePlayback(stopFn);
  }, [stopFn]);

  const handleExpand = useCallback(() => {
    if (!isPlaying) {
      claimPlayback(stopFn);
      try { player.currentTime = 0; } catch {}
      player.play();
      setIsPlaying(true);
    }
    setExpanded(true);
  }, [isPlaying, player, stopFn]);

  const handleCloseExpanded = useCallback(() => {
    setExpanded(false);
  }, []);

  return (
    <>
      {/* ── Thumbnail card ─────────────────────────────── */}
      <View style={{
        width: 140,
        aspectRatio: 9 / 16,
        borderRadius: 16,
        overflow: "hidden",
        marginRight: 12,
        backgroundColor: video.thumbnailColor,
        ...C.shadow,
      }}>
        <VideoView
          player={player}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
          contentFit="cover"
          nativeControls={false}
          surfaceType="textureView"
        />

        {/* Loading cover — disappears once the first frame is ready */}
        {!isReady && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: video.thumbnailColor }} />
        )}

        {/* Gradient scrim always present for legibility */}
        <LinearGradient
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.55)"]}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />

        {/* Duration badge */}
        {realDuration != null && (
          <View style={{
            position: "absolute", top: 8, right: 8,
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2,
          }}>
            <Text style={{ color: "#fff", fontSize: 9, fontWeight: "600" }}>{realDuration}</Text>
          </View>
        )}

        {/* Expand button — always visible */}
        <TouchableOpacity
          onPress={handleExpand}
          style={{
            position: "absolute", top: 8, left: 8,
            width: 26, height: 26, borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.5)",
            alignItems: "center", justifyContent: "center",
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="expand-outline" size={13} color="#fff" />
        </TouchableOpacity>

        {/* Poster / play button */}
        {!isPlaying ? (
          <TouchableOpacity
            onPress={handlePlay}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}
            activeOpacity={0.88}
          >
            <View style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: "rgba(255,255,255,0.22)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1.5, borderColor: "rgba(255,255,255,0.7)",
            }}>
              <Ionicons name="play" size={17} color="#fff" style={{ marginLeft: 2 }} />
            </View>
          </TouchableOpacity>
        ) : (
          /* Stop button */
          <TouchableOpacity
            onPress={handleStop}
            style={{
              position: "absolute", bottom: 10, right: 8,
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: "rgba(0,0,0,0.6)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="stop" size={11} color="#fff" />
          </TouchableOpacity>
        )}

        {/* PLAYING badge */}
        {isPlaying && (
          <View style={{
            position: "absolute", bottom: 10, left: 8,
            flexDirection: "row", alignItems: "center", gap: 4,
            backgroundColor: "rgba(0,0,0,0.55)",
            borderRadius: 7, paddingHorizontal: 6, paddingVertical: 3,
          }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: C.red }} />
            <Text style={{ color: "#fff", fontSize: 8, fontWeight: "700", letterSpacing: 0.5 }}>LIVE</Text>
          </View>
        )}
      </View>

      {/* ── Fullscreen modal ───────────────────────────── */}
      <Modal
        visible={expanded}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCloseExpanded}
      >
        <StatusBar hidden />
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <VideoView
            player={player}
            style={{ flex: 1 }}
            contentFit="contain"
            nativeControls
            surfaceType="textureView"
            allowsFullscreen
          />
          {/* Close button */}
          <TouchableOpacity
            onPress={handleCloseExpanded}
            style={{
              position: "absolute",
              top: insets.top + 12,
              left: 16,
              width: 38, height: 38, borderRadius: 19,
              backgroundColor: "rgba(0,0,0,0.6)",
              alignItems: "center", justifyContent: "center",
              borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
