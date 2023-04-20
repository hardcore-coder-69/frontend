// React imports
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Prime React imports
import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

// Custom components
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";

// Root css
import "./App.css";

function App() {
    return (
        <Router>
            <Fragment>
                <section className="App">
                    <Header />
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/signup" element={<Signup />} />
                        {/* <Route exact path="/add-new-book" element={<AddNewBook />} /> */}
                    </Routes>
                </section>
            </Fragment>
        </Router>
    );
}

export default App;
