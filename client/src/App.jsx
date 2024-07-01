import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Link } from "react-router-dom";
import Authentication from "./components/AuthPage/Authentication/Authentication";

function App() {
  return (
    <>
      <Authentication />
    </>
  );
}

export default App;
