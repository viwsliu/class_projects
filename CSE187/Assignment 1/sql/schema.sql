-- Do not delete this table
DROP TABLE IF EXISTS member CASCADE;
CREATE TABLE member(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), data jsonb);

-- Your schema DDL (create table statements etc.) goes below here 

-- posts
-- list of friends 
--  friend requests