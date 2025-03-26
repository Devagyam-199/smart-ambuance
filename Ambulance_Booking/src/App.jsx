import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./components/UserLogin";
import UserSignUp from "./components/UserSignup";
import UserMainPage from "./components/UserMainPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path='/usermain' element={<UserMainPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;