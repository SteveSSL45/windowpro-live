import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Visualizer from "./Visualizer";
import Home from "./Home";

export default function App() {
  return (
    <Router>
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">🏠 WindowPro</h1>
        <div className="space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/visualizer" className="hover:text-blue-600">Visualizer</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </Router>
  );
}
