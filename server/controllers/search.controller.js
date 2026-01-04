import supabase from "../config/supabase.js";

export const searchWebsites = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim() === "") {
      return res.json({ success: true, results: [] });
    }

    const { data, error } = await supabase
      .from("websites")
      .select("id, url, title, description")
      .eq("status", "approved")
      .textSearch(
        "title,description,indexed_text",
        query,
        { type: "plain", config: "english" }
      )
      .limit(10);

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      results: data,
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};