// scripts/doomsday.js
import fs from "node:fs";

const OUT = "doomsday.json";
const URL = "https://en.wikipedia.org/wiki/Doomsday_Clock";

function stripTags(html) {
  return html.replace(/<[^>]*>/g, "");
}

function decodeEntities(s) {
  // minimal decode for common entities we might see in tables
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseSecondsToMidnight(cellText) {
  // Examples seen on the page: "1+5⁄12(85 s)" or "100 s" or "2" (minutes)
  const t = cellText.replace(/\s+/g, " ").trim();

  // Prefer explicit seconds if present
  const secMatch = t.match(/(\d+)\s*s\b/i);
  if (secMatch) return Number(secMatch[1]);

  // Otherwise treat as minutes (including decimals/fractions if they appear as plain decimals)
  // We’ll keep it conservative: parseFloat of the leading number.
  const numMatch = t.match(/-?\d+(\.\d+)?/);
  if (!numMatch) return null;

  const minutes = Number(numMatch[0]);
  if (!Number.isFinite(minutes)) return null;

  return Math.round(minutes * 60);
}

function extractTimelineRows(html) {
  // Find the first table that contains "Timeline of the Doomsday Clock"
  // We do a cheap-but-effective scan:
  const idx = html.indexOf("Timeline of the Doomsday Clock");
  if (idx === -1) throw new Error("Could not find timeline section");

  const tableStart = html.lastIndexOf("<table", idx);
  const tableEnd = html.indexOf("</table>", idx);
  if (tableStart === -1 || tableEnd === -1) throw new Error("Could not locate timeline table");
  const tableHtml = html.slice(tableStart, tableEnd + "</table>".length);

  // Extract rows
  const rowMatches = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
  const rows = [];

  for (const m of rowMatches) {
    const rowHtml = m[1];

    // Extract cells (th or td)
    const cells = [...rowHtml.matchAll(/<(t[hd])[^>]*>([\s\S]*?)<\/t[hd]>/g)]
      .map((x) => decodeEntities(stripTags(x[2])).trim())
      .filter((x) => x.length);

    // Expect at least: Year, Minutes to midnight, ...
    if (cells.length < 2) continue;

    const year = Number((cells[0].match(/\d{4}/) || [])[0]);
    if (!Number.isFinite(year)) continue;

    const seconds = parseSecondsToMidnight(cells[1]);
    if (!Number.isFinite(seconds)) continue;

    rows.push({ year, seconds });
  }

  // de-dup / sort
  const dedup = new Map();
  for (const r of rows) dedup.set(r.year, r.seconds);
  return [...dedup.entries()]
    .map(([year, seconds]) => ({ year, seconds }))
    .sort((a, b) => a.year - b.year);
}

async function main() {
  const res = await fetch(URL, {
    headers: {
      "user-agent": "trmnl-doomsday-clock-bot/1.0 (github actions)"
    }
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const html = await res.text();

  const timeline = extractTimelineRows(html);
  if (!timeline.length) throw new Error("No timeline rows parsed");

  const currentRow = timeline[timeline.length - 1];
  const modern = timeline.filter((r) => r.year >= 2000);

  const data = {
    source: URL,
    updated_at: new Date().toISOString(),
    current: {
      year: currentRow.year,
      seconds_to_midnight: currentRow.seconds
    },
    modern,
    timeline
  };

  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`Wrote ${OUT} with ${timeline.length} rows (modern: ${modern.length})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
