import axios from "axios";

export const visitorService = {
  /**
   * Track a visitor on a public page
   */
  async trackVisitor(username: string, pagePath: string): Promise<void> {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      await axios.post(`${baseURL}/public/track-visitor`, {
        username,
        pagePath,
      });
    } catch (error) {
      // Silently fail visitor tracking to not disrupt user experience
      console.error("Failed to track visitor:", error);
    }
  },
};
