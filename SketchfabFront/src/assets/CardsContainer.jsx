import "../App.css";
import { useState, useEffect } from "react";
import ModelCard from "./ModelCard/ModelCard";
export default function CardsContainer() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getItems() {
      try {
        setLoading(true);
        const response = await fetch("/api/model/preview-images");
        const images = await response.json();
        setItems(images);
        console.log(images);
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
      {!loading && items.length === 0 && <p>No models found</p>}
      {!loading &&
        items.map((item, index) => {
          return (
            <ModelCard
              key={index}
              src={item.url}
              alt={item.name}
              title={item.title}
            />
          );
        })}
    </div>
  );
}
