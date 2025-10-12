import { Canvas } from "@react-three/fiber";
import { useFBX, OrbitControls } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function FBXModel({ modelUrl, autoRotate }) {
  const fbx = useFBX(modelUrl);
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && isHovered) {
      // Горизонтальное вращение при наведении
      meshRef.current.rotation.y += delta * 0.5;
    } else if (meshRef.current && autoRotate) {
      // Медленное автоматическое вращение
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={fbx}
      scale={0.01}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    />
  );
}

function ModelPreview({ modelUrl, autoRotate = true }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Ограничиваем управление только горизонтальным вращением */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
      />

      <Suspense fallback={null}>
        <FBXModel modelUrl={modelUrl} autoRotate={autoRotate} />
      </Suspense>
    </Canvas>
  );
}

export default ModelPreview;
