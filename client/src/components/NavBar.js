import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth, logout } from '../auth'

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import './css/NavStyles.css';


// Logout function

const Logout=()=>{

    logout()
}


// Links
const LoggedInLinks=()=>{
    return (
        <>
            <Link className="link" to="/">Home</Link>
            <Link className="link" to="/create_recipe">Create Recipe</Link>
        </>
    )
}

const LoggedOutLinks=()=>{
    return (
        <>

        </>
    )
}

const LoggedInLinksDropDown=()=>{
    return (
        <>
            <a className="link" href="/" onClick={()=>{Logout()}}>Log Out</a>
        </>
    )
}

const LoggedOutLinksDropDown=()=>{
    return (
        <>
            <Link className="link" to="/signup">Sign Up</Link><br></br>
            <Link className="link" to="/login">Login</Link>
        </>
    )
}

const NavBar = () => {

    const [logged] = useAuth();

    return (

        <Navbar expand="lg" className="bg-body-tertiary nav-container" bg="dark" data-bs-theme="dark">

            {/*"""Nav Title"""*/}
            <Link className="link-brand" to="/">Recipes</Link>
            <Nav className="me-auto">
                {/*"""Change nav bar depending on login status"""*/}
                {logged?<LoggedInLinks/>:<LoggedOutLinks/>}

            </Nav>
            <Nav className="ml-auto">

                {/*"""Dropdown"""*/}
                <NavDropdown title="Account" id="basic-nav-dropdown">
                    {logged?<LoggedInLinksDropDown/>:<LoggedOutLinksDropDown/>}

                {/*<NavDropdown.Divider />*/}
                </NavDropdown>

            </Nav>
        </Navbar>
    );
}

export default NavBar;