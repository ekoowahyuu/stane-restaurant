// ==========================================
// TAHAP 1: PERSIAPAN ALAT & BAHAN
// ==========================================
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; // Ini "alat bor" resmi dari Supabase

// Masukin kunci gudang data lu di sini (copas dari menu API di Supabase lu)
const supabaseUrl = "https://juanbylfoxwidgsgenjj.supabase.co";
const supabaseKey = "sb_publishable_q3mqjEqMWsPwOgKVxSsz9g_iiYLccmq";

// Bikin jembatan koneksi ke Supabase pakai kunci di atas
const supabase = createClient(supabaseUrl, supabaseKey);

export const useRestaurants = (categoryQuery = "") => {
  // ==========================================
  // TAHAP 2: BIKIN WADAH PENAMPUNGAN (STATE)
  // ==========================================
  // restaurants = buat nyimpen data yang berhasil diambil
  // loading = buat ngatur animasi muter-muter pas data lagi ditarik
  // error = buat nyimpen pesan kalau ada masalah
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Nyalain loading
      setError(null); // Bersihin error lama

      try {
        // ==========================================
        // TAHAP 3: MINTA DATA KE DATABASE SUPABASE
        // ==========================================
        // Kode di bawah ini bacanya:
        // "Supabase, tolong ambil dari tabel 'restaurants', terus pilih semua kolom (*)"
        const { data, error: supabaseError } = await supabase
          .from("restaurants")
          .select("*")
          .limit(50); // Kita batasi 50 dulu biar browser lu ga kaget narik ribuan data

        // Kalau Supabase ngambek (misal tabel ga ketemu), lempar error
        if (supabaseError) throw new Error(supabaseError.message);

        // ==========================================
        // TAHAP 4: MAPPING (PENYESUAIAN FORMAT DATA)
        // ==========================================
        // Data asli dari Kaggle bentuknya mentah.
        // Komponen kartu (RestaurantCard.jsx) lu butuh format khusus (ada photo, isOpen, dll).
        // Jadi kita "sulap" datanya di sini.
        const dataSiapPakai = data.map((resto) => {
          // 1. LOGIKA KATEGORI BANYAK
          // Data asli lu kan ada komanya misal: "Continental, Indonesian"
          // Kita pecah jadi array: ['Continental', 'Indonesian']
          const categoryArray = resto.category
            ? resto.category.split(",").map((item) => item.trim())
            : ["Restaurant"];

          // 2. LOGIKA SKALA HARGA (1 sampai 4)
          // Kita konversi harga aslinya (misal Rp 300.000) jadi skala dolar
          let priceScale = 2; // Default Menengah
          if (resto.price_level < 100000) priceScale = 1;
          else if (resto.price_level <= 250000) priceScale = 2;
          else if (resto.price_level <= 500000) priceScale = 3;
          else priceScale = 4;

          // 3. LOGIKA POPULAR
          // Kalau rating >= 4.5, kita anggap resto ini populer
          const isPopular = parseFloat(resto.rating) >= 4.5;

          return {
            id: resto.id,
            name: resto.name,
            rating: parseFloat(resto.rating) || 4.0,
            photo: `https://picsum.photos/seed/${resto.id}/400/300`,
            categories: categoryArray, // Sekarang bentuknya Array, bukan teks tunggal
            city: resto.city || "Jakarta",
            priceLevel: priceScale, // Ngirim angka 1-4 ke React
            isPopular: isPopular,
          };
        });

        // ==========================================
        // TAHAP 5: SIMPAN KE STATE SELESAI
        // ==========================================
        // Masukin data yang udah disulap tadi ke wadah utama
        setRestaurants(dataSiapPakai);
      } catch (err) {
        console.error("Error ngambil data:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Matiin loading karena proses udah kelar (sukses maupun gagal)
      }
    };

    fetchData(); // Jalanin fungsinya!
  }, [categoryQuery]); // Kalau kategori berubah, jalankan ulang fungsinya

  return { restaurants, loading, error };
};
