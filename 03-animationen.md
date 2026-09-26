# 03 — Animationen (Motion.dev & Three.js)

> **Zweck**: Die drei Story-Sequenzen BUILD / FIX / REVIEW sowie die 3D-Hero-Szene.
> Diese Datei wird NICHT automatisch geladen. Verweise in der Aufgabenstellung
> ausdrücklich darauf, z.B.: "Lies CLAUDE.md und docs/..., dann ...".

---

## 5. ANIMATIONS WITH MOTION.DEV & FRAMER MOTION

### 5.1 On-Scroll Triggers with useInView
```ts
// src/hooks/useInView.ts
import { useInView } from 'react-intersection-observer';

export function useInView(options = {}) {
  return useInView({
    threshold: 0.2,
    ...options,
  });
}
```

**Usage in Component**:
```tsx
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

export const CodeAnimation = () => {
  const { ref, inView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -100 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <pre>
        <code>{`const robin = "builds systems"`}</code>
      </pre>
    </motion.div>
  );
};
```

### 5.2 Complex Sequences (Code → Website Transform)

```tsx
// src/components/Sections/BuildSection/CodeToWebsiteAnimation.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';

export const CodeToWebsiteAnimation = () => {
  const { ref, inView } = useInView();
  const [phase, setPhase] = useState<'idle' | 'code' | 'transform' | 'website'>('idle');

  useEffect(() => {
    if (!inView) {
      setPhase('idle');
      return;
    }

    const timeline = [
      { phase: 'code', delay: 300 },
      { phase: 'transform', delay: 2000 },
      { phase: 'website', delay: 3500 },
    ];

    const timers = timeline.map(({ phase: p, delay }) =>
      setTimeout(() => setPhase(p as any), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="code-to-website">
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="desk-illustration"
          >
            {/* Higgsfield video or static illustration of desk */}
            <img src="/assets/desk-robin.jpg" alt="Robin at desk" />
          </motion.div>
        )}

        {phase === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.8 }}
            className="code-block"
          >
            <CodeBlock
              language="typescript"
              code={`
// Klarheit + Struktur = Skalierung ohne dich
const buildImpactSystem = (vision: string) => {
  return {
    phase1: 'Clarity (2 weeks)',
    phase2: 'Strategy (4 weeks)',
    phase3: 'Build (6 weeks)',
    result: 'Scalable system that runs without you',
  };
};
              `}
            />
          </motion.div>
        )}

        {phase === 'transform' && (
          <motion.div
            key="transform"
            initial={{ rotateY: 0, opacity: 1 }}
            animate={{ rotateY: 180, opacity: 0.5 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ perspective: 1200 }}
            className="transform-phase"
          >
            {/* Code and website flip into each other */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              ✨ Magic happens here ✨
            </motion.div>
          </motion.div>
        )}

        {phase === 'website' && (
          <motion.div
            key="website"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="website-screenshot"
          >
            {/* Live website screenshot or video preview */}
            <img src="/assets/website-screenshot.png" alt="Live result" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

### 5.3 3D Scenes with Three.js

```tsx
// src/components/Hero/DataFlowScene.tsx
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const DataFlowGeometry = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Auto-rotate
    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.001;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  // Particles (red nodes)
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xd32f2f, // Red
    size: 0.3,
    sizeAttenuation: true,
  });

  return (
    <group ref={groupRef}>
      {/* Central sphere */}
      <mesh>
        <icosahedronGeometry args={[1, 4]} />
        <meshStandardMaterial color={0x1a1a1a} wireframe emissive={0xd32f2f} emissiveIntensity={0.2} />
      </mesh>

      {/* Orbiting particles */}
      <points ref={particlesRef} geometry={particlesGeometry} material={particlesMaterial} />

      {/* Connecting lines */}
      <lineSegments>
        <bufferGeometry>
          {/* Dynamically create lines between particles */}
        </bufferGeometry>
        <lineBasicMaterial color={0xd32f2f} transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
};

export const DataFlowScene = () => {
  return (
    <Canvas style={{ height: '400px' }} dpr={1}>
      <PerspectiveCamera position={[0, 0, 8]} fov={45} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <DataFlowGeometry />
      <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
    </Canvas>
  );
};
```

---

