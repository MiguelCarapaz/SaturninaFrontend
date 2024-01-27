import React from "react";
import { Navbar, Product, Footer } from "../components/Dashboard";
import Home_Saturnina from "./Home_Saturnina";
import { Comments } from "./Comments";

function Dashboard() {
  return (
    <>
      <main className="mb-8 md:mb-12">
        <header className="sticky top-0 z-50 mt-4 md:mt-0">
          <Navbar />
        </header>
        <Home_Saturnina />
        <Product />
        <Comments />
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </>
  );
}

export default Dashboard;
