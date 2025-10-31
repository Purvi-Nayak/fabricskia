import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  useColorScheme,
} from 'react-native';
import {renderingEngine} from '../engine/RenderingEngine';

/**
 * Platform Information Display Component
 */
export const PlatformInfoDisplay: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const debugInfo = renderingEngine.getDebugInfo();
  const {platformInfo, renderingMetrics, capabilities} = debugInfo;

  return (
    <View
      style={[
        styles.infoContainer,
        {backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa'},
      ]}>
      <Text style={[styles.infoTitle, {color: isDarkMode ? '#fff' : '#333'}]}>
        Platform Information
      </Text>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, {color: isDarkMode ? '#ccc' : '#666'}]}>
          Platform:
        </Text>
        <Text style={[styles.infoValue, {color: isDarkMode ? '#fff' : '#333'}]}>
          {platformInfo.platform}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, {color: isDarkMode ? '#ccc' : '#666'}]}>
          Fabric Enabled:
        </Text>
        <Text
          style={[
            styles.infoValue,
            {color: platformInfo.fabricEnabled ? '#4CAF50' : '#F44336'},
          ]}>
          {platformInfo.fabricEnabled ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, {color: isDarkMode ? '#ccc' : '#666'}]}>
          Pixel Density:
        </Text>
        <Text style={[styles.infoValue, {color: isDarkMode ? '#fff' : '#333'}]}>
          {platformInfo.pixelDensity}x
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, {color: isDarkMode ? '#ccc' : '#666'}]}>
          Screen Size:
        </Text>
        <Text style={[styles.infoValue, {color: isDarkMode ? '#fff' : '#333'}]}>
          {platformInfo.screenDimensions.width} ×{' '}
          {platformInfo.screenDimensions.height}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, {color: isDarkMode ? '#ccc' : '#666'}]}>
          Skia Support:
        </Text>
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
  const isDarkMode = useColorScheme() === 'dark';
  const testSizes = [10, 20, 30, 40, 50];
  const testColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  return (
    <View
      style={[
        styles.testContainer,
        {backgroundColor: isDarkMode ? '#1a1a1a' : '#fff'},
      ]}>
      <Text style={[styles.testTitle, {color: isDarkMode ? '#fff' : '#333'}]}>
        Consistency Tests
      </Text>

      {/* Font Size Consistency */}

      {/* Spacing Consistency */}
      <View style={styles.testSection}>
        <Text
          style={[
            styles.testSectionTitle,
            {color: isDarkMode ? '#ccc' : '#555'},
          ]}>
          Spacing Consistency
        </Text>
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
        <Text
          style={[
            styles.testSectionTitle,
            {color: isDarkMode ? '#ccc' : '#555'},
          ]}>
          Border Radius Consistency
        </Text>
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
  const isDarkMode = useColorScheme() === 'dark';
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
    <View
      style={[
        styles.animationContainer,
        {backgroundColor: isDarkMode ? '#1a1a1a' : '#fff'},
      ]}>
      <Text
        style={[styles.animationTitle, {color: isDarkMode ? '#fff' : '#333'}]}>
        Cross-Platform Animation
      </Text>

      <View
        style={[
          styles.animationStage,
          {backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0'},
        ]}>
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
  const isDarkMode = useColorScheme() === 'dark';
  const gridSize = 20;
  const gridCount = 10;
  const adjustedGridSize = renderingEngine.getConsistentSpacing(gridSize);

  return (
    <View
      style={[
        styles.gridContainer,
        {backgroundColor: isDarkMode ? '#1a1a1a' : '#fff'},
      ]}>
      <Text style={[styles.gridTitle, {color: isDarkMode ? '#fff' : '#333'}]}>
        Pixel-Perfect Grid
      </Text>
      <Text
        style={[styles.gridSubtitle, {color: isDarkMode ? '#ccc' : '#666'}]}>
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
                    (row + col) % 2 === 0
                      ? isDarkMode
                        ? '#404040'
                        : '#E0E0E0'
                      : isDarkMode
                      ? '#555555'
                      : '#F5F5F5',
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
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  testContainer: {
    padding: 16,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  testSection: {
    marginBottom: 24,
  },
  testSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  testText: {
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
  },
  animationStage: {
    width: 200,
    height: 100,
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
  },
  gridSubtitle: {
    fontSize: 12,
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
