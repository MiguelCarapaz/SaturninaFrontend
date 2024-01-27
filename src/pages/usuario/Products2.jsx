import React from 'react';
import { Footer2, Navbar2, Product2 } from "../../components/usuario/usuario";

const Products2 = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <header className="sticky top-0 z-50">
          <Navbar2 />
        </header>
        <Product2 />
      </main>

      <footer className="mt-auto">
        <Footer2 />
      </footer>
    </div>
  );
};

export default Products2;
