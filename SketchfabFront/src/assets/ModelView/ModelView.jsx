import "./ModelView.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useFBX } from "@react-three/drei";
import Header from "../Header/Header.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Suspense } from "react";

export default function ModelView() {
  const [model, setModel] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function getModel() {
      const id = "b94d418c-9043-4b6f-bf52-9a57c40b6ad2";
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:5105/api/model/${id}`,
          {
            responseType: "blob", // Важно: указываем что ожидаем blob
          }
        );

        // Получаем название файла из заголовков
        const contentDisposition = response.headers["content-disposition"];
        let filename = "unknown-file";

        // Создаем URL для blob
        const blobUrl = URL.createObjectURL(response.data);

        // Сохраняем URL модели для использования в Three.js
        setModel(blobUrl);
      } catch (error) {
        console.error("Ошибка при получении файла:", error);
        setError("Не удалось загрузить модель");
        if (error.response?.status === 404) {
          setError("Файл не найден");
        }
      } finally {
        setLoading(false);
      }
    }

    getModel();
  }, []);

  function FBXModel() {
    const fbx = useFBX(model);
    fbx.traverse((child) => {
      if (child.isMesh) {
        // Включаем тени
        child.castShadow = true;
        child.receiveShadow = true;

        // Если у меша есть материал, но он не отображается
        if (child.material) {
          // Настраиваем материал
          child.material.metalness = 0;
          child.material.roughness = 0.8;
          child.material.needsUpdate = true;
        } else {
          // Создаем материал если его нет
          child.material = new THREE.MeshStandardMaterial({
            color: 0x888888,
            metalness: 0,
            roughness: 0.8,
          });
        }
      }
    });
    return <primitive object={fbx} scale={0.01} />; // Adjust scale as needed
  }
  return (
    <>
      <Header></Header>
      <div>
        <div className="modelView-container">
          <Canvas className="modelCanvas">
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 0]} intensity={1} />
            <OrbitControls />
            {/* <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
            <model url="api/model/ed4094d6-f5c4-4df1-974f-15cefa531661" />

            <Environment preset="sunset"></Environment>
          </mesh> */}
            <Suspense>
              <FBXModel />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </>
  );
}
