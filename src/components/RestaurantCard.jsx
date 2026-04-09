import React from "react";
import { Link } from "react-router-dom";

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

const RestaurantCard = ({ restaurant }) => {
  const imageSrc =
    restaurant.photos && restaurant.photos.length > 0
      ? restaurant.photos[0]
      : `https://picsum.photos/seed/${restaurant.id}/400/600`;

  const rating = restaurant.rating || "4.5";
  const priceRange = getPriceTier(restaurant.price_level);
  const isOpen = checkIsOpen(restaurant.open_time, restaurant.close_time);

  return (
    <Link
      to={`/detail/${restaurant.id}`}
      // TINGGI HP JADI 280px
      className="relative flex flex-col h-[280px] md:h-[400px] w-full rounded-[20px] md:rounded-[32px] overflow-hidden shadow-md group cursor-pointer bg-black"
    >
      <img
        src={imageSrc}
        alt={restaurant.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out md:group-hover:scale-110 md:group-hover:opacity-70 z-0"
      />

      {/* Badge Open & Rating dibuat lebih mungil di HP */}
      <div className="absolute top-3 md:top-6 left-3 md:left-6 z-20">
        <span
          className={`px-2.5 py-1 rounded-full text-[8px] md:text-[10px] font-black tracking-wider shadow-lg backdrop-blur-md border border-white/20 ${isOpen ? "bg-[#a63c0d] text-white" : "bg-gray-800/80 text-gray-300"}`}
        >
          {isOpen ? "OPEN" : "CLOSED"}
        </span>
      </div>

      <div className="absolute top-3 md:top-6 right-3 md:right-6 z-20">
        <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 md:px-3 py-1 md:py-1.5 rounded-full flex items-center gap-1 shadow-md border border-white/20">
          <span className="text-[10px] md:text-sm font-black">{rating}</span>
          <span className="text-[#a63c0d] text-[8px] md:text-[10px]">★</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 pointer-events-none"></div>

      {/* Panel Info: Translate disesuaikan biar pas di kartu pendek */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-6 flex flex-col transform translate-y-0 md:translate-y-[76px] group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
        <h3 className="text-lg md:text-2xl font-black text-white mb-0.5 md:mb-1.5 tracking-tight leading-tight drop-shadow-md line-clamp-1">
          {restaurant.name}
        </h3>

        <div className="flex flex-col gap-0.5 md:gap-1 mb-3 md:mb-6">
          <p className="text-[9px] md:text-xs font-bold text-[#a63c0d] uppercase tracking-wider line-clamp-1">
            {restaurant.category}
          </p>
          <p className="text-[10px] md:text-sm text-gray-300 font-medium">
            <span className="text-white font-black tracking-widest">
              {priceRange}
            </span>
          </p>
        </div>

        <div className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          <div className="w-full bg-white text-[#a63c0d] py-2 md:py-3.5 rounded-lg md:rounded-2xl text-[9px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase shadow-2xl text-center">
            Lihat Detail
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
