import { CronJob } from "cron";
import { BotService } from "./botService";

export const initCronJobs = () => {
  // Run every day at 1 AM
  const dailyBotPosts = new CronJob("0 1 * * *", async () => {
    console.log("Running daily bot posts generation...");
    try {
      await BotService.generateDailyBotPosts();
      console.log("Daily bot posts generation completed");
    } catch (error) {
      console.error("Error in daily bot posts generation:", error);
    }
  });

  dailyBotPosts.start();
};
