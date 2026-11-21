"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* The scene follows the site theme: bright chrome on black, dark chrome on paper. */
function useSceneInk() {
  const [ink, setInk] = useState("#ffffff");
  useEffect(() => {
    const read = () =>
      setInk(
        document.documentElement.getAttribute("data-theme") === "light"
          ? "#17171a"
          : "#ffffff",
      );
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);
  return ink;
}

/* ------------------------------------------------------------------ */
/* 3D scene — chrome core, wireframe shell, orbiting shards            */
/* ------------------------------------------------------------------ */
function Core({ ink }: { ink: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      state.pointer.y * 0.35,
      0.05,
    );
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      -state.pointer.x * 0.25,
      0.05,
    );
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.55, 96, 96]} />
      <MeshDistortMaterial
        color={ink}
        metalness={1}
        roughness={0.14}
        distort={0.34}
        speed={1.5}
        envMapIntensity={1.6}
      />
    </mesh>
  );
}

function Shell({ ink }: { ink: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.07;
      ref.current.rotation.z += delta * 0.03;
    }
  });
  return (
    <mesh ref={ref} scale={2.55}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial
        color={ink}
        wireframe
        transparent
        opacity={0.14}
        depthWrite={false}
      />
    </mesh>
  );
}

function Shards({ ink }: { ink: string }) {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        pos: [
          Math.sin(i * 2.4) * (3.2 + (i % 4) * 0.6),
          Math.cos(i * 1.7) * (2.1 + (i % 3) * 0.5),
          Math.sin(i * 0.9) * 2.6 - 1,
        ] as [number, number, number],
        scale: 0.1 + ((i * 37) % 10) / 45,
        rot: i * 0.7,
      })),
    [],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.05;
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      state.pointer.y * -0.4,
      0.04,
    );
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <mesh
          key={i}
          position={it.pos}
          rotation={[it.rot, it.rot * 0.5, it.rot * 0.2]}
          scale={it.scale}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={ink}
            metalness={1}
            roughness={0.22}
            envMapIntensity={1.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function Scene3D() {
  const ink = useSceneInk();
  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [0, 0, 6.4], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} />
        <directionalLight position={[-6, -3, -4]} intensity={1.1} />
        <pointLight position={[0, -4, 3]} intensity={22} color="#ffffff" />

        <group position={[1.15, 0.1, 0]}>
          <Core ink={ink} />
          <Shell ink={ink} />
        </group>
        <Shards ink={ink} />

        <Environment resolution={192}>
          <Lightformer
            intensity={5}
            position={[0, 5, -8]}
            scale={[12, 6, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={3.2}
            position={[-6, 1, 2]}
            scale={[6, 10, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={2.2}
            position={[6, -2, 3]}
            scale={[6, 8, 1]}
            rotation-y={Math.PI / 2}
            color="#dcdcdc"
          />
          <Lightformer
            form="ring"
            intensity={4}
            position={[2, 4, 4]}
            scale={4}
            color="#ffffff"
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
const NAME = "FARHAN".split("");

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: sceneY, scale }}>
        <img
          src="/images/hero.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0">
          <Scene3D />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_50%,var(--bg)_18%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-ink" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-24 md:px-8 md:pt-28"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[16rem]">
            <span className="label block">Portfolio — 2026</span>
            <p className="mt-3 font-mono text-[11px] leading-relaxed uppercase tracking-[0.1em] text-muted">
              Independent full-stack developer building the fast, strange,
              animated corners of the web.
            </p>
          </div>

          <div className="hidden text-right md:block">
            <span className="label block">Based remotely / available</span>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              UTC+6 · accepting Q2 work
            </p>
          </div>
        </div>

        <div className="py-10">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2 overflow-hidden">
            {NAME.map((ch, i) => (
              <motion.span
                key={i}
                className="display block text-[clamp(4.5rem,20vw,17rem)] leading-[0.8]"
                initial={{ y: "115%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 1.1,
                  delay: 0.9 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              className="display block text-[clamp(4.5rem,20vw,17rem)] leading-[0.8] text-transparent"
              style={{ WebkitTextStroke: "2px var(--fg)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              .
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.65 }}
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5"
          >
            <span className="font-serif text-[clamp(1.1rem,2.6vw,2rem)] italic">
              full-stack developer
            </span>
            <span className="label">·</span>
            <span className="font-serif text-[clamp(1.1rem,2.6vw,2rem)] italic">
              WebGL &amp; motion
            </span>
            <span className="label">·</span>
            <span className="font-serif text-[clamp(1.1rem,2.6vw,2rem)] italic">
              AI products
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-5"
        >
          <a
            href="#work"
            data-cursor="Scroll"
            className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-paper">
              ↓
            </span>
            Scroll to explore
          </a>

          <div className="flex items-center gap-6">
            <a
              href="https://farhangpt.bond"
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted underline decoration-line underline-offset-4 transition-colors hover:text-paper"
            >
              farhangpt.bond
            </a>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:inline">
              06 shipped projects
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
