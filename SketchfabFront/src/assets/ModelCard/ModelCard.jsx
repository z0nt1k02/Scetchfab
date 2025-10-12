import "./ModelCard.css";
import { useNavigate } from "react-router-dom";
import ModelPreview from "./ModelPreview.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

function ModelCard({ src, alt, title, modelId }) {
  const navigate = useNavigate();
  const [modelUrl, setModelUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  function OpenModel() {
    navigate(`/model/${modelId}`);
  }

  useEffect(() => {
    async function getModelUrl() {
      try {
        const response = await axios.get(
          `http://localhost:5105/api/model/${modelId}`,
          {
            responseType: "blob",
          }
        );
        const blobUrl = URL.createObjectURL(response.data);
        setModelUrl(blobUrl);
      } catch (error) {
        console.error("Ошибка при получении модели для превью:", error);
        // Если не удалось загрузить модель, используем изображение как fallback
        setModelUrl(null);
      } finally {
        setLoading(false);
      }
    }

    if (modelId) {
      getModelUrl();
    } else {
      setLoading(false);
    }
  }, [modelId]);

  return (
    <div className="modelCard-container">
      <div className="modelCard-preview">
        {loading ? (
          <div className="loading-placeholder">Загрузка...</div>
        ) : modelUrl ? (
          <ModelPreview modelUrl={modelUrl} />
        ) : (
          <img className="modelCard-image" src={src} alt={alt} />
        )}
      </div>
      <button className="button-title" onClick={OpenModel}>
        {title || src}
      </button>
    </div>
  );
}

export default ModelCard;
