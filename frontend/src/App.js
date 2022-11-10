import { BrowserRouter as Router } from "react-router-dom";
import Authmiddleware from "./router/middleware/Authmiddleware";

function App() {
  return (
    <Router>
      <Authmiddleware/>
    </Router>
  );
}

export default App;
