import React from 'react';
import {createRoot} from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';


// Import Link Pages For NavBar
import NavBar from './components/NavBar';
import HomePage from './components/Home';
import SignUpPage from './components/SignUp';
import LoginPage from './components/Login';
import CreateRecipePage from './components/CreateRecipes';

// Import Routing Functions For NavBar
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";


const App = () => {

    return (
        <Router>
            <div className="">
                <NavBar/>
                
                {/*"""Assign routes to switch between pages"""*/}
                    <Routes>
                        <Route path="/" element={<HomePage />}></Route>
                        <Route path="/signup" element={<SignUpPage />}></Route>
                        <Route path="/login"  element={<LoginPage />}></Route>
                        <Route path="/create_recipe" element={<CreateRecipePage />}></Route>
                    </Routes>
            </div>
        </Router>
    )
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App tab="home" />);
