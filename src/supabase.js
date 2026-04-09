import { createClient } from "@supabase/supabase-js";

// KONEKSI UTAMA SUPABASE LU
const supabaseUrl = "https://juanbylfoxwidgsgenjj.supabase.co";
const supabaseKey = "sb_publishable_q3mqjEqMWsPwOgKVxSsz9g_iiYLccmq";

// Export mesinnya biar bisa dipake di file lain
export const supabase = createClient(supabaseUrl, supabaseKey);
