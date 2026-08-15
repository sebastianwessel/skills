/**
 * Deliberately small YAML reader for the checked spec artifacts. It supports
 * indentation-based maps/lists, scalar values, inline arrays/maps, comments,
 * and quoted strings. Rejecting unsupported YAML is intentional: readiness
 * evidence must be deterministic and portable without an undeclared runtime
 * dependency.
 */
const identifier = /^[A-Za-z_][A-Za-z0-9_.-]*$/;

function stripComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if ((c === "'" || c === '"') && line[i - 1] !== "\\") quote = quote === c ? null : (quote || c);
    if (c === "#" && !quote && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}

function splitInline(value, delimiter = ",") {
  const parts = [];
  let start = 0;
  let quote = null, depth = 0;
  for (let i = 0; i < value.length; i += 1) {
    const c = value[i];
    if ((c === "'" || c === '"') && value[i - 1] !== "\\") quote = quote === c ? null : (quote || c);
    if (!quote) {
      if (c === "[" || c === "{") depth += 1;
      if (c === "]" || c === "}") depth -= 1;
      if (c === delimiter && depth === 0) { parts.push(value.slice(start, i)); start = i + 1; }
    }
  }
  parts.push(value.slice(start));
  return parts.map((part) => part.trim()).filter(Boolean);
}

function scalar(raw, line) {
  const value = raw.trim();
  if (value === "") return null;
  if (value === "[]") return [];
  if (value === "{}") return {};
  if (value === "true" || value === "false") return value === "true";
  if (value === "null" || value === "~") return null;
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) return Number(value);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    try { return value.startsWith('"') ? JSON.parse(value) : value.slice(1, -1).replace(/''/g, "'"); }
    catch { throw new Error(`Invalid quoted scalar at line ${line}`); }
  }
  if (value.startsWith("[") && value.endsWith("]")) return splitInline(value.slice(1, -1)).map((item) => scalar(item, line));
  if (value.startsWith("{") && value.endsWith("}")) {
    const object = {};
    for (const part of splitInline(value.slice(1, -1))) {
      const match = part.match(/^([^:]+):\s*(.*)$/);
      if (!match) throw new Error(`Invalid inline map at line ${line}`);
      object[match[1].trim()] = scalar(match[2], line);
    }
    return object;
  }
  if (/^[>|]/.test(value)) throw new Error(`Block scalars are not supported in structured readiness artifacts (line ${line})`);
  return value;
}

export function parseYaml(source, label = "YAML") {
  const lines = source.split(/\r?\n/).map((raw, index) => {
    const clean = stripComment(raw).replace(/\s+$/, "");
    const match = clean.match(/^( *)(.*)$/);
    if (match[1].includes("\t")) throw new Error(`${label}: tabs are not supported (line ${index + 1})`);
    return { indent: match[1].length, text: match[2], line: index + 1 };
  }).filter((line) => line.text !== "");
  let index = 0;

  function parseBlock(indent) {
    if (index >= lines.length) return null;
    const first = lines[index];
    if (first.indent < indent) return null;
    if (first.indent > indent) throw new Error(`${label}: unexpected indentation at line ${first.line}`);
    const isList = first.text === "-" || first.text.startsWith("- ");
    const result = isList ? [] : {};
    while (index < lines.length && lines[index].indent === indent) {
      const current = lines[index];
      const listItem = current.text === "-" || current.text.startsWith("- ");
      if (listItem !== isList) throw new Error(`${label}: mixed list and map at line ${current.line}`);
      if (isList) {
        const tail = current.text.slice(1).trim();
        index += 1;
        if (!tail) {
          if (index >= lines.length || lines[index].indent <= indent) throw new Error(`${label}: list item needs a value at line ${current.line}`);
          result.push(parseBlock(lines[index].indent));
        } else {
          const keyValue = tail.match(/^([^:]+):(?:\s*(.*))?$/);
          if (keyValue && identifier.test(keyValue[1].trim())) {
            const item = {};
            const key = keyValue[1].trim(), rawValue = keyValue[2] ?? "";
            item[key] = rawValue ? scalar(rawValue, current.line) : null;
            if (!rawValue && index < lines.length && lines[index].indent > indent) item[key] = parseBlock(lines[index].indent);
            if (index < lines.length && lines[index].indent > indent) {
              const extra = parseBlock(lines[index].indent);
              if (Array.isArray(extra) || !extra || typeof extra !== "object") throw new Error(`${label}: list map item expected at line ${current.line}`);
              Object.assign(item, extra);
            }
            result.push(item);
          } else {
            result.push(scalar(tail, current.line));
            if (index < lines.length && lines[index].indent > indent) throw new Error(`${label}: scalar list item cannot have nested fields (line ${current.line})`);
          }
        }
      } else {
        const match = current.text.match(/^([^:]+):(?:\s*(.*))?$/);
        if (!match || !identifier.test(match[1].trim())) throw new Error(`${label}: invalid mapping key at line ${current.line}`);
        const key = match[1].trim(), rawValue = match[2] ?? "";
        if (Object.hasOwn(result, key)) throw new Error(`${label}: duplicate key '${key}' at line ${current.line}`);
        index += 1;
        if (rawValue) result[key] = scalar(rawValue, current.line);
        else if (index < lines.length && lines[index].indent > indent) result[key] = parseBlock(lines[index].indent);
        else result[key] = null;
      }
    }
    return result;
  }

  if (!lines.length) throw new Error(`${label}: empty document`);
  const result = parseBlock(lines[0].indent);
  if (index !== lines.length) throw new Error(`${label}: unsupported trailing content at line ${lines[index].line}`);
  return result;
}

export function yamlStrings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => yamlStrings(item, out));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => yamlStrings(item, out));
  return out;
}
