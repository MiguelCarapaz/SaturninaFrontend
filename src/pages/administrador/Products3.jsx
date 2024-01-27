import React from 'react';
import { Footer3, Navbar3, Product3 } from "../../components/administrador/administrador";

const Products3 = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <header className="sticky top-0 z-50">
          <Navbar3 />
        </header>
        <Product3 />
      </main>

      <footer className="mt-auto">
        <Footer3 />
      </footer>
    </div>
  );
};

export default Products3;
