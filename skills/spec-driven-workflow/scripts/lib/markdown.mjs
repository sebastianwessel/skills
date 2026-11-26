// Use ATX headings and optional HTML anchors for stable spec references.
function visibleLines(markdown) {
  let fence = null;
  let inList = false;
  const visible = markdown.replace(/<!--[\s\S]*?(?:-->|$)/g, (comment) => comment.replace(/[^\r\n]/g, " "));
  return visible.split(/\r?\n/).map((line) => {
    const delimiter = (inList ? /^ {0,6}(`{3,}|~{3,})(.*)$/ : /^ {0,3}(`{3,}|~{3,})(.*)$/).exec(line);
    if (fence) {
      if (delimiter && delimiter[1][0] === fence[0] && delimiter[1].length >= fence.length && !delimiter[2].trim()) fence = null;
      return "";
    }
    if (delimiter) fence = delimiter[1];
    if (/^ {0,3}(?:[-+*]|\d+[.)])\s/.test(line)) inList = true;
    else if (line.trim() && !/^(?: {2}|\t)/.test(line)) inList = false;
    return delimiter || (inList ? /^(?: {8}|\t\t)/.test(line) : /^(?: {4}|\t)/.test(line)) ? "" : line;
  });
}

export const markdownBody = (markdown) => markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
export const proseWithoutExamples = (markdown) => visibleLines(markdown).join("\n");

function sections(markdown) {
  const body = markdownBody(markdown);
  const lines = visibleLines(body);
  const headings = [];
  const anchors = [];
  for (const [index, line] of lines.entries()) {
    const heading = /^ {0,3}(#{1,6})[ \t]+(.+)$/.exec(line);
    if (heading) {
      const id = heading[2].trim().toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, "").trim().replace(/\s+/g, "-");
      const item = { id, index, level: heading[1].length };
      headings.push(item);
      anchors.push(item);
    }
    const prose = line.replace(/(`+)[^`\n]+?\1/g, "");
    for (const [, , id] of prose.matchAll(/<a\b[^>]*?\b(?:id|name)=(["'])([^"']+)\1[^>]*>/gi)) {
      anchors.push({ id, index, level: headings.at(-1)?.index === index ? headings.at(-1).level : null });
    }
  }
  return { body, headings, anchors };
}

export function markdownAnchors(markdown) {
  const counts = new Map();
  for (const { id } of sections(markdown).anchors) counts.set(id, (counts.get(id) || 0) + 1);
  return counts;
}

export function markdownSection(markdown, anchor) {
  const { body, headings, anchors } = sections(markdown);
  const matches = anchors.filter((item) => item.id === anchor);
  if (matches.length !== 1) return null;
  const { index, level } = matches[0];
  const lines = body.split(/\r?\n/);
  const next = headings.find((item) => item.index > index);
  const attached = !level && next && lines.slice(index + 1, next.index).every((line) => !line.trim());
  const start = attached ? next.index : index;
  const boundary = level ?? (attached ? next.level : 7);
  const following = headings.find((item) => item.index > start && item.level <= boundary);
  const followingAnchor = following && anchors.find((item) => !item.level && item.index > start &&
    item.index < following.index && lines.slice(item.index + 1, following.index).every((line) => !line.trim()));
  const end = followingAnchor?.index ?? following?.index ?? lines.length;
  return lines.slice(index, end).join("\n").trimEnd();
}

export function markdownLinks(markdown) {
  const prose = proseWithoutExamples(markdownBody(markdown)).replace(/(`+)[^`\n]+?\1/g, "");
  const links = [];
  for (const [, image, label, enclosed, plain] of prose.matchAll(/(!?)\[([^\]\n]*)\]\((?:<([^<>\n]+)>|([^()<>\s]+))(?:\s+["'][^"']*["'])?\)/g)) {
    const target = enclosed ?? plain;
    if (!/^[a-z][a-z0-9+.-]*:/i.test(target)) links.push({ image: Boolean(image), label, target });
  }
  return links;
}
