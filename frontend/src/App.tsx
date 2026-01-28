import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/Layout/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import Dashboard from "./pages/Dashboard/Dashboard";
import Missing from "./pages/Errors/Missing";
import NotFound from "./pages/Errors/NotFound";
import Unauthorized from "./pages/Errors/Unauthorized";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/missing" element={<Missing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
