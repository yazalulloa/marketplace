CREATE TABLE IF NOT EXISTS rates
(
    id            BIGINT PRIMARY KEY,
    from_currency TEXT            NOT NULL,
    to_currency   TEXT            NOT NULL,
    rate          DECIMAL(16, 12) NOT NULL,
    source        TEXT            NOT NULL,
    date_of_rate  DATE            NOT NULL,
    date_of_file  DATE            NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    etag          varchar(20),
    last_modified varchar(40)
);

CREATE TABLE IF NOT EXISTS categories
(
    id          INTEGER AUTO_INCREMENT PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url   TEXT NOT NULL,
    status      TEXT NOT NULL
);