#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const workspaces = ["apps/api", "apps/web", "apps/mobile"];

/**
 * The issue: `bun update --latest --recursive` updates the lockfile but NOT package.json files.
 * This script uses npm-check-updates or bun's capabilities to actually update package.json.
 */

async function updateWorkspace(workspacePath) {
  const packageJsonPath = join(rootDir, workspacePath, "package.json");
  console.log(`\n📦 Updating ${workspacePath}...`);
  
  try {
    // Use bun to update and save to package.json
    execSync("bun update --latest", {
      cwd: join(rootDir, workspacePath),
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`Error updating ${workspacePath}:`, error.message);
  }
}

async function main() {
  console.log("🔄 Updating all workspace package.json files...\n");
  
  // Update each workspace individually
  for (const workspace of workspaces) {
    await updateWorkspace(workspace);
  }
  
  // Finally install everything
  console.log("\n📥 Installing all dependencies...");
  execSync("bun install", { cwd: rootDir, stdio: "inherit" });
  
  console.log("\n✅ Done!");
}

main().catch(console.error);
