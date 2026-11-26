// The bundle uses ATX headings or explicit HTML anchors for stable scenario links.
export function proseWithoutExamples(markdown) {
  let fence = null;
  const prose = [];
  for (const line of markdown.replace(/<!--[\s\S]*?(?:-->|$)/g, "").split(/\r?\n/)) {
    const delimiter = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence) {
      if (delimiter && delimiter[1][0] === fence[0] && delimiter[1].length >= fence.length && !delimiter[2].trim()) fence = null;
      continue;
    }
    if (delimiter) fence = delimiter[1];
    else if (!/^(?: {4}|\t)/.test(line)) prose.push(line);
  }
  return prose.join("\n");
}

export function markdownAnchors(markdown) {
  const body = proseWithoutExamples(markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, ""));
  const anchors = new Map();
  const add = (id) => anchors.set(id, (anchors.get(id) || 0) + 1);
  for (const [, title] of body.matchAll(/^ {0,3}#{1,6}[ \t]+(.+)$/gm)) {
    add(title.trim().toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu, "").trim().replace(/\s+/g, "-"));
  }
  const prose = body.replace(/(`+)[^`\n]+?\1/g, "");
  for (const [, , id] of prose.matchAll(/<a\b[^>]*?\b(?:id|name)=(["'])([^"']+)\1[^>]*>/gi)) add(id);
  return anchors;
}
