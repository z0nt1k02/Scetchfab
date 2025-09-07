import "./App.css";
import Header from "./assets/Header/Header.jsx";
import ModelCard from "./assets/ModelCard/ModelCard.jsx";

function App() {
  return (
    <div>
      <Header />
      <main>
        <div className="cards-container">
          <ModelCard />
          <ModelCard />
          <ModelCard />
          <ModelCard />
          <ModelCard />
        </div>
      </main>
    </div>
  );
}

export default App;
