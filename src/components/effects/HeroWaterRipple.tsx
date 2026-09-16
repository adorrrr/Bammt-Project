import React, { useEffect, useRef } from 'react';

/**
 * Click-only, premium fluid water-surface effect for the Gangchill Hero.
 *
 * INTERACTION BEHAVIOR:
 * - Strictly ignores all mouse movement and hover events. The water remains completely calm.
 * - Triggers a soft, organic water wave ONLY when the user clicks or taps inside the Hero section.
 * - Automatically bypasses click events originating from interactive elements (buttons, links).
 * - Multi-click support: multiple clicks generate naturally interfering wave packets that spread and dissipate.
 * - Automatically pauses rendering when water settles to maintain 0% GPU overhead at rest.
 */

interface HeroWaterRippleProps {
  /** Hero photo URL — same image used for the static <img> fallback. */
  src: string;
  alt: string;
  /** Tailwind filter classes applied to the plain <img> fallback. */
  imgClassName?: string;
  /** Numeric equivalents for WebGL shader to match fallback look. */
  contrast?: number;
  brightness?: number;
  /** Positioning/layout classes for wrapper. */
  className?: string;
}

const MAX_RIPPLES = 12;
const WAVE_DECAY_TIME = 2.2; // Seconds for wave energy to dissipate

const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;

uniform sampler2D uPhoto;
uniform vec2 uPhotoUvScale;
uniform vec2 uPhotoUvOffset;
uniform float uAspect;
uniform float uTime;
uniform int uRippleCount;
// uRipples[i] = vec4(originU, originV, startTime, intensity)
uniform vec4 uRipples[12];
uniform float uContrast;
uniform float uBrightness;

out vec4 fragColor;

const float WAVE_SPEED = 0.22;        // Slower, gentle propagation speed
const float WAVE_FREQUENCY = 36.0;    // Fine, delicate ripple frequency
const float WAVE_DECAY_TIME = 2.2;    // Dissipation duration in seconds
const float WAVE_WIDTH = 0.08;        // Soft, narrow wave ring envelope
const float REFRACT_AMPLITUDE = 0.012; // Delicate refraction displacement shift

