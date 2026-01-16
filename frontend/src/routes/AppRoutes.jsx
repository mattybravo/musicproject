//Imports
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/LandingPage/LandingPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import LoginPage from "../pages/Auth/LoginPage";
import HomeLoginPage from "../pages/HomeLoginPage/HomeLoginPage";
import ExplorePage from "../pages/ExplorePage/ExplorePage";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path = "/" element = {<LandingPage />} />
                <Route path = "/register" element = {<RegisterPage />} />
                <Route path = "/login" element = {<LoginPage />} />
                <Route path = "/home" element = {<HomeLoginPage />} />
                <Route path = "/explorar" element = {<ExplorePage />} />
            </Routes>
        </Router>
    )
};

export default AppRoutes;

