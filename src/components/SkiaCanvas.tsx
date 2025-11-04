import React, {useEffect, useState} from 'react';
import {View, Platform, Text} from 'react-native';
import {renderingEngine} from '../engine/RenderingEngine';

// Platform-specific imports using dynamic import
let SkiaComponents: any = {};
let ReanimatedComponents: any = {};

// Declare all Skia components
let Canvas: any = null;
let Circle: any = null;
let Path: any = null;
let Rect: any = null;
let SkiaText: any = null;
let Skia: any = null;
let Group: any = null;
let Image: any = null;
let useImage: any = null;
let LinearGradient: any = null;
let RadialGradient: any = null;
let Shadow: any = null;
let Blur: any = null;

// Declare all Reanimated components
let useSharedValue: any = null;
let useFrameCallback: any = null;
let interpolate: any = null;
let Extrapolate: any = null;

// Initialize components only on native platforms
if (Platform.OS !== 'web') {
  try {
    // Import Skia components
    const SkiaModule = require('@shopify/react-native-skia');
    Canvas = SkiaModule.Canvas;
    Circle = SkiaModule.Circle;
    Path = SkiaModule.Path;
    Rect = SkiaModule.Rect;
    SkiaText = SkiaModule.Text;
    Skia = SkiaModule.Skia;
    Group = SkiaModule.Group;
    Image = SkiaModule.Image;
    useImage = SkiaModule.useImage;
    LinearGradient = SkiaModule.LinearGradient;
    RadialGradient = SkiaModule.RadialGradient;
    Shadow = SkiaModule.Shadow;
    Blur = SkiaModule.Blur;

    // Import Reanimated components
    const ReanimatedModule = require('react-native-reanimated');
    useSharedValue = ReanimatedModule.useSharedValue;
    useFrameCallback = ReanimatedModule.useFrameCallback;
    interpolate = ReanimatedModule.interpolate;
    Extrapolate = ReanimatedModule.Extrapolate;
  } catch (error) {
    console.warn('React Native Skia or Reanimated not available:', error);
  }
}

interface SkiaCanvasProps {
  width: number;
  height: number;
  children?: React.ReactNode;
}

/**
 * Cross-platform Skia Canvas wrapper
 * Provides consistent rendering across native platforms
 */
export const SkiaCanvas: React.FC<SkiaCanvasProps> = ({
  width,
  height,
  children,
}) => {
  const {isWeb} = renderingEngine.getPlatformInfo();
  const consistentDimensions = renderingEngine.getConsistentDimensions(
    width,
    height,
  );

  // On web or if Skia is not available, show a fallback
  if (isWeb || !Canvas) {
    return (
      <View
        style={{
          width: consistentDimensions.width,
          height: consistentDimensions.height,
          backgroundColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
        }}>
        <View style={{padding: 20, alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 8,
              color: '#ccc',
            }}>
            {isWeb ? 'Skia Canvas (Web Fallback)' : 'Skia Not Available'}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#ccc',
              textAlign: 'center',
            }}>
            {isWeb
              ? 'Skia rendering is available on Android'
              : 'Please check Skia installation'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Canvas
      style={{
        width: consistentDimensions.width,
        height: consistentDimensions.height,
      }}>
      {children}
    </Canvas>
  );
};

interface ConsistentShapeProps {
  x: number;
  y: number;
  size: number;
  color: string;
}

/**
 * Consistent Circle component that renders identically across platforms
 */
export const ConsistentCircle: React.FC<ConsistentShapeProps> = ({
  x,
  y,
  size,
  color,
}) => {
  if (!Circle) return null;

  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);
  const adjustedSize = renderingEngine.getConsistentSpacing(size);

  return (
    <Circle cx={adjustedX} cy={adjustedY} r={adjustedSize / 2} color={color} />
  );
};

interface ConsistentRectProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

/**
 * Consistent Rectangle component
 */
export const ConsistentRect: React.FC<ConsistentRectProps> = ({
  x,
  y,
  width,
  height,
  color,
}) => {
  if (!Rect) return null;

  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);
  const adjustedDimensions = renderingEngine.getConsistentDimensions(
    width,
    height,
  );

  return (
    <Rect
      x={adjustedX}
      y={adjustedY}
      width={adjustedDimensions.width}
      height={adjustedDimensions.height}
      color={color}
    />
  );
};