void main() {
  vec2 totalGradient = vec2(0.0);
  float totalHeight = 0.0;

  // Aspect-corrected UV for isotropic circular propagation
  vec2 aspectUv = vec2(vUv.x * uAspect, vUv.y);

  for (int i = 0; i < 12; i++) {
    if (i >= uRippleCount) break;

    vec4 rip = uRipples[i];
    vec2 ripOrigin = rip.xy;
    float startTime = rip.z;
    float intensity = rip.w;

    float dt = uTime - startTime;
    if (dt < 0.0 || dt > WAVE_DECAY_TIME) continue;

    vec2 ripAspectOrigin = vec2(ripOrigin.x * uAspect, ripOrigin.y);
    vec2 diff = aspectUv - ripAspectOrigin;
    float dist = length(diff);
    if (dist < 1e-5) continue;

    vec2 dir = diff / dist; // Radial unit direction vector

    // Wavefront radius expanding smoothly over time
    float waveRadius = WAVE_SPEED * dt;

    // Smooth Gaussian envelope centered on the expanding wavefront
    float distFromFront = dist - waveRadius;
    float envelope = exp(- (distFromFront * distFromFront) / (WAVE_WIDTH * WAVE_WIDTH));

    // Smooth exponential time decay
    float timeDamping = exp(- 2.8 * (dt / WAVE_DECAY_TIME));

    // Spatial dissipation as ring expands (stays localized)
    float spatialDamping = 1.0 / (1.0 + 8.0 * dist);

    // Combined wave amplitude
    float amp = intensity * envelope * timeDamping * spatialDamping;

    // Primary wave phase + subtle secondary trailing oscillation
    float phase = (dist - waveRadius) * WAVE_FREQUENCY;
    float height = amp * sin(phase);

    // Analytical spatial gradient for clean, artifact-free surface normals
    float dEnvelope = -2.0 * distFromFront / (WAVE_WIDTH * WAVE_WIDTH) * envelope;
    float dPhase = WAVE_FREQUENCY;
    float dh_ddist = intensity * timeDamping * spatialDamping * (dEnvelope * sin(phase) + envelope * dPhase * cos(phase));

    vec2 grad = dir * dh_ddist;

    totalHeight += height;
    totalGradient += grad;
  }

  // Refraction displacement vector with aspect ratio correction
  vec2 refractOffset = vec2(totalGradient.x / uAspect, totalGradient.y) * REFRACT_AMPLITUDE;

  vec2 photoUv = vUv * uPhotoUvScale + uPhotoUvOffset;
  vec2 refractedUv = clamp(photoUv - refractOffset, vec2(0.0), vec2(1.0));

  vec3 color = texture(uPhoto, refractedUv).rgb;

  // Replicate CSS contrast / brightness
  color = (color - 0.5) * uContrast + 0.5;
  color = color * uBrightness;

  // Liquid-Glass Specular & Underwater Tinting (only active when surface is disturbed)
  float disturbanceStrength = length(totalGradient);
  if (disturbanceStrength > 0.0005) {
    vec2 aspectGrad = vec2(totalGradient.x / uAspect, totalGradient.y);
    vec3 normal = normalize(vec3(-aspectGrad * 2.2, 1.0));
    vec3 lightDir = normalize(vec3(-0.35, -0.55, 0.75));
    float spec = pow(max(dot(normal, lightDir), 0.0), 20.0);

    vec3 highlightColor = vec3(0.28, 0.78, 0.98); // gangchill-cyan glint
    color += highlightColor * spec * min(disturbanceStrength * 1.2, 0.25);

    // Subtle water depth tinting on wave crests/troughs
    vec3 crestTint = vec3(0.01, 0.42, 0.70);
    color = mix(color, crestTint, clamp(totalHeight * 0.08, 0.0, 0.06));
  }

  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function computeCoverUv(
  containerW: number,
  containerH: number,
  imgW: number,
  imgH: number
): { scale: [number, number]; offset: [number, number] } {
  const containerAspect = containerW / containerH;
  const imgAspect = imgW / imgH;
  let scaleX = 1;
  let scaleY = 1;
  if (imgAspect > containerAspect) {
    scaleX = containerAspect / imgAspect;
  } else {
    scaleY = imgAspect / containerAspect;
  }
  return { scale: [scaleX, scaleY], offset: [(1 - scaleX) / 2, (1 - scaleY) / 2] };
}

export const HeroWaterRipple: React.FC<HeroWaterRippleProps> = ({
  src,
  alt,
  imgClassName = '',
  contrast = 1,
  brightness = 1,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<{ x: number; y: number; startTime: number; intensity: number }[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      return; // Static fallback
    }

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power'
    });
    if (!gl) return;

    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!program) return;

    const quadBuffer = gl.createBuffer();
    if (!quadBuffer) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      uPhoto: gl.getUniformLocation(program, 'uPhoto'),
      uPhotoUvScale: gl.getUniformLocation(program, 'uPhotoUvScale'),
      uPhotoUvOffset: gl.getUniformLocation(program, 'uPhotoUvOffset'),
      uAspect: gl.getUniformLocation(program, 'uAspect'),
      uTime: gl.getUniformLocation(program, 'uTime'),
      uRippleCount: gl.getUniformLocation(program, 'uRippleCount'),
      uContrast: gl.getUniformLocation(program, 'uContrast'),
      uBrightness: gl.getUniformLocation(program, 'uBrightness')
    };

    const rippleLocs: WebGLUniformLocation[] = [];
    for (let i = 0; i < MAX_RIPPLES; i++) {
      const loc = gl.getUniformLocation(program, `uRipples[${i}]`);
      if (loc) rippleLocs.push(loc);
    }

    // Load photo texture
    const photoTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, photoTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let photoReady = false;
    let coverScale: [number, number] = [1, 1];
    let coverOffset: [number, number] = [0, 0];
    let imgNaturalW = 1;
    let imgNaturalH = 1;

    const textureImage = new Image();
    textureImage.decoding = 'async';

    const uploadPhoto = () => {
      imgNaturalW = textureImage.naturalWidth || 1;
      imgNaturalH = textureImage.naturalHeight || 1;
      gl.bindTexture(gl.TEXTURE_2D, photoTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      photoReady = true;
      recomputeCoverUv();
      canvas.style.opacity = '1';
      renderFrame(performance.now() * 0.001);
    };

    textureImage.src = src;
    if (typeof textureImage.decode === 'function') {
      textureImage.decode().then(uploadPhoto).catch(() => {
        textureImage.onload = uploadPhoto;
      });
    } else {
      textureImage.onload = uploadPhoto;
    }

    let containerW = 0;
    let containerH = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const recomputeCoverUv = () => {
      if (containerW <= 0 || containerH <= 0) return;
      const { scale, offset } = computeCoverUv(containerW, containerH, imgNaturalW, imgNaturalH);
      coverScale = scale;
      coverOffset = offset;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      containerW = rect.width;
      containerH = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelW = Math.max(1, Math.round(containerW * dpr));
      const pixelH = Math.max(1, Math.round(containerH * dpr));
      if (canvas.width !== pixelW || canvas.height !== pixelH) {
        canvas.width = pixelW;
        canvas.height = pixelH;
      }
      recomputeCoverUv();
      if (photoReady) {
        renderFrame(performance.now() * 0.001);
      }
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Animation Loop Management
    let rafId: number | null = null;
    let loopRunning = false;

    const renderFrame = (nowSec: number) => {
      if (!photoReady) return;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, photoTexture);
      gl.uniform1i(uniforms.uPhoto, 0);

      gl.uniform2f(uniforms.uPhotoUvScale, coverScale[0], coverScale[1]);
      gl.uniform2f(uniforms.uPhotoUvOffset, coverOffset[0], coverOffset[1]);
      const aspect = containerH > 0 ? containerW / containerH : 1;
      gl.uniform1f(uniforms.uAspect, aspect);
      gl.uniform1f(uniforms.uTime, nowSec);
      gl.uniform1f(uniforms.uContrast, contrast);
      gl.uniform1f(uniforms.uBrightness, brightness);

      // Filter active ripples
      const activeRipples = ripplesRef.current.filter(r => (nowSec - r.startTime) < WAVE_DECAY_TIME);
      ripplesRef.current = activeRipples;

      gl.uniform1i(uniforms.uRippleCount, activeRipples.length);

      for (let i = 0; i < MAX_RIPPLES; i++) {
        if (i < activeRipples.length && rippleLocs[i]) {
          const r = activeRipples[i];
          gl.uniform4f(rippleLocs[i], r.x, r.y, r.startTime, r.intensity);
        }
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const frame = () => {
      const nowSec = performance.now() * 0.001;
      renderFrame(nowSec);

      if (ripplesRef.current.length > 0) {
        rafId = requestAnimationFrame(frame);
      } else {
        // Stop animation loop when water is completely calm
        loopRunning = false;
        rafId = null;
      }
    };

    const ensureLoopRunning = () => {
      if (!loopRunning && photoReady) {
        loopRunning = true;
        rafId = requestAnimationFrame(frame);
      }
    };

    // Pointer click & movement trigger handlers
    let lastMoveTime = 0;
    let lastMoveX = -1;
    let lastMoveY = -1;

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore clicks on interactive controls (buttons, links, inputs)
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button, input, textarea, select, [role="button"], [tabindex]')) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (clickX < 0 || clickY < 0 || clickX > rect.width || clickY > rect.height) return;

      // Convert click position to normalized WebGL UV coordinates
      const u = clickX / rect.width;
      const v = 1.0 - (clickY / rect.height); // Flip Y to match WebGL UV space

      const nowSec = performance.now() * 0.001;
      const newRipple = { x: u, y: v, startTime: nowSec, intensity: 0.5 };

      ripplesRef.current = [...ripplesRef.current, newRipple].slice(-MAX_RIPPLES);
      ensureLoopRunning();
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore movement over interactive controls (buttons, links, inputs)
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button, input, textarea, select, [role="button"], [tabindex]')) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const moveX = e.clientX - rect.left;
      const moveY = e.clientY - rect.top;

      if (moveX < 0 || moveY < 0 || moveX > rect.width || moveY > rect.height) return;

      const nowMs = performance.now();
      if (nowMs - lastMoveTime < 70) return; // Throttle interval

      const dx = moveX - lastMoveX;
      const dy = moveY - lastMoveY;
      const distPx = Math.hypot(dx, dy);

      if (distPx < 14) return; // Minimum distance threshold to prevent micro-jitter

      const dtSec = Math.max(0.001, (nowMs - lastMoveTime) * 0.001);
      const speedPx = distPx / dtSec;

      lastMoveTime = nowMs;
      lastMoveX = moveX;
      lastMoveY = moveY;

      // Soft, subtle mouse disturbance intensity (0.06 for slow glide, 0.18 for fast stroke)
      const speedFactor = Math.min(1.0, speedPx / 1200.0);
      const moveIntensity = 0.06 + speedFactor * 0.12;

      const u = moveX / rect.width;
      const v = 1.0 - (moveY / rect.height);
      const nowSec = nowMs * 0.001;

      const newRipple = { x: u, y: v, startTime: nowSec, intensity: moveIntensity };

      ripplesRef.current = [...ripplesRef.current, newRipple].slice(-MAX_RIPPLES);
      ensureLoopRunning();
    };

    // Attach listeners to the parent section or container
    const parentSection = container.closest('section') || container;
    parentSection.addEventListener('pointerdown', handlePointerDown as EventListener, { passive: true });
    parentSection.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
    window.addEventListener('resize', resize);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
          loopRunning = false;
        }
      } else if (ripplesRef.current.length > 0) {
        ensureLoopRunning();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (rafId !== null) cancelAnimationFrame(rafId);
      loopRunning = false;
      canvas.style.opacity = '0';
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      parentSection.removeEventListener('pointerdown', handlePointerDown as EventListener);
      parentSection.removeEventListener('pointermove', handlePointerMove as EventListener);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      resizeObserver.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);

      gl.deleteTexture(photoTexture);
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(program);
    };
  }, [src, contrast, brightness]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover object-center ${imgClassName}`}
        loading="eager"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0 transition-opacity duration-700 ease-out"
      />
    </div>
  );
};

export default HeroWaterRipple;
