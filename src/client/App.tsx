import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import FocusView from "./pages/FocusView";
import { Reports } from "./pages/Reports";
import { Notes } from "./pages/Notes";
import ApiKeys from "./pages/ApiKeys";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/focus" element={<FocusView />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/api-keys" element={<ApiKeys />} />
      </Routes>
    </Router>
  );
}

export default App;