interface ConsistentTextProps {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
}

/**
 * Consistent Text component using Skia
 */
export const ConsistentSkiaText: React.FC<ConsistentTextProps> = ({
  x,
  y,
  text,
  fontSize,
  color,
}) => {
  if (!SkiaText) return null;

  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);
  const adjustedFontSize = renderingEngine.getConsistentFontSize(fontSize);

  // For now, we'll use a simple text rendering without custom fonts
  // In a real implementation, you'd load custom fonts for consistency
  return (
    <SkiaText
      x={adjustedX}
      y={adjustedY}
      text={text}
      color={color}
      font={null}
    />
  );
};

/**
 * 3D Animated Sphere with depth and rotation
 */
export const Animated3DSphere: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  time: number;
}> = ({x, y, size, color, time}) => {
  if (!Circle || !RadialGradient || !Group || !Shadow) return null;

  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);
  const adjustedSize = renderingEngine.getConsistentSpacing(size);

  // 3D rotation effect
  const rotationY = Math.sin(time * 0.002) * 30;
  const rotationX = Math.cos(time * 0.0015) * 20;
  const scale = 0.8 + Math.sin(time * 0.003) * 0.3;
  const shadowOffset = Math.sin(time * 0.002) * 5 + 10;

  return (
    <Group
      transform={[
        {translateX: adjustedX},
        {translateY: adjustedY},
        {scale: scale},
        {rotateY: rotationY},
        {rotateX: rotationX},
      ]}>
      {/* Shadow */}
      <Circle
        cx={shadowOffset}
        cy={shadowOffset}
        r={adjustedSize / 2}
        color="rgba(0,0,0,0.3)"
      />

      {/* Main sphere with gradient */}
      <Circle cx={0} cy={0} r={adjustedSize / 2}>
        <RadialGradient
          c={{x: -adjustedSize / 4, y: -adjustedSize / 4}}
          r={adjustedSize / 2}
          colors={[`${color}FF`, `${color.slice(0, -2)}80`]}
        />
      </Circle>

      {/* Highlight */}
      <Circle
        cx={-adjustedSize / 6}
        cy={-adjustedSize / 6}
        r={adjustedSize / 6}
        color="rgba(255,255,255,0.6)"
      />
    </Group>
  );
};

/**
 * 3D Rotating Cube with perspective
 */
export const Animated3DCube: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  time: number;
}> = ({x, y, size, color, time}) => {
  if (!Rect || !Path || !Group || !LinearGradient || !Skia) return null;

  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);
  const adjustedSize = renderingEngine.getConsistentSpacing(size);

  const rotation = time * 0.001;
  const rotationX = Math.sin(time * 0.002) * 45;
  const rotationY = Math.cos(time * 0.0015) * 45;

  // Create 3D cube faces
  const createCubeFace = (
    offsetX: number,
    offsetY: number,
    faceColor: string,
  ) => {
    const path = Skia.Path.Make();
    path.addRect({
      x: -adjustedSize / 2,
      y: -adjustedSize / 2,
      width: adjustedSize,
      height: adjustedSize,
    });

    return (
      <Group transform={[{translateX: offsetX}, {translateY: offsetY}]}>
        <Path path={path}>
          <LinearGradient
            start={{x: -adjustedSize / 2, y: -adjustedSize / 2}}
            end={{x: adjustedSize / 2, y: adjustedSize / 2}}
            colors={[faceColor, `${faceColor}80`]}
          />
        </Path>
      </Group>
    );
  };

  return (
    <Group
      transform={[
        {translateX: adjustedX},
        {translateY: adjustedY},
        {rotateX: rotationX},
        {rotateY: rotationY},
        {rotateZ: rotation * 60},
      ]}>
      {/* Back face */}
      {createCubeFace(-10, -10, '#334455')}
      {/* Main face */}
      {createCubeFace(0, 0, color)}
      {/* Top face */}
      {createCubeFace(5, -5, '#556677')}
    </Group>
  );
};

/**
 * 3D Floating Particles with depth
 */
