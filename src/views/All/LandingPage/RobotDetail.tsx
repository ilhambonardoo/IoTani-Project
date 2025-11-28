"use client";

import React, { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Html,
  useProgress,
} from "@react-three/drei";

const MODEL_URL = "/models_robot/robot.glb";

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center w-56 sm:w-64 p-4 sm:p-5 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-white/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-blue-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-neutral-700">
            Memuat Aset 3D...
          </span>
        </div>

        <div className="w-full h-1.5 sm:h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between w-full mt-2 text-[9px] sm:text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
          <span>Loading</span>
          <span>{progress.toFixed(0)}%</span>
        </div>
      </div>
    </Html>
  );
};

const Model = () => {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene.clone()} scale={0.1} />;
};

const RobotViewer = () => {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1000);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const canvas = canvasContainer.querySelector("canvas");

      if (canvas && target !== canvas && !canvas.contains(target)) {
        return;
      }

      if (canvasContainer.contains(target)) {
        e.stopPropagation();
      }
    };

    window.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, true);
    };
  }, [ready]);

  return (
    <section className="w-full py-8 sm:py-10 px-4 sm:px-6 md:px-8 flex justify-center bg-black">
      <div className="w-full max-w-5xl">
        <motion.div
          className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-200">
              Prototipe
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm md:text-base mt-1">
              Visualisasi 3D Interaktif Real-time
            </p>
          </div>

          <div className="px-3 py-1.5 sm:py-1 bg-green-50 text-green-700 text-[10px] sm:text-xs font-semibold rounded-full border border-green-100 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
        </motion.div>

        <div
          ref={canvasRef}
          className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
          style={{
            touchAction: "pan-y pinch-zoom",
            willChange: "transform",
            isolation: "isolate",
            position: "relative",
            zIndex: 1,
          }}
        >
          {!ready ? (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-neutral-50 to-neutral-100">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-20 w-20 sm:h-32 sm:w-32 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full mb-4 flex items-center justify-center">
                  <div className="h-8 w-8 sm:h-12 sm:w-12 bg-white rounded-full"></div>
                </div>
                <div className="h-3 w-32 sm:w-48 bg-neutral-200 rounded mb-2"></div>
                <div className="h-2 w-24 sm:w-36 bg-neutral-200 rounded"></div>
              </div>
            </div>
          ) : (
            <Canvas
              shadows
              dpr={isMobile ? [1, 1] : [1, 1.5]}
              camera={{
                fov: isMobile ? 50 : 45,
                position: [0, 0, 10],
              }}
              gl={{
                antialias: !isMobile,
                alpha: true,
                powerPreference: "high-performance",
                preserveDrawingBuffer: false,
              }}
              frameloop="always"
              style={{
                display: "block",
                touchAction: "none",
                pointerEvents: "auto",
                position: "relative",
                width: "100%",
                height: "100%",
              }}
              onCreated={({ gl }) => {
                gl.domElement.style.position = "relative";
                gl.domElement.style.width = "100%";
                gl.domElement.style.height = "100%";
              }}
            >
              <Suspense fallback={<Loader />}>
                <Stage
                  environment="city"
                  intensity={isMobile ? 0.4 : 0.6}
                  adjustCamera={isMobile ? 1.0 : 1.2}
                >
                  <Model />
                </Stage>
              </Suspense>

              <OrbitControls
                enableZoom={!isMobile}
                enablePan={!isMobile}
                enableRotate={true}
                autoRotate={false}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
                touches={{
                  ONE: isMobile ? 0 : 1,
                  TWO: isMobile ? 1 : 2,
                }}
                makeDefault
              />
            </Canvas>
          )}
        </div>
      </div>
    </section>
  );
};

useGLTF.preload(MODEL_URL);

export default RobotViewer;
