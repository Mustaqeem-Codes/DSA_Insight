import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Cards from "../components/Cards";
import Footer from "../components/Footer";

function Home() {
    return (
        <div>
            <Navbar />
            <Hero />
            <Features />
            <Cards />
            <Footer />
        </div>
    );
}

export default Home;