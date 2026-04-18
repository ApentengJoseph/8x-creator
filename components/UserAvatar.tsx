import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { C } from '../constants/colors';

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  showRing?: boolean;
  showOnline?: boolean;
}

export function UserAvatar({ name, imageUrl, size = 82, showRing = true, showOnline = false }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const parts = name.trim().split(' ');
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  const fontSize = Math.round(size * 0.33);
  const borderWidth = showRing ? Math.max(2, Math.round(size * 0.037)) : 0;
  const borderRadius = size / 2;
  const innerSize = size - borderWidth * 2;
  const indicatorSize = Math.round(size * 0.22);

  const showPhoto = !!imageUrl && !imgError;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: showPhoto ? C.bg2 : '#1B6B30',
        borderWidth,
        borderColor: C.accent,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        ...(size > 50 ? C.shadowMd : C.shadow),
      }}>
        {showPhoto ? (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: innerSize, height: innerSize, borderRadius: innerSize / 2 }}
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={{
            color: '#FFFFFF',
            fontSize,
            fontWeight: '800',
            letterSpacing: -0.5,
            includeFontPadding: false,
          }}>
            {initials}
          </Text>
        )}
      </View>

      {showOnline && (
        <View style={{
          position: 'absolute',
          bottom: borderWidth,
          right: borderWidth,
          width: indicatorSize,
          height: indicatorSize,
          borderRadius: indicatorSize / 2,
          backgroundColor: C.green,
          borderWidth: Math.max(2, Math.round(indicatorSize * 0.18)),
          borderColor: C.bg,
        }} />
      )}
    </View>
  );
}
