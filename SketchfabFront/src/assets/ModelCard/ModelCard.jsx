import "./ModelCard.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function ModelCard({ modelUrl, title, modelId }) {
  const navigate = useNavigate();
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  function OpenModel() {
    navigate(`/model/${modelId}`);
  }

  // useEffect(() => {
  //   async function getModelUrl() {
  //     try {
  //       const response = await axios.get(`modelUrl`, {
  //         responseType: "blob",
  //       });
  //       const blobUrl = URL.createObjectURL(response.data);
  //       setBlobUrl(blobUrl);
  //     } catch (error) {
  //       console.error("Ошибка при получении модели для превью:", error);
  //       setBlobUrl(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   getModelUrl();

  //   // Очистка URL объекта при размонтировании компонента
  //   return () => {
  //     if (blobUrl) {
  //       URL.revokeObjectURL(blobUrl);
  //     }
  //   };
  // }, [modelId]);

  return (
    <div className="modelCard-container">
      <img className="modelCard-image" src="/upload.png" alt="model" />
      <button className="button-title" onClick={OpenModel}>
        {title || "Модель"}
      </button>
    </div>
  );
}

export default ModelCard;
