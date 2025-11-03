/**
 * Cross-Platform Rendering Consistency Engine Demo - Web Version
 * Showcasing React Native Web with fallback components
 * for pixel-perfect UI rendering across platforms
 */

import React, {useState} from 'react';
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
import {
  PlatformInfoDisplay,
  ConsistencyTestComponent,
  AnimationDemo,
  PixelPerfectGrid,
} from './src/components/DemoComponents';
import WebGLCanvas from './src/components/WebGLCanvas.web';

// Web-specific Skia fallback component
const WebSkiaFallback: React.FC<{width: number; height: number}> = ({
  width,
  height,
}) => {
  return (
    <View
      style={{
        width,
        height,
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
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 12,
            color: '#333',
          }}>
          Cross-Platform Rendering Demo
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
            marginBottom: 16,
          }}>
          Web Implementation with React Native Web
        </Text>

        {/* Simple web-based graphics demonstration */}
        <View style={styles.webGraphicsContainer}>
          <View style={[styles.webShape, {backgroundColor: '#FF6B6B'}]} />
          <View style={[styles.webShape, {backgroundColor: '#4ECDC4'}]} />
          <View style={[styles.webShape, {backgroundColor: '#45B7D1'}]} />
        </View>

        <Text
          style={{
            fontSize: 12,
            color: '#999',
            textAlign: 'center',
            marginTop: 12,
          }}>
          Skia rendering available on Android
        </Text>
      </View>
    </View>
  );
};

type DemoSection = 'platform' | 'skia' | 'consistency' | 'animation' | 'grid';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [activeSection, setActiveSection] = useState<DemoSection>('platform');

  const platformInfo = renderingEngine.getPlatformInfo();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    flex: 1,
  };

  const sections = [
    {key: 'platform' as DemoSection, title: 'Platform Info', icon: '📱'},
    {key: 'skia' as DemoSection, title: 'WebGL Demo', icon: '�'},
    {key: 'consistency' as DemoSection, title: 'Consistency', icon: '📐'},
    {key: 'animation' as DemoSection, title: 'Animation', icon: '🚀'},
    {key: 'grid' as DemoSection, title: 'Pixel Grid', icon: '🔲'},
  ];

  const renderSection = () => {
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
              WebGL Graphics Engine
            </Text>
            <WebGLCanvas />
            <Text
              style={[
                styles.sectionDescription,
                {color: isDarkMode ? '#ccc' : '#666'},
              ]}>
              Hardware-accelerated WebGL rendering with real-time animations and
              pixel-perfect graphics for web platforms.
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
            {platformInfo.platform.toUpperCase()} • Fabric:{' '}
            {platformInfo.fabricEnabled ? 'ON' : 'OFF'}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {color: isDarkMode ? '#ccc' : '#666'},
            ]}>
            Pixel Density: {platformInfo.pixelDensity}x
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
            React Native {Platform.Version} •{' '}
            {platformInfo.isWeb ? 'Web' : 'Native'} Implementation
          </Text>
          <Text
            style={[styles.footerText, {color: isDarkMode ? '#ccc' : '#666'}]}>
            Cross-Platform Rendering Consistency Engine
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
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
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
  sectionDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  webGraphicsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  webShape: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
