DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
-- This will drop/delete the tables every time you run the schema.sql file, ensuring that you start with a clean slate.

-- Creating parties table
CREATE TABLE parties (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
    -- TEXT can store much longer strings rather than VARCHAR
    -- TEXT uses max space when used, so becareful always using it
);

-- Constraint relies on parties TABLE being made first so order must be right
-- Creating candidates table
CREATE TABLE candidates (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    party_id INTEGER,
    industry_connected BOOLEAN NOT NULL,
    CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
    -- party_id is a foreign key that refers to parties table 'id', if a party is deleted, it is set to NULL
);