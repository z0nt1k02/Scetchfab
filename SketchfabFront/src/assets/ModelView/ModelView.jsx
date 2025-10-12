import "./ModelView.css";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useFBX } from "@react-three/drei";
import Header from "../Header/Header.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { Suspense } from "react";
import { useParams } from "react-router-dom";

export default function ModelView() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();

  const downloadButton = () => {
    if (!model) return;

    const link = document.createElement("a");
    link.href = model;
    let name = model.name;
    link.setAttribute("download", "model.fbx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  useEffect(() => {
    async function getModel() {
      // const id = "b94d418c-9043-4b6f-bf52-9a57c40b6ad2";
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5105/api/model/${id}`,
          {
            responseType: "blob",
          }
        );
        const contentDisposition = response.headers["content-disposition"];
        let filename = "unknown-file";
        const blobUrl = URL.createObjectURL(response.data);
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
            <Suspense>
              <FBXModel />
            </Suspense>
          </Canvas>
        </div>
        <button className="download-button" onClick={downloadButton}>
          Скачать
        </button>
      </div>
    </>
  );
}
