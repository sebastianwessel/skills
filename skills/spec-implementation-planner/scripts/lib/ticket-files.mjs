import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const hash = (bytes) => `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
const wavePattern = /^wave_(\d{2,})_[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
export const ticketPattern = /^(TICKET-\d{3,})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export function ticketFiles(root) {
  const plans = path.join(root, "plans");
  if (!fs.lstatSync(plans).isDirectory()) throw new Error("expected regular plans directory");
  const tickets = [];
  const waveNumbers = new Set();
  for (const entry of fs.readdirSync(plans, { withFileTypes: true })) {
    if (!entry.name.startsWith("wave_")) continue;
    const wave = wavePattern.exec(entry.name);
    if (!wave || !entry.isDirectory()) throw new Error(`invalid wave directory: ${entry.name}`);
    const number = Number(wave[1]);
    if (!number || waveNumbers.has(number)) throw new Error(`invalid or duplicate wave number: ${entry.name}`);
    waveNumbers.add(number);
    const directory = path.join(plans, entry.name, "tickets");
    if (!fs.lstatSync(directory).isDirectory()) throw new Error(`expected tickets directory: ${entry.name}`);
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    if (!entries.length) throw new Error(`wave has no tickets: ${entry.name}`);
    for (const ticket of entries) {
      if (!ticket.isFile() || !ticketPattern.test(ticket.name)) throw new Error(`invalid ticket file: ${ticket.name}`);
      const relative = `${entry.name}/tickets/${ticket.name}`;
      const text = fs.readFileSync(path.join(plans, relative), "utf8").replace(/\r\n/g, "\n");
      tickets.push({ path: relative, wave: number, text, digest: hash(text) });
    }
  }
  if (!waveNumbers.size) throw new Error("no plans/wave_NN_slug/ directories found");
  return tickets;
}
