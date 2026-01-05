import supabase from "../config/supabase.js";

export class SearchService {
    static async search(query) {
        if (!query || query.trim() === "") {
            return [];
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
            throw error;
        }

        return data;
    }
}
