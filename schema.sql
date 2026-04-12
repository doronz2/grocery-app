CREATE TABLE IF NOT EXISTS history (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  date      TEXT    NOT NULL,
  items     TEXT    NOT NULL, -- JSON array of formatted strings
  amounts   TEXT    NOT NULL  -- JSON object with all category amounts
);
