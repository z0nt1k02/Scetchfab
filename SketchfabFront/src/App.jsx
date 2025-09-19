import "./App.css";
import Header from "./assets/Header/Header.jsx";

import CardsContainer from "./assets/CardsContainer.jsx";

function App() {
  // const [isModal, setModal] = useState(false);

  return (
    <div>
      <Header /*isModal={isModal} setModal={setModal} */ />
      <main>
        <CardsContainer />
        {/* <Modal open={isModal} onClose={() => setModal(false)}></Modal> */}
        {/* <Modal open={isModal} onClose={null}></Modal> */}
      </main>
    </div>
  );
}

export default App;
