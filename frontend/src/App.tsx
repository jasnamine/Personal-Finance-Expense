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
import Category from "./pages/Category/Category";
import Dashboard from "./pages/Dashboard/Dashboard";
import Missing from "./pages/Errors/Missing";
import NotFound from "./pages/Errors/NotFound";
import Unauthorized from "./pages/Errors/Unauthorized";
import Group from "./pages/Group/Group";

import GroupDetail from "./pages/GroupDetail/GroupDetail";
import Expense from "./pages/Personal/Expense";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="category" element={<Category />} />
            <Route path="personal" element={<Expense />} />
            <Route path="group" element={<Group />} />
            <Route path="group/group-detail/:id" element={<GroupDetail />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/missing" element={<Missing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
