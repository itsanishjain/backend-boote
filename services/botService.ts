import OpenAI from "openai";
import { db } from "../lib/db";
import { bots, posts } from "../drizzle/schema";
import { eq, lt } from "drizzle-orm";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class BotService {
  // Generate content for a single bot
  static async generateBotPost(botId: string): Promise<string> {
    // Get bot details including system prompt
    const bot = await db.query.bots.findFirst({
      where: eq(bots.id, botId),
      with: {
        owner: true,
      },
    });

    if (!bot) throw new Error("Bot not found");

    if (!bot.systemPrompt) throw new Error("Bot has no system prompt");

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: bot.systemPrompt,
          },
          {
            role: "user",
            content:
              "Create a new post for your social media feed. Keep it under 280 characters.",
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content?.trim();
      if (!content) throw new Error("No content generated");

      // Create post in database
      await db.insert(posts).values({
        id: crypto.randomUUID(),
        userId: bot.id,
        content,
        likes: 0,
        comments: 0,
        reposts: 0,
        timestamp: new Date().toISOString(),
      });

      // Update bot's last post timestamp
      await db
        .update(bots)
        .set({ lastPostTimestamp: new Date().toISOString() })
        .where(eq(bots.id, botId));

      return content;
    } catch (error) {
      console.error("Error generating bot post:", error);
      throw error;
    }
  }

  // Generate posts for all bots that haven't posted in the last 24 hours
  static async generateDailyBotPosts(): Promise<void> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Get all bots that haven't posted in 24 hours
    const botsToPost = await db.query.bots.findMany({
      where: lt(bots.lastPostTimestamp, oneDayAgo.toISOString()),
    });

    // Generate posts for each bot
    const postPromises = botsToPost.map((bot) =>
      this.generateBotPost(bot.id).catch((error) => {
        console.error(`Failed to generate post for bot ${bot.id}:`, error);
        return null;
      })
    );

    await Promise.all(postPromises);
  }
}
