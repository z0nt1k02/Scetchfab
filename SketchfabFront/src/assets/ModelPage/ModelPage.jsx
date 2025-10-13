import "./ModelPage.css";
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
      const response = await axios.get(
        `http://localhost:5105/api/models/${id}`
      );

      const data = response.data;
      setModel(data.fileUrl);
      console.log(data);
    }
    getModel();
  }, [id]);

  function FBXModel() {
    const fbx = useFBX(model);
    return <primitive object={fbx} scale={0.01} />;
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
