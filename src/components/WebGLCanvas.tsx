import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Animated} from 'react-native';
import {renderingEngine} from '../engine/RenderingEngine';
import {SkiaShapesDemo} from './SkiaCanvas';

/**
 * Animated Flying Bird Component for Mobile (Outside Skia Canvas)
 */
const MobileFlyingBird: React.FC = () => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const createAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const animation = createAnimation();
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-50, 150, 350],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -10, 5, -5, 0],
  });

  const rotate = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '5deg', '0deg'],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });

  return (
    <View style={styles.birdContainer}>
      <Animated.View
        style={[
          styles.birdWrapper,
          {
            transform: [{translateX}, {translateY}, {rotate}, {scale}],
          },
        ]}>
        {/* Glow effect */}
        <View style={styles.birdGlow} />

        {/* Bird GIF */}
        <Image
          source={require('../assets/birdfly.gif')}
          style={styles.birdImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bird label */}
    </View>
  );
};

/**
 * WebGL Canvas Component - Native Platform (Mobile)
 * Uses Skia for hardware-accelerated graphics on mobile
 */
export const WebGLCanvas: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📱 Mobile Graphics Engine</Text>
        <Text style={styles.subtitle}>Powered by Skia</Text>
      </View>

      {/* Flying Bird Animation - Outside of 3D Skia Canvas */}
      <MobileFlyingBird />

      <SkiaShapesDemo width={320} height={600} />

      <View style={styles.info}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: renderingEngine.getConsistentSpacing(16),
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: renderingEngine.getConsistentSpacing(16),
  },
  title: {
    fontSize: renderingEngine.getConsistentFontSize(18),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: renderingEngine.getConsistentFontSize(14),
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: renderingEngine.getConsistentSpacing(4),
  },
  birdContainer: {
    height: 80,
    width: 320,
    marginBottom: renderingEngine.getConsistentSpacing(16),
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#E3F2FD',
    borderRadius: renderingEngine.getConsistentBorderRadius(12),
    borderWidth: 2,
    borderColor: '#90CAF9',
  },
  birdWrapper: {
    position: 'absolute',
    top: 15,
    left: 0,
  },
  birdGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 80,
    height: 60,
    backgroundColor: 'rgba(144, 238, 144, 0.3)',
    borderRadius: 40,
  },
  birdImage: {
    width: 60,
    height: 40,
  },
  birdLabel: {
    position: 'absolute',
    bottom: 5,
    left: 10,
    fontSize: renderingEngine.getConsistentFontSize(12),
    color: '#1976D2',
    fontWeight: '600',
  },
  info: {
    alignItems: 'center',
    marginTop: renderingEngine.getConsistentSpacing(16),
    maxWidth: 320,
  },
  infoTitle: {
    fontSize: renderingEngine.getConsistentFontSize(14),
    fontWeight: '600',
    color: '#666',
    marginBottom: renderingEngine.getConsistentSpacing(4),
  },
  infoText: {
    fontSize: renderingEngine.getConsistentFontSize(13),
    color: '#777',
    textAlign: 'center',
    lineHeight: renderingEngine.getConsistentFontSize(18),
  },
});

export default WebGLCanvas;
