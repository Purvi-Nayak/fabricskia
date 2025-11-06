import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {renderingEngine} from '../engine/RenderingEngine';

interface WebGLCanvasProps {
  width?: number;
  height?: number;
}

/**
 * WebGL Canvas Component - Web Platform
 * Hardware-accelerated graphics rendering for web using WebGL/Canvas
 */
export const WebGLCanvas: React.FC<WebGLCanvasProps> = ({
  width = 420,
  height = 400,
}) => {
  const canvasRef = useRef<any>(null);
  const animationRef = useRef<number>();
  const [renderingMode, setRenderingMode] = useState<
    'webgl' | 'canvas2d' | 'loading'
  >('loading');
  const [fps, setFps] = useState(0);

  // Get pixel-perfect dimensions
  const adjustedDimensions = renderingEngine.getConsistentDimensions(
    width,
    height,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try WebGL first, then Canvas 2D
    let context: any = null;

    try {
      context =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (context) {
        setRenderingMode('webgl');
        initWebGLRendering(context, canvas);
        return;
      }
    } catch (e) {
      console.log('WebGL not available, trying Canvas 2D');
    }

    try {
      context = canvas.getContext('2d');
      if (context) {
        setRenderingMode('canvas2d');
        initCanvas2DRendering(context, canvas);
        return;
      }
    } catch (e) {
      console.error('No rendering context available');
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [adjustedDimensions.width, adjustedDimensions.height]);

  const initWebGLRendering = (gl: any, canvas: any) => {
    // Set canvas dimensions
    canvas.width = adjustedDimensions.width;
    canvas.height = adjustedDimensions.height;
    gl.viewport(0, 0, adjustedDimensions.width, adjustedDimensions.height);

    // Enhanced vertex shader with 3D transformations
    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_color;
      
      varying vec3 v_color;
      
      uniform mat4 u_matrix;
      uniform float u_time;
      
      void main() {
        gl_Position = u_matrix * vec4(a_position, 1.0);
        v_color = a_color;
      }
    `;

    // Enhanced fragment shader with lighting and gradients
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec3 v_color;
      uniform float u_time;
      
      void main() {
        // Create pulsing effect
        float pulse = sin(u_time * 0.004) * 0.3 + 0.7;
        vec3 finalColor = v_color * pulse;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Get locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    // Create simple 3D triangle
    const positions = [
      // Triangle 1 (red) - larger and centered
      0.0, 0.6, 0.0, -0.6, -0.6, 0.0, 0.6, -0.6, 0.0,

      // Triangle 2 (green) - offset
      0.3, 0.8, 0.0, -0.1, 0.0, 0.0, 0.7, 0.0, 0.0,

      // Triangle 3 (blue) - another position
      -0.5, 0.4, 0.0, -0.9, -0.4, 0.0, -0.1, -0.4, 0.0,
    ];

    const colors = [
      // Triangle 1 - Bright Red
      1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

      // Triangle 2 - Bright Green
      0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

      // Triangle 3 - Bright Blue
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    ]; // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Matrix utilities
    const createMatrix = () => {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };

    const multiply = (a: number[], b: number[]) => {
      const result = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) {
            sum += a[i * 4 + k] * b[k * 4 + j];
          }
          result[i * 4 + j] = sum;
        }
      }
      return result;
    };

    const perspective = (
      fov: number,
      aspect: number,
      near: number,
      far: number,
    ) => {
      const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
      const rangeInv = 1.0 / (near - far);
      return [
        f / aspect,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        (near + far) * rangeInv,
        -1,
        0,
        0,
        near * far * rangeInv * 2,
        0,
      ];
    };

    const translate = (tx: number, ty: number, tz: number) => {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
    };

    const rotateX = (angle: number) => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
    };

    const rotateY = (angle: number) => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
    };

    // Enable depth testing for 3D
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frameCount = 0;
    let lastFpsTime = 0;

    const render = (time: number) => {
      // FPS calculation
      frameCount++;
      if (time - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = time;
      }

      // Clear with lighter background
      gl.clearColor(0.2, 0.2, 0.3, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);

      // Create simple identity matrix for now
      let matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

      // Add simple rotation over time
      const rotation = time * 0.001;
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      matrix = [cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

      // Set uniforms
      gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.uniform1f(timeLocation, time);

      // Bind position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

      // Bind color buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.enableVertexAttribArray(colorLocation);
      gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

      // Draw all geometry
      gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
  };

  const initCanvas2DRendering = (ctx: any, canvas: any) => {
    canvas.width = adjustedDimensions.width;
    canvas.height = adjustedDimensions.height;

    let frameCount = 0;
    let lastFpsTime = 0;

    const render = (time: number) => {
      frameCount++;
      if (time - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = time;
      }

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        adjustedDimensions.width,
        adjustedDimensions.height,
      );
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(1, '#1a1a2e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, adjustedDimensions.width, adjustedDimensions.height);

      const centerX = adjustedDimensions.width / 2;
      const centerY = adjustedDimensions.height / 2;

      // Animation values
      const time1 = time * 0.001;
      const time2 = time * 0.0015;
      const pulse = Math.sin(time * 0.003) * 0.3 + 0.7;

      ctx.save();

      // Draw rotating geometric shapes with 3D effect
      for (let i = 0; i < 3; i++) {
        ctx.save();

        const angle = time1 + (i * Math.PI * 2) / 3;
        const radius = 60 + Math.sin(time2 + i) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Create 3D shadow effect
        const shadowOffset = 8;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(x + shadowOffset, y + shadowOffset, 25 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Create radial gradient for 3D sphere effect
        const sphereGradient = ctx.createRadialGradient(
          x - 10,
          y - 10,
          5,
          x,
          y,
          25,
        );
        const colors = [
          ['#ff6b6b', '#ff5252'],
          ['#4ecdc4', '#26a69a'],
          ['#45b7d1', '#2196f3'],
        ];

        sphereGradient.addColorStop(0, colors[i][0]);
        sphereGradient.addColorStop(1, colors[i][1]);
        ctx.fillStyle = sphereGradient;

        // Draw main sphere
        ctx.beginPath();
        ctx.arc(x, y, 25 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Add highlight for 3D effect
        const highlightGradient = ctx.createRadialGradient(
          x - 8,
          y - 8,
          0,
          x - 8,
          y - 8,
          15,
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(x, y, 25 * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Draw rotating cube wireframe in center
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time1);

      const size = 40;
      ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
      ctx.lineWidth = 2;

      // Front face
      ctx.strokeRect(-size / 2, -size / 2, size, size);

      // Back face (simulated 3D)
      const offset = 15;
      ctx.strokeRect(-size / 2 + offset, -size / 2 - offset, size, size);

      // Connect corners for 3D effect
      ctx.beginPath();
      ctx.moveTo(-size / 2, -size / 2);
      ctx.lineTo(-size / 2 + offset, -size / 2 - offset);
      ctx.moveTo(size / 2, -size / 2);
      ctx.lineTo(size / 2 + offset, -size / 2 - offset);
      ctx.moveTo(-size / 2, size / 2);
      ctx.lineTo(-size / 2 + offset, size / 2 - offset);
      ctx.moveTo(size / 2, size / 2);
      ctx.lineTo(size / 2 + offset, size / 2 - offset);
      ctx.stroke();

      ctx.restore();

      // Draw floating particles
      for (let i = 0; i < 20; i++) {
        const particleX =
          (Math.sin(time * 0.002 + i) * adjustedDimensions.width) / 2 + centerX;
        const particleY =
          (Math.cos(time * 0.0015 + i * 0.5) * adjustedDimensions.height) / 2 +
          centerY;
        const size = Math.sin(time * 0.004 + i) * 2 + 3;

        ctx.fillStyle = `rgba(100, 200, 255, ${
          Math.sin(time * 0.003 + i) * 0.5 + 0.5
        })`;
        ctx.beginPath();
        ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Add performance indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px monospace';
      ctx.fillText(
        `Canvas 2D • ${fps} FPS`,
        10,
        adjustedDimensions.height - 10,
      );

      // Border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        0.5,
        0.5,
        adjustedDimensions.width - 1,
        adjustedDimensions.height - 1,
      );

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);
  };

  const createShader = (gl: any, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const createProgram = (gl: any, vertexShader: any, fragmentShader: any) => {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌐 WebGL Graphics Engine</Text>
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.status,
              {
                color:
                  renderingMode === 'webgl'
                    ? '#4CAF50'
                    : renderingMode === 'canvas2d'
                    ? '#FF9800'
                    : '#666',
              },
            ]}>
            {renderingMode === 'webgl'
              ? '✅ WebGL'
              : renderingMode === 'canvas2d'
              ? '🟡 Canvas 2D'
              : '⏳ Loading...'}
          </Text>
          <Text style={styles.fps}>{fps} FPS</Text>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          style={{
            width: adjustedDimensions.width,
            height: adjustedDimensions.height,
            border: '1px solid #ddd',
            borderRadius: 8,
            background: '#f7f7f9',
            display: 'block',
          }}
        />
      </View>

      <View style={styles.info}>
        {/* <Text style={styles.infoTitle}>🚀 Web Rendering Engine</Text> */}
        <Text style={styles.infoText}>
          {renderingMode === 'webgl'
            ? 'Hardware-accelerated WebGL with shaders and real-time animations'
            : renderingMode === 'canvas2d'
            ? 'Canvas 2D rendering with smooth animations and pixel-perfect calculations'
            : 'Initializing graphics engine...'}
        </Text>
        <Text style={styles.infoSubtext}>
          Dimensions: {adjustedDimensions.width}×{adjustedDimensions.height}px •
          Performance: {fps} FPS
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: renderingEngine.getConsistentSpacing(16),
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: renderingEngine.getConsistentSpacing(12),
  },
  title: {
    fontSize: renderingEngine.getConsistentFontSize(16),
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: renderingEngine.getConsistentSpacing(8),
  },
  status: {
    fontSize: renderingEngine.getConsistentFontSize(14),
    fontWeight: '600',
  },
  fps: {
    fontSize: renderingEngine.getConsistentFontSize(12),
    color: '#666',
    fontFamily: 'monospace',
    minWidth: 50,
    textAlign: 'right',
  },
  canvasContainer: {
    marginBottom: renderingEngine.getConsistentSpacing(16),
    borderRadius: renderingEngine.getConsistentBorderRadius(8),
    overflow: 'hidden',
  },
  info: {
    alignItems: 'center',
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
    marginBottom: renderingEngine.getConsistentSpacing(2),
  },
  infoSubtext: {
    fontSize: renderingEngine.getConsistentFontSize(11),
    color: '#999',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default WebGLCanvas;
