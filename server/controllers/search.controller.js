import { SearchService } from "../services/search.service.js";

export const searchWebsites = async (req, res, next) => {
  try {
    const query = req.query.q;
    const results = await SearchService.search(query);

    return res.json({
      success: true,
      results,
    });

  } catch (err) {
    next(err);
  }
};