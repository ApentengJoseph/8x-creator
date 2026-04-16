import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExampleVideo } from '../types';

interface Props {
  video: ExampleVideo;
}

export function VideoThumbnail({ video }: Props) {
  const isTikTok = video.url.includes('tiktok.com');

  const handlePress = () => {
    Linking.openURL(video.url).catch(() => {});
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
      <View
        style={{
          width: 136,
          aspectRatio: 9 / 16,
          borderRadius: 14,
          overflow: 'hidden',
          marginRight: 10,
          backgroundColor: video.thumbnailColor,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        {/* Gradient overlay */}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />

        {/* Platform badge top-right */}
        <View
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(0,0,0,0.55)',
            borderRadius: 8,
            paddingHorizontal: 7,
            paddingVertical: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <Ionicons
            name={isTikTok ? 'musical-notes' : 'logo-instagram'}
            size={10}
            color={isTikTok ? '#ffffff' : '#e1306c'}
          />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 9, fontWeight: '600' }}>
            {isTikTok ? 'TikTok' : 'Reels'}
          </Text>
        </View>

        {/* Play button center */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.4)',
            }}
          >
            <Ionicons name="play" size={16} color="#ffffff" style={{ marginLeft: 3 }} />
          </View>
        </View>

        {/* Bottom info */}
        <View
          style={{
            padding: 10,
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: '700', marginBottom: 3 }}>
            {video.creator}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name="eye-outline" size={9} color="rgba(255,255,255,0.5)" />
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{video.views}</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>·</Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{video.duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
