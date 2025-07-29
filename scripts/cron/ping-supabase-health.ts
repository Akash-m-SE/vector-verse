import { createClient } from "@supabase/supabase-js";

(async () => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;
    const SUPABASE_TABLE = process.env.SUPABASE_TABLE;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error(
        "Missing required environment variables: SUPABASE_URL or SUPABASE_KEY",
      );
    }

    console.log(`Pinging Supabase table: ${SUPABASE_TABLE}`);

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { status, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("*")
      .limit(10);

    if (!status || error) throw new Error("Failed to ping the table");

    console.log(
      `Ping successful! Retrieved  records from table: ${SUPABASE_TABLE}`,
    );
    console.log("Supabase is alive and healthy ✅");
  } catch (err: any) {
    console.error("Error pinging Supabase ❌:", err.message);
    process.exit(1);
  }
})();
