-- Do not delete this table
DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

-- Your schema DDL (create table statements etc.) goes below here 

DROP TABLE IF EXISTS posts CASCADE;
CREATE TABLE posts(id UUID UNIQUE PRIMARY KEY DEFAULT, data jsonb)

DROP TABLE IF EXISTS friends CASCADE
CREATE TABLE friends(id UUID UNIQUE PRIMARY KEY DEFAULT, data jsonb, data jsonb)
