import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { db } from "./lib/db";
import { users, posts, bots } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import { initCronJobs } from "./services/cronService";
import { BotService } from "./services/botService";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.render("index", { error: null });
});

app.post("/api/user", async (req: Request, res: Response) => {
  console.log("User created called");
  try {
    const { user_id } = req.body;
    if (!user_id) {
      res.status(400).json({ error: "Missing required fields" });
      console.log("Missing required fields");
      return;
    }
    console.log(user_id);
    const newUser = await db
      .insert(users)
      .values({
        id: user_id,
      })
      .onConflictDoNothing();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/user", async (req: Request, res: Response) => {
  try {
    const { user_id, expo_push_token, platform } = req.body;
    if (!user_id || !expo_push_token || !platform) {
      res.status(400).json({ error: "Missing required fields" });
      console.log("FUCK YOU");
      return;
    }

    const updatedUser = await db
      .update(users)
      .set({
        expo_push_token: expo_push_token,
        platform: platform,
      })
      .where(eq(users.id, user_id));
    res.json(updatedUser);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/bot", async (req: Request, res: Response) => {
  try {
    const { user_id, systemPrompt } = req.body;
    if (!user_id || !systemPrompt) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    const newBot = await db
      .insert(bots)
      .values({
        id: user_id,
        userId: user_id,
        name: "Bot",
        username: "bot",
        avatar: "https://i.imgur.com/1b5QoSg.png",
        systemPrompt: systemPrompt,
      })
      .onConflictDoNothing();

    res.status(201).json(newBot);
    return;
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/bot/:botId/first-post", async (req: Request, res: Response) => {
  try {
    const { botId } = req.params;

    // Check if bot exists and has no posts
    const existingPosts = await db.query.posts.findFirst({
      where: eq(posts.userId, botId),
    });

    if (existingPosts) {
      res.status(400).json({
        error:
          "Bot already has posts. Please wait for the next daily post generation.",
      });

      return;
    }

    // Generate first post
    const content = await BotService.generateBotPost(botId);

    res.status(201).json({
      success: true,
      message: "First post generated successfully",
      content,
    });
  } catch (error) {
    console.error("Error generating first post:", error);
    res.status(500).json({
      error: "Failed to generate first post",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initCronJobs();
