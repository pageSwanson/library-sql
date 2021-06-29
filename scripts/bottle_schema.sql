DROP TABLE IF EXISTS bottle_info;

CREATE TABLE
IF NOT EXISTS
'bottle_info' (
    id INTEGER PRIMARY KEY,
    color TEXT,
    material TEXT,
    volume_milliliters REAL,
    manufactured_where TEXT
);

INSERT INTO bottle_info
(id, color, material, volume_milliliters, manufactured_where)
VALUES
(1, 'green', 'glass', 1000, 'US'),
(2, 'blue', 'glass', 600, 'IT'),
(3, null, 'plastic', 400, 'US'),
(4, 'brown', 'plastic', 500, 'MX');
