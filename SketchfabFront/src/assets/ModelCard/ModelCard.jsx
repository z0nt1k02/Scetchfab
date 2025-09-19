import "./ModelCard.css";
import { useNavigate } from "react-router-dom";

function ModelCard({ src, alt, title, modelId }) {
  const navigate = useNavigate();
  function OpenModel() {
    navigate(`/model/${modelId}`);
  }

  return (
    <div className="modelCard-container">
      <img className="modelCard-image" src={src} alt={alt} />
      <button className="button-title" onClick={OpenModel}>
        {/* <h3 className="modelCard-title">{title || src}</h3> */}
        {title || src}
      </button>
      {/* <h3 className="modelCard-title">{title || src}</h3> */}
    </div>
  );
}

export default ModelCard;
