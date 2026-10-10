"use client";
import { useState } from "react";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Zari's Fashion Sample Products
  const products = [
    {
      id: 1,
      name: "Luxury Silk Abaya",
      category: "abaya",
      price: "Rs. 4,500",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=60",
      description: "Designer custom hand-stitched abaya.",
    },
    {
      id: 2,
      name: "Zari Signature Perfume",
      category: "cosmetics",
      price: "Rs. 3,200",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&auto=format&fit=crop&q=60",
      description: "Long-lasting premium floral scent.",
    },
    {
      id: 3,
      name: "Black Velvet Butterfly Abaya",
      category: "abaya",
      price: "Rs. 5,800",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&auto=format&fit=crop&q=60",
      description: "Exclusive luxury velvet fabric.",
    },
  ];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((item) => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Navbar Header */}
      <header className="bg-rose-700 text-white p-4 shadow-md sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Zari's Fashion</h1>
          <p className="text-xs text-rose-200">Abayas & Luxury Fragrances</p>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-rose-100 text-rose-950 p-6 text-center shadow-inner">
        <h2 className="text-2xl font-serif font-bold">Welcome to Zari's Fashion</h2>
        <p className="text-sm mt-1 text-rose-800">
          Handcrafted Abayas & Exclusive Perfume Brand
        </p>
      </section>

      {/* Category Tabs */}
      <div className="flex justify-center gap-3 my-6 px-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeCategory === "all"
              ? "bg-rose-700 text-white"
              : "bg-white text-gray-700 shadow hover:bg-gray-100"
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setActiveCategory("abaya")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeCategory === "abaya"
              ? "bg-rose-700 text-white"
              : "bg-white text-gray-700 shadow hover:bg-gray-100"
          }`}
        >
          👗 Abayas
        </button>
        <button
          onClick={() => setActiveCategory("cosmetics")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            activeCategory === "cosmetics"
              ? "bg-rose-700 text-white"
              : "bg-white text-gray-700 shadow hover:bg-gray-100"
          }`}
        >
          ✨ Perfumes & Cosmetics
        </button>
      </div>

      {/* Product List Grid */}
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col justify-between"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  {product.category === "abaya" ? "Abaya Design" : "Perfume"}
                </span>
                <h3 className="font-bold text-gray-800 mt-2 text-lg">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{product.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t flex justify-between items-center">
                <span className="text-rose-700 font-extrabold text-base">
                  {product.price}
                </span>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/923000000000?text=Hello!%20I%20want%20to%20buy%20${encodeURIComponent(
                        product.name
                      )}`
                    )
                  }
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition flex items-center gap-1 shadow"
                >
                  💬 Order via WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}