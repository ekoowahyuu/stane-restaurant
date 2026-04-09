import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Catatan: 'Link' udah ga di-import di sini karena tombol Back udah dipindah ke Header.jsx
import { supabase } from "../supabase";

// Import Komponen Global
import Header from "../components/Header";
import Footer from "../components/Footer";

function Detail() {
  const { id } = useParams();
  const [resto, setResto] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetailAndReviews = async () => {
      try {
        setLoading(true);

        const { data: dataResto, error: errorResto } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", Number(id))
          .single();

        if (errorResto) throw errorResto;
        setResto(dataResto);

        const { data: dataReviews, error: errorReviews } = await supabase
          .from("reviews")
          .select("*")
          .eq("restaurant_id", Number(id));

        if (!errorReviews && dataReviews) {
          setReviews(dataReviews);
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetailAndReviews();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="animate-pulse text-lg font-bold text-gray-500">
          Memuat Detail...
        </p>
      </div>
    );

  if (!resto)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center text-center">
          <p className="text-xl font-bold text-gray-800">Restoran ga ketemu.</p>
        </div>
        <Footer />
      </div>
    );

  return (
    // flex-col dan min-h-screen wajib ada biar Footer selalu kedorong ke bawah
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER MUNCUL DI SINI (Otomatis ada tombol Back karena kita bukan di halaman Home) */}
      <Header />

      {/* MAIN CONTENT (flex-grow biar ngisi sisa layar antara header & footer) */}
      <main className="max-w-3xl mx-auto px-4 mt-8 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 flex-grow mb-12 w-full py-6">
        {/* === RESTAURANT NAME & RATING === */}
        <div className="px-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-black text-gray-900">{resto.name}</h1>
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm mt-1">
              <span className="font-bold">{resto.rating || "4.0"}</span>
              <span className="text-xs">★</span>
            </div>
          </div>
          <p className="text-gray-500 font-medium mb-6">
            {resto.category} • {resto.city}
          </p>

          <img
            src={`https://picsum.photos/seed/${resto.id}/1200/600`}
            alt={resto.name}
            className="w-full h-72 object-cover rounded-xl shadow-sm"
          />
        </div>

        {/* === MAP SUNGGUHAN (Google Maps) === */}
        <div className="px-6 mb-8 mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Location</h3>

          {/* Pastikan field latitude & longitude lu sesuai sama nama kolom di Supabase lu ya! */}
          {resto.latitude && resto.longitude ? (
            <div className="w-full h-72 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${resto.latitude},${resto.longitude}&z=16&output=embed`}
                allowFullScreen
                title={`Peta lokasi ${resto.name}`}
              ></iframe>
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
              <span className="text-2xl mb-1">📍</span>
              <span className="text-sm font-medium">
                Titik koordinat belum tersedia di database.
              </span>
            </div>
          )}
        </div>

        {/* === SECTION: REVIEWS === */}
        <div className="px-6 pb-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-3">
            Customer Reviews ({reviews.length})
          </h3>

          {reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                    {rev.reviewer_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-gray-900">
                        {rev.reviewer_name}
                      </h4>
                      <div className="text-yellow-400 text-xs flex gap-0.5">
                        {"★".repeat(rev.rating)}
                        <span className="text-gray-200">
                          {"★".repeat(5 - rev.rating)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">
                Belum ada ulasan untuk restoran ini.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER MUNCUL DI SINI */}
      <Footer />
    </div>
  );
}

export default Detail;
