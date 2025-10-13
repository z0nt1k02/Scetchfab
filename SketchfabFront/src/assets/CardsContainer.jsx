import "../App.css";
import { useState, useEffect } from "react";
import ModelCard from "./ModelCard/ModelCard";
import axios from "axios";

export default function CardsContainer() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getItems() {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5105/api/models?page=1&pageSize=10"
        );
        setItems(response.data);
        console.log(response.data);
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
              modelUrl={item.fileUrl}
              title={item.title}
              modelId={item.id}
            />
          );
        })}
    </div>
  );
}