export const Floating3DParticles: React.FC<{
  width: number;
  height: number;
  time: number;
}> = ({width, height, time}) => {
  if (!Circle || !Group) return null;

  const particles = Array.from({length: 15}, (_, i) => {
    const baseX = (i % 5) * (width / 5) + width / 10;
    const baseY = Math.floor(i / 5) * (height / 3) + height / 6;

    const floatX = Math.sin(time * 0.001 + i * 0.5) * 30;
    const floatY = Math.cos(time * 0.0008 + i * 0.7) * 20;
    const floatZ = Math.sin(time * 0.0012 + i) * 10;

    const scale = 0.5 + Math.sin(time * 0.003 + i) * 0.3;
    const opacity = 0.4 + Math.sin(time * 0.004 + i) * 0.3;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

    return (
      <Group
        key={i}
        transform={[
          {translateX: baseX + floatX},
          {translateY: baseY + floatY},
          {translateZ: floatZ},
          {scale: scale},
        ]}>
        <Circle
          cx={0}
          cy={0}
          r={8}
          color={`${colors[i % colors.length]}${Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, '0')}`}
        />
      </Group>
    );
  });

  return <>{particles}</>;
};

/**
 * 3D Wave Animation
 */
export const Animated3DWave: React.FC<{
  x: number;
  y: number;
  width: number;
  time: number;
}> = ({x, y, width, time}) => {
  if (!Path || !Skia || !LinearGradient) return null;

  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);
  const adjustedWidth = renderingEngine.getConsistentSpacing(width);

  const path = Skia.Path.Make();
  path.moveTo(0, 0);

  // Create wave with 3D perspective
  for (let i = 0; i <= adjustedWidth; i += 5) {
    const waveY =
      Math.sin(i / 20 + time * 0.005) * 20 * Math.sin(time * 0.003 + i * 0.01);
    const perspective = 1 - (i / adjustedWidth) * 0.3; // 3D perspective effect
    path.lineTo(i, waveY * perspective);
  }

  path.lineTo(adjustedWidth, 50);
  path.lineTo(0, 50);
  path.close();

  return (
    <Group transform={[{translateX: adjustedX}, {translateY: adjustedY}]}>
      <Path path={path}>
        <LinearGradient
          start={{x: 0, y: -30}}
          end={{x: 0, y: 50}}
          colors={['#FF6B6BAA', '#FF6B6B22']}
        />
      </Path>
    </Group>
  );
};

/**
 * 3D Animated Flying Bird GIF with movement
 */
export const AnimatedFlyingBird: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  time: number;
}> = ({x, y, width, height, time}) => {
  if (!Image || !useImage || !Group) return null;

  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);
  const adjustedDimensions = renderingEngine.getConsistentDimensions(
    width,
    height,
  );

  // Load the bird GIF
  const birdImage = useImage(require('../assets/birdfly.gif'));

  if (!birdImage) {
    // Show placeholder while loading
    return (
      <Group transform={[{translateX: adjustedX}, {translateY: adjustedY}]}>
        <ConsistentRect
          x={0}
          y={0}
          width={width}
          height={height}
          color="#4ECDC4"
        />
        <ConsistentSkiaText
          x={10}
          y={height / 2}
          text="🐦"
          fontSize={24}
          color="#FFF"
        />
      </Group>
    );
  }

  // Create flying motion
  const flyX = Math.sin(time * 0.001) * 150; // Increased horizontal flying
  const flyY = Math.sin(time * 0.0015) * 40; // Increased vertical bobbing
  const rotation = Math.sin(time * 0.002) * 15; // Increased wing tilting
  const scale = 1.0 + Math.sin(time * 0.003) * 0.3; // Larger size pulsing

  return (
    <Group
      transform={[
        {translateX: adjustedX + flyX},
        {translateY: adjustedY + flyY},
        {scale: scale},
        {rotateZ: rotation},
      ]}>
      {/* Bright glow effect around bird */}
      <Circle
        cx={adjustedDimensions.width / 2}
        cy={adjustedDimensions.height / 2}
        r={50}
        color="rgba(144, 238, 144, 0.3)"
      />

      {/* Bird shadow */}
      <Image
        image={birdImage}
        x={5}
        y={5}
        width={adjustedDimensions.width}
        height={adjustedDimensions.height}
        fit="contain"
        opacity={0.3}
      />

      {/* Main bird image */}
      <Image
        image={birdImage}
        x={0}
        y={0}
        width={adjustedDimensions.width}
        height={adjustedDimensions.height}
        fit="contain"
      />
    </Group>
  );
};

