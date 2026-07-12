const SUPABASE_URL = "https://enfzbzjndxkhkgiadcty.supabase.co";

const SUPABASE_KEY = "sb_publishable_Y4oG3qS8kzcDdZX-663d3w_EVJw4W0Z";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Conectado con Supabase");