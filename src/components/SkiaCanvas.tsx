import React from 'react';
import {View, Platform, Text} from 'react-native';
import {renderingEngine} from '../engine/RenderingEngine';

// Dynamic import for Skia components to handle cases where the module isn't available
let Canvas: any = null;
let Circle: any = null;
let Path: any = null;
let Rect: any = null;
let SkiaText: any = null;
let Skia: any = null;
let Group: any = null;

try {
  if (Platform.OS !== 'web') {
    const SkiaComponents = require('@shopify/react-native-skia');
    Canvas = SkiaComponents.Canvas;
    Circle = SkiaComponents.Circle;
    Path = SkiaComponents.Path;
    Rect = SkiaComponents.Rect;
    SkiaText = SkiaComponents.Text;
    Skia = SkiaComponents.Skia;
    Group = SkiaComponents.Group;
  }
} catch (error) {
  console.warn('React Native Skia not available:', error);
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
 * Demo component showcasing various Skia shapes
 */
export const SkiaShapesDemo: React.FC<{width: number; height: number}> = ({
  width,
  height,
}) => {
  return (
    <SkiaCanvas width={width} height={height}>
      {/* Background */}
      <ConsistentRect
        x={0}
        y={0}
        width={width}
        height={height}
        color="#ffffff"
      />

      {/* Circles */}
      <ConsistentCircle x={50} y={50} size={40} color="#FF6B6B" />
      <ConsistentCircle x={150} y={50} size={40} color="#4ECDC4" />
      <ConsistentCircle x={250} y={50} size={40} color="#45B7D1" />

      {/* Rectangles */}
      <ConsistentRect x={30} y={120} width={60} height={40} color="#96CEB4" />
      <ConsistentRect x={130} y={120} width={60} height={40} color="#FFEAA7" />
      <ConsistentRect x={230} y={120} width={60} height={40} color="#DDA0DD" />

      {/* Text */}
      <ConsistentSkiaText
        x={20}
        y={200}
        text="Pixel-Perfect Rendering"
        fontSize={16}
        color="#333333"
      />
      <ConsistentSkiaText
        x={20}
        y={230}
        text="Fabric + Skia Integration"
        fontSize={14}
        color="#666666"
      />

      {/* Complex shape using Path */}
      <ConsistentPath
        x={20}
        y={250}
        pathData="M10,10 L50,10 L50,50 L30,50 L30,30 L10,30 Z"
        color="#FF8A65"
        strokeWidth={3}
      />
      <ConsistentPath
        x={20}
        y={250}
        pathData="M10,10 L50,10 L50,50 L30,50 L30,30 L10,30 Z"
        color="#FF8A65"
        strokeWidth={3}
      />
    </SkiaCanvas>
  );
};
