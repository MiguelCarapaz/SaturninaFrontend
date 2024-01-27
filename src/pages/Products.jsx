import React from 'react'
import { Footer, Navbar, Product } from "../components/Dashboard"

const Products = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <Product />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Products;
