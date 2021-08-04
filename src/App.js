import "./App.css";

//  IMPORT COMPONENTS
import Chat from "./components/chat/Chat";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <div className="headerPage">
        <h1>GrandPy Bot 👴</h1>
      </div>
      <Chat />
      <Footer />
    </div>
  );
}

export default App;
