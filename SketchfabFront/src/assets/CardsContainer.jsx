import "../App.css";
import { useState, useEffect } from "react";
import ModelCard from "./ModelCard/ModelCard";
import axios from "axios";

export default function CardsContainer() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getItems() {
      try {
        setLoading(true);
        // const response = await fetch("/api/model/preview-images");
        const response = await axios.get("/api/model/preview-images");
        const images = await response.data;
        setItems(images);
      } catch (error) {
        setLoading(false);
        return error;
      } finally {
        setLoading(false);
      }
    }
    getItems();
  }, []);
  return (
    <div className="cards-container">
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && (
        <ModelCard key="jkfd" src="/upload.png" title="Модель" alt="model" />
      )}
      {!loading &&
        items.map((item, index) => {
          return (
            <ModelCard
              key={index}
              src={item.url}
              alt={item.name}
              title={item.title}
              modelId={item.id}
            />
          );
        })}
    </div>
  );
}
