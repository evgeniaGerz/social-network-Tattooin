DROP TABLE IF EXISTS friendship;

CREATE TABLE friendship (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    accepted BOOLEAN DEFAULT false NOT NULL
);
