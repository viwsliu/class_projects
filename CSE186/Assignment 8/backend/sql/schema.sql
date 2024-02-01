--
-- All SQL statements must be on a single line and end in a semicolon.
--

DROP TABLE IF EXISTS USERINFO;
DROP TABLE IF EXISTS mailbox;
DROP TABLE IF EXISTS mail;
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);
-- table for user and ensure can login
  -- id, name, email, hashed passwords
CREATE TABLE USERINFO(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(64), email VARCHAR(64), userpassword VARCHAR(64));

-- table for user's mailboxes
 -- id, name, user's id
CREATE TABLE mailbox(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(64), userinfo_id UUID);-- FOREIGN KEY (userinfo_id) REFERENCES USERINFO (id));
-- table for user mail
 -- id, to, from, content, subject, date, mailbox's id
CREATE TABLE mail(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), mailbox_id UUID, email jsonb);

-- Your database schema goes here --
