import "./App.css";

//  IMPORT COMPONENTS
import Chat from "./components/chat/Chat";

function App() {
  return (
    <div className="App">
      <div className="headerPage">
        <h1>GrandPy Bot 👴</h1>
      </div>
      <Chat />
    </div>
  );
}

export default App;
