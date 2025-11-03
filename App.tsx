/**
 * Cross-Platform Rendering Consistency Engine Demo
 * Showcasing React Native Fabric and Skia integration
 * for pixel-perfect UI rendering across platforms
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';

import {renderingEngine} from './src/engine/RenderingEngine';
import WebGLCanvas from './src/components/WebGLCanvas';
import {
  PlatformInfoDisplay,
  ConsistencyTestComponent,
  AnimationDemo,
  PixelPerfectGrid,
} from './src/components/DemoComponents';

type DemoSection = 'platform' | 'skia' | 'consistency' | 'animation' | 'grid';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeSection, setActiveSection] = useState<DemoSection>('platform');
  const [fabricStatus, setFabricStatus] = useState<boolean>(false);
  const [platformDetails, setPlatformDetails] = useState<any>(null);

  // Check Fabric status and platform details
  useEffect(() => {
    const checkFabricStatus = () => {
      const isFabricEnabled = (global as any)?.nativeFabricUIManager != null;
      console.log('Fabric Status:', isFabricEnabled ? '✅ ON' : '❌ OFF');
      setFabricStatus(isFabricEnabled);

      // Get platform info
      const platformInfo = renderingEngine.getPlatformInfo();
      setPlatformDetails(platformInfo);

      console.log('Platform Details:', {
        platform: Platform.OS,
        version: Platform.Version,
        fabric: isFabricEnabled,
        pixelDensity: platformInfo.pixelDensity,
        isWeb: platformInfo.isWeb,
      });
    };

    checkFabricStatus();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    flex: 1,
  };

  const sections = [
    {key: 'platform' as DemoSection, title: 'Platform Info', icon: '📱'},
    {key: 'skia' as DemoSection, title: 'Skia Rendering', icon: '🎨'},
    {key: 'consistency' as DemoSection, title: 'Consistency', icon: '📐'},
    {key: 'animation' as DemoSection, title: 'Animation', icon: '🚀'},
    {key: 'grid' as DemoSection, title: 'Pixel Grid', icon: '🔲'},
  ];

  const renderSection = () => {
    if (!platformDetails) {
      return (
        <View style={styles.loadingContainer}>
          <Text
            style={[styles.loadingText, {color: isDarkMode ? '#fff' : '#333'}]}>
            Loading platform information...
          </Text>
        </View>
      );
    }

    switch (activeSection) {
      case 'platform':
        return <PlatformInfoDisplay />;
      case 'skia':
        return (
          <View style={styles.skiaContainer}>
            <Text
              style={[
                styles.sectionTitle,
                {color: isDarkMode ? '#fff' : '#333'},
              ]}>
              Skia Graphics Rendering
            </Text>
            <View style={styles.fabricStatusContainer}>
              <Text
                style={[
                  styles.fabricStatus,
                  {color: fabricStatus ? '#4CAF50' : '#FF5722'},
                ]}>
                Fabric: {fabricStatus ? '✅ ENABLED' : '❌ DISABLED'}
              </Text>
              <Text
                style={[
                  styles.fabricStatus,
                  {color: isDarkMode ? '#ccc' : '#666'},
                ]}>
                Platform: {Platform.OS.toUpperCase()} {Platform.Version}
              </Text>
            </View>
            <WebGLCanvas />
            <Text
              style={[
                styles.sectionDescription,
                {color: isDarkMode ? '#ccc' : '#666'},
              ]}>
              {platformDetails.isWeb
                ? 'Web fallback shown. Skia rendering available on Android.'
                : fabricStatus
                ? 'Pixel-perfect Skia rendering with Fabric integration.'
                : 'Skia rendering with legacy bridge. Enable Fabric for optimal performance.'}
            </Text>
          </View>
        );
      case 'consistency':
        return <ConsistencyTestComponent />;
      case 'animation':
        return <AnimationDemo />;
      case 'grid':
        return <PixelPerfectGrid />;
      default:
        return <PlatformInfoDisplay />;
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa'},
        ]}>
        <Text
          style={[styles.headerTitle, {color: isDarkMode ? '#fff' : '#333'}]}>
          Cross-Platform Rendering Engine
        </Text>
        <View style={styles.headerInfo}>
          <Text
            style={[
              styles.headerSubtitle,
              {color: isDarkMode ? '#ccc' : '#666'},
            ]}>
            {Platform.OS.toUpperCase()} • Fabric: {fabricStatus ? 'ON' : 'OFF'}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {color: isDarkMode ? '#ccc' : '#666'},
            ]}>
            Pixel Density: {platformDetails?.pixelDensity || '1.0'}x
          </Text>
        </View>
        {/* Real-time Fabric Status Indicator */}
        <View style={styles.statusIndicator}>
          <View
            style={[
              styles.statusDot,
              {backgroundColor: fabricStatus ? '#4CAF50' : '#FF5722'},
            ]}
          />
          <Text
            style={[styles.statusText, {color: isDarkMode ? '#ccc' : '#666'}]}>
            {fabricStatus ? 'New Architecture' : 'Legacy Bridge'}
          </Text>
        </View>
      </View>

      {/* Navigation Tabs */}
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: isDarkMode ? '#333' : '#fff',
            borderBottomColor: isDarkMode ? '#555' : '#e0e0e0',
          },
        ]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sections.map(section => (
            <TouchableOpacity
              key={section.key}
              style={[
                styles.tab,
                activeSection === section.key && styles.activeTab,
                activeSection === section.key && {
                  backgroundColor: isDarkMode ? '#007AFF' : '#007AFF',
                },
              ]}
              onPress={() => setActiveSection(section.key)}>
              <Text style={styles.tabIcon}>{section.icon}</Text>
              <Text
                style={[
                  styles.tabText,
                  activeSection === section.key && styles.activeTabText,
                  {
                    color:
                      activeSection === section.key
                        ? '#fff'
                        : isDarkMode
                        ? '#ccc'
                        : '#666',
                  },
                ]}>
                {section.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={backgroundStyle}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        {renderSection()}

        {/* Footer Info */}
        <View
          style={[
            styles.footer,
            {backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa'},
          ]}>
          <Text
            style={[styles.footerText, {color: isDarkMode ? '#ccc' : '#666'}]}>
            React Native {Platform.Version} • Fabric + Skia Integration
          </Text>
          <Text
            style={[styles.footerText, {color: isDarkMode ? '#ccc' : '#666'}]}>
            Pixel-Perfect Cross-Platform Rendering
          </Text>
          <Text
            style={[
              styles.footerText,
              {color: fabricStatus ? '#4CAF50' : '#FF5722'},
            ]}>
            Architecture: {fabricStatus ? 'New (Fabric)' : 'Legacy (Bridge)'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  skiaContainer: {
    padding: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fabricStatusContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  fabricStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default App;
