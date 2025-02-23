import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { db } from "./lib/db";
import { users } from "./drizzle/schema";
import { eq } from "drizzle-orm";

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
  try {
    const { user_id } = req.body;
    if (!user_id) {
      res.status(400).json({ error: "Missing required fields" });
      console.log("Missing required fields");
      return;
    }
    console.log(user_id);
    const newUser = await db.insert(users).values({
      id: user_id,
    });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
