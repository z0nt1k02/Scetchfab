import "./ModelCard.css";

function ModelCard({ src, alt, title }) {
  return (
    <div className="modelCard-container">
      <img className="modelCard-image" src={src} alt={alt} />
      <h3 className="modelCard-title">{title || src}</h3>
    </div>
  );
}

export default ModelCard;
