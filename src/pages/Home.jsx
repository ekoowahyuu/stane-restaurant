import React, { useState, useEffect } from "react";
import RestaurantCard from "../components/RestaurantCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../supabase";

const getPriceTier = (rawPrice) => {
  if (!rawPrice) return "$$";
  const numericPrice = Number(rawPrice.toString().replace(/[^0-9]/g, ""));
  if (numericPrice <= 100000) return "$";
  if (numericPrice <= 250000) return "$$";
  if (numericPrice <= 750000) return "$$$";
  return "$$$$";
};

const checkIsOpen = (openStr, closeStr) => {
  if (!openStr || !closeStr) return true;
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = openStr.split(":").map(Number);
  const [closeH, closeM] = closeStr.split(":").map(Number);

  const openMins = openH * 60 + openM;
  const closeMins = closeH * 60 + closeM;

  if (openMins === 0 && closeMins >= 1439) return true;
  return currentMins >= openMins && currentMins <= closeMins;
};

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. "All" dihapus, default langsung ke "Indonesian"
  const [activeCuisine, setActiveCuisine] = useState("Indonesian");
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterPrice, setFilterPrice] = useState("All");

  // Kategori "All" dihilangkan dari array
  const cuisines = ["Indonesian", "Japanese", "Western", "Chinese", "Korean"];
  const prices = ["All", "$", "$$", "$$$", "$$$$"];

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        // 2. QUERY SAKTI KE SUPABASE
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .ilike("category", `%${activeCuisine}%`)
          .gte("rating", 4.2) // Syarat: Rating harus "Good" (4.2 ke atas)
          .order("votes", { ascending: false }) // Diurutkan dari Vote terbanyak
          .limit(15); // Ambil Top 15 aja biar slidernya nggak kepanjangan

        if (error) throw error;
        setRestaurants(data);
      } catch (error) {
        console.error("Gagal narik data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [activeCuisine]);

  // ==========================================
  // CLIENT SIDE FILTER LOGIC (Tetep Jalan)
  // ==========================================
  const filteredRestaurants = restaurants.filter((resto) => {
    let isMatch = true;

    const openStr = resto.open_time || "08:00:00";
    const closeStr = resto.close_time || "20:00:00";
    const isOpen = checkIsOpen(openStr, closeStr);

    if (filterOpenNow && !isOpen) {
      isMatch = false;
    }

    if (filterPrice !== "All") {
      const restoTier = getPriceTier(resto.price_level);
      if (restoTier !== filterPrice) {
        isMatch = false;
      }
    }

    return isMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* DI SINI PERBAIKANNYA BOS: Pake overflow-x-hidden dan tambah px-4 biar di HP ada jarak aman */}
      <main className="max-w-[1600px] w-full mx-auto px-4 lg:px-8 mt-8 flex-grow pb-12 overflow-x-hidden">
        {/* --- SECTION FILTER --- */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 space-y-6">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
              Categories
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setActiveCuisine(cuisine)}
                  className={`whitespace-nowrap px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-300 snap-start shrink-0 ${
                    activeCuisine === cuisine
                      ? "bg-[#a63c0d] text-white border-[#a63c0d] shadow-md"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#a63c0d] hover:text-[#a63c0d]"
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 pt-5 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Price:
              </span>
              <div className="flex gap-2">
                {prices.map((price) => (
                  <button
                    key={price}
                    onClick={() => setFilterPrice(price)}
                    className={`px-4 py-1.5 rounded-lg border text-sm font-bold transition-all duration-300 ${
                      filterPrice === price
                        ? "bg-[#a63c0d] text-white border-[#a63c0d]"
                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Status:
              </span>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filterOpenNow}
                    onChange={() => setFilterOpenNow(!filterOpenNow)}
                  />
                  <div
                    className={`block w-12 h-6 rounded-full transition-colors duration-300 ${
                      filterOpenNow ? "bg-[#a63c0d]" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${
                      filterOpenNow ? "transform translate-x-6" : ""
                    }`}
                  ></div>
                </div>
                <div className="ml-3 text-sm font-bold text-gray-600">
                  Open Now
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* --- SECTION JUDUL --- */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            🔥 Popular in {activeCuisine}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Top rated places with the most votes.
          </p>
        </div>

        {/* --- SECTION CONTENT (SLIDER) --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="animate-pulse text-[#a63c0d] font-bold tracking-[0.2em] text-xs">
              FETCHING TOP PLACES...
            </p>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            {filteredRestaurants.map((resto) => (
              <div
                key={resto.id}
                className="w-[220px] sm:w-[300px] lg:w-[260px] xl:w-[270px] snap-start shrink-0"
              >
                <RestaurantCard restaurant={resto} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="text-4xl block mb-4">🍽️</span>
            <h3 className="text-lg font-bold text-gray-900">
              Tidak ada restoran
            </h3>
            <p className="text-gray-500 mt-2 text-sm">
              Coba ubah filter kategori, harga, atau status.
            </p>
            <button
              onClick={() => {
                setFilterPrice("All");
                setFilterOpenNow(false);
              }}
              className="mt-6 text-[#a63c0d] text-xs font-bold tracking-widest hover:underline uppercase"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;
