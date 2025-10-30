import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {renderingEngine} from '../engine/RenderingEngine';

/**
 * Platform Information Display Component
 */
export const PlatformInfoDisplay: React.FC = () => {
  const debugInfo = renderingEngine.getDebugInfo();
  const {platformInfo, renderingMetrics, capabilities} = debugInfo;

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.infoTitle}>Platform Information</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Platform:</Text>
        <Text style={styles.infoValue}>{platformInfo.platform}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Fabric Enabled:</Text>
        <Text
          style={[
            styles.infoValue,
            {color: platformInfo.fabricEnabled ? '#4CAF50' : '#F44336'},
          ]}>
          {platformInfo.fabricEnabled ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Pixel Density:</Text>
        <Text style={styles.infoValue}>{platformInfo.pixelDensity}x</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Screen Size:</Text>
        <Text style={styles.infoValue}>
          {platformInfo.screenDimensions.width} ×{' '}
          {platformInfo.screenDimensions.height}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Skia Support:</Text>
        <Text
          style={[
            styles.infoValue,
            {color: capabilities.supportsSkia ? '#4CAF50' : '#F44336'},
          ]}>
          {capabilities.supportsSkia ? 'Yes' : 'No (Web Fallback)'}
        </Text>
      </View>
    </View>
  );
};

/**
 * Consistency Test Component
 */
export const ConsistencyTestComponent: React.FC = () => {
  const testSizes = [10, 20, 30, 40, 50];
  const testColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  return (
    <View style={styles.testContainer}>
      <Text style={styles.testTitle}>Consistency Tests</Text>

      {/* Font Size Consistency */}
      <View style={styles.testSection}>
        <Text style={styles.testSectionTitle}>Font Size Consistency</Text>
        {testSizes.map((size, index) => (
          <Text
            key={index}
            style={[
              styles.testText,
              {fontSize: renderingEngine.getConsistentFontSize(size)},
            ]}>
            Font size {size}px (adjusted:{' '}
            {renderingEngine.getConsistentFontSize(size)}px)
          </Text>
        ))}
      </View>

      {/* Spacing Consistency */}
      <View style={styles.testSection}>
        <Text style={styles.testSectionTitle}>Spacing Consistency</Text>
        {testSizes.map((spacing, index) => (
          <View
            key={index}
            style={[
              styles.spacingBox,
              {
                marginTop: renderingEngine.getConsistentSpacing(spacing),
                backgroundColor: testColors[index],
              },
            ]}>
            <Text style={styles.spacingText}>Margin: {spacing}px</Text>
          </View>
        ))}
      </View>

      {/* Border Radius Consistency */}
      <View style={styles.testSection}>
        <Text style={styles.testSectionTitle}>Border Radius Consistency</Text>
        <View style={styles.radiusContainer}>
          {testSizes.map((radius, index) => (
            <View
              key={index}
              style={[
                styles.radiusBox,
                {
                  borderRadius:
                    renderingEngine.getConsistentBorderRadius(radius),
                  backgroundColor: testColors[index],
                },
              ]}>
              <Text style={styles.radiusText}>{radius}px</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

/**
 * Interactive Animation Demo
 */
export const AnimationDemo: React.FC = () => {
  const [animatedValue] = useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsAnimating(false);
    });
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1],
  });

  return (
    <View style={styles.animationContainer}>
      <Text style={styles.animationTitle}>Cross-Platform Animation</Text>

      <View style={styles.animationStage}>
        <Animated.View
          style={[
            styles.animatedBox,
            {
              transform: [{translateX}, {scale}],
            },
          ]}>
          <Text style={styles.animatedBoxText}>🚀</Text>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.animationButton,
          isAnimating && styles.animationButtonDisabled,
        ]}
        onPress={startAnimation}
        disabled={isAnimating}>
        <Text style={styles.animationButtonText}>
          {isAnimating ? 'Animating...' : 'Start Animation'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Pixel Perfect Grid Demo
 */
export const PixelPerfectGrid: React.FC = () => {
  const gridSize = 20;
  const gridCount = 10;
  const adjustedGridSize = renderingEngine.getConsistentSpacing(gridSize);

  return (
    <View style={styles.gridContainer}>
      <Text style={styles.gridTitle}>Pixel-Perfect Grid</Text>
      <Text style={styles.gridSubtitle}>
        {gridSize}px logical → {adjustedGridSize}px adjusted
      </Text>

      <View style={styles.grid}>
        {Array.from({length: gridCount}).map((_, row) =>
          Array.from({length: gridCount}).map((_, col) => (
            <View
              key={`${row}-${col}`}
              style={[
                styles.gridCell,
                {
                  width: adjustedGridSize,
                  height: adjustedGridSize,
                  backgroundColor:
                    (row + col) % 2 === 0 ? '#E0E0E0' : '#F5F5F5',
                },
              ]}
            />
          )),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  testContainer: {
    padding: 16,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  testSection: {
    marginBottom: 24,
  },
  testSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  testText: {
    color: '#333',
    marginBottom: 4,
  },
  spacingBox: {
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  spacingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  radiusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radiusBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  radiusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  animationContainer: {
    padding: 16,
    alignItems: 'center',
  },
  animationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  animationStage: {
    width: 200,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  animatedBox: {
    width: 50,
    height: 50,
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 25,
  },
  animatedBoxText: {
    fontSize: 20,
  },
  animationButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  animationButtonDisabled: {
    backgroundColor: '#ccc',
  },
  animationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gridContainer: {
    padding: 16,
    alignItems: 'center',
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  gridSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 200,
  },
  gridCell: {
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
});
