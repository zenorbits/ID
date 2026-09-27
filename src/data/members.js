import csv from './members.csv?raw';

// RFC 4180-style parser: handles quoted fields containing commas, quotes ("") and newlines.
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
};

const [header, ...records] = parseCsv(csv);
const keys = header.map((h) => h.trim());

export const members = records.map((cells) =>
  Object.fromEntries(keys.map((key, i) => [key, (cells[i] ?? '').trim()])),
);

export const getMemberById = (id) => members.find((m) => m.id === String(id));
