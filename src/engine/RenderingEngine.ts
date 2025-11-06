import {Platform, Dimensions, PixelRatio} from 'react-native';

export interface PlatformInfo {
  platform: string;
  isWeb: boolean;
  isAndroid: boolean;
  isIOS: boolean;
  fabricEnabled: boolean;
  pixelDensity: number;
  screenDimensions: {
    width: number;
    height: number;
    scaledWidth: number;
    scaledHeight: number;
  };
}

export interface RenderingMetrics {
  devicePixelRatio: number;
  fontScale: number;
  screenScale: number;
  absolutePixels: {
    width: number;
    height: number;
  };
}

/**
 * Cross-Platform Rendering Consistency Engine
 * Ensures pixel-perfect UI rendering across iOS, Android, and Web
 * using React Native Fabric and Skia
 */
export class RenderingEngine {
  private static instance: RenderingEngine;
  private platformInfo: PlatformInfo;
  private renderingMetrics: RenderingMetrics;

  private constructor() {
    this.platformInfo = this.detectPlatformInfo();
    this.renderingMetrics = this.calculateRenderingMetrics();
  }

  public static getInstance(): RenderingEngine {
    if (!RenderingEngine.instance) {
      RenderingEngine.instance = new RenderingEngine();
    }
    return RenderingEngine.instance;
  }

  private detectPlatformInfo(): PlatformInfo {
    const dimensions = Dimensions.get('screen');
    const pixelDensity = PixelRatio.get();

    return {
      platform: Platform.OS,
      isWeb: Platform.OS === 'web',
      isAndroid: Platform.OS === 'android',
      isIOS: Platform.OS === 'ios',
      fabricEnabled: this.isFabricEnabled(),
      pixelDensity,
      screenDimensions: {
        width: dimensions.width,
        height: dimensions.height,
        scaledWidth: dimensions.width * pixelDensity,
        scaledHeight: dimensions.height * pixelDensity,
      },
    };
  }

  private isFabricEnabled(): boolean {
    // Check if Fabric is enabled
    // In RN 0.68+, this can be detected through various methods
    if (Platform.OS === 'web') return false;

    // For Android, check if new architecture is enabled
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      try {
        // This is a common way to detect Fabric on Android
        return (global as any)?.nativeFabricUIManager != null;
      } catch {
        return false;
      }
    }

    return false;
  }

  private calculateRenderingMetrics(): RenderingMetrics {
    const pixelRatio = PixelRatio.get();
    const fontScale = PixelRatio.getFontScale();
    const dimensions = Dimensions.get('screen');

    return {
      devicePixelRatio: pixelRatio,
      fontScale,
      screenScale: pixelRatio,
      absolutePixels: {
        width: dimensions.width * pixelRatio,
        height: dimensions.height * pixelRatio,
      },
    };
  }

  /**
   * Get platform information
   */
  public getPlatformInfo(): PlatformInfo {
    return {...this.platformInfo};
  }

  /**
   * Get rendering metrics
   */
  public getRenderingMetrics(): RenderingMetrics {
    return {...this.renderingMetrics};
  }

  /**
   * Convert logical pixels to physical pixels
   */
  public logicalToPhysicalPixels(logicalValue: number): number {
    return logicalValue * this.renderingMetrics.devicePixelRatio;
  }

  /**
   * Convert physical pixels to logical pixels
   */
  public physicalToLogicalPixels(physicalValue: number): number {
    return physicalValue / this.renderingMetrics.devicePixelRatio;
  }

  /**
   * Get consistent font size across platforms
   */
  public getConsistentFontSize(baseFontSize: number): number {
    const {platform} = this.platformInfo;
    const {fontScale} = this.renderingMetrics;

    // Apply platform-specific adjustments for consistency
    let adjustedSize = baseFontSize;

    if (platform === 'web') {
      // Web typically needs slight adjustment for consistency
      adjustedSize = baseFontSize * 1.0;
    } else if (platform === 'android') {
      // Android with Fabric might need density adjustments
      adjustedSize = baseFontSize * (1 / fontScale);
    }

    return Math.round(adjustedSize);
  }

  /**
   * Get consistent spacing values across platforms
   */
  public getConsistentSpacing(baseSpacing: number): number {
    const {pixelDensity} = this.platformInfo;

    // Ensure spacing is pixel-perfect by rounding to nearest pixel
    return Math.round(baseSpacing * pixelDensity) / pixelDensity;
  }

  /**
   * Get consistent border radius across platforms
   */
  public getConsistentBorderRadius(baseBorderRadius: number): number {
    return this.getConsistentSpacing(baseBorderRadius);
  }

  /**
   * Calculate consistent dimensions for cross-platform components
   */
  public getConsistentDimensions(
    width: number,
    height: number,
  ): {
    width: number;
    height: number;
  } {
    return {
      width: this.getConsistentSpacing(width),
      height: this.getConsistentSpacing(height),
    };
  }

  /**
   * Get platform-specific rendering capabilities
   */
  public getRenderingCapabilities(): {
    supportsSkia: boolean;
    supportsFabric: boolean;
    supportsNativeAnimations: boolean;
    supportsHardwareAcceleration: boolean;
  } {
    const {isWeb, isAndroid, fabricEnabled} = this.platformInfo;

    return {
      supportsSkia: !isWeb, // Skia works on native platforms
      supportsFabric: fabricEnabled,
      supportsNativeAnimations: !isWeb,
      supportsHardwareAcceleration: !isWeb,
    };
  }

  /**
   * Refresh platform info and metrics (useful for orientation changes)
   */
  public refresh(): void {
    this.platformInfo = this.detectPlatformInfo();
    this.renderingMetrics = this.calculateRenderingMetrics();
  }

  /**
   * Get debug information for development
   */
  public getDebugInfo(): {
    platformInfo: PlatformInfo;
    renderingMetrics: RenderingMetrics;
    capabilities: {
      supportsSkia: boolean;
      supportsFabric: boolean;
      supportsNativeAnimations: boolean;
      supportsHardwareAcceleration: boolean;
    };
  } {
    return {
      platformInfo: this.getPlatformInfo(),
      renderingMetrics: this.getRenderingMetrics(),
      capabilities: this.getRenderingCapabilities(),
    };
  }
}

// Export singleton instance
export const renderingEngine = RenderingEngine.getInstance();