/**
 * Complex shape demonstration using Path
 */
export const ConsistentPath: React.FC<{
  pathData: string;
  color: string;
  strokeWidth?: number;
  x?: number;
  y?: number;
}> = ({pathData, color, strokeWidth = 2, x = 0, y = 0}) => {
  if (!Path || !Skia || !Group) return null;

  const adjustedStrokeWidth = renderingEngine.getConsistentSpacing(strokeWidth);
  const adjustedX = renderingEngine.getConsistentSpacing(x);
  const adjustedY = renderingEngine.getConsistentSpacing(y);

  const path = Skia.Path.MakeFromSVGString(pathData);

  if (!path) {
    return null;
  }

  return (
    <Group transform={[{translateX: adjustedX}, {translateY: adjustedY}]}>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={adjustedStrokeWidth}
      />
    </Group>
  );
};

/**
 * Demo component showcasing various Skia shapes with beautiful 3D animations
 */
export const SkiaShapesDemo: React.FC<{width: number; height: number}> = ({
  width,
  height,
}) => {
  const [time, setTime] = useState(0);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 16); // 60fps
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <SkiaCanvas width={width} height={height}>
      {/* Background with gradient */}
      <ConsistentRect
        x={0}
        y={0}
        width={width}
        height={height}
        color="#000814"
      />

      {/* Flying Sparrow Animation - MOVED TO TOP FOR VISIBILITY */}
      <AnimatedFlyingBird x={120} y={10} width={80} height={60} time={time} />

      {/* 3D Floating Particles Background */}
      <Floating3DParticles width={width} height={height} time={time} />

      {/* 3D Animated Spheres instead of regular circles */}
      <Animated3DSphere x={50} y={50} size={40} color="#FF6B6B" time={time} />
      <Animated3DSphere
        x={150}
        y={50}
        size={40}
        color="#4ECDC4"
        time={time + 1000}
      />
      <Animated3DSphere
        x={250}
        y={50}
        size={40}
        color="#45B7D1"
        time={time + 2000}
      />

      {/* 3D Rotating Cubes instead of regular rectangles */}
      <Animated3DCube x={60} y={140} size={50} color="#96CEB4" time={time} />
      <Animated3DCube
        x={160}
        y={140}
        size={50}
        color="#FFEAA7"
        time={time + 1500}
      />
      <Animated3DCube
        x={260}
        y={140}
        size={50}
        color="#DDA0DD"
        time={time + 3000}
      />

      {/* 3D Wave Animation */}
      <Animated3DWave x={20} y={200} width={280} time={time} />

      {/* Enhanced Text with glow effect */}
      <ConsistentSkiaText
        x={20}
        y={240}
        text="🚀 3D Pixel-Perfect Rendering"
        fontSize={16}
        color="#00F5FF"
      />
      <ConsistentSkiaText
        x={20}
        y={270}
        text="✨ Fabric + Skia 3D Integration"
        fontSize={14}
        color="#FFD700"
      />
      <ConsistentSkiaText
        x={20}
        y={85}
        text="🐦 Flying Sparrow Animation"
        fontSize={14}
        color="#90EE90"
      />

      {/* 3D Animated Path shapes */}
      <Group
        transform={[
          {translateX: 50},
          {translateY: 290},
          {rotateZ: Math.sin(time * 0.002) * 10},
          {scale: 0.8 + Math.sin(time * 0.003) * 0.2},
        ]}>
        <ConsistentPath
          x={0}
          y={0}
          pathData="M10,10 L50,10 L50,50 L30,50 L30,30 L10,30 Z"
          color="#FF8A65"
          strokeWidth={3}
        />
      </Group>

      <Group
        transform={[
          {translateX: 120},
          {translateY: 290},
          {rotateZ: Math.cos(time * 0.0025) * 15},
          {scale: 0.9 + Math.cos(time * 0.004) * 0.1},
        ]}>
        <ConsistentPath
          x={0}
          y={0}
          pathData="M20,5 L35,20 L20,35 L5,20 Z"
          color="#E91E63"
          strokeWidth={4}
        />
      </Group>
    </SkiaCanvas>
  );
};
