import image from "../image.png";
import "./ModelCard.css";
function ModelCard() {
  return (
    <div className="modelCard-container">
      <img className="modelCard-image" src={image} alt="Model Card" />
      <h3 className="modelCard-title">Model Title</h3>
    </div>
  );
}

export default ModelCard;
