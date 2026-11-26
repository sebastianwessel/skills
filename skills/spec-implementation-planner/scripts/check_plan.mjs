#!/usr/bin/env node
import path from "node:path";
import { checkPlan } from "./lib/plan.mjs";

const [repo, flag, selected, ...rest] = process.argv.slice(2);
try {
  if (!repo || rest.length || (flag !== undefined && (flag !== "--ticket" || !selected))) {
    throw new Error("usage: check_plan.mjs <repo-root> [--ticket TICKET-NNN]");
  }
  console.log(checkPlan(path.resolve(repo), selected));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
