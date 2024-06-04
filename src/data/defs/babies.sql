CREATE TABLE IF NOT EXISTS babies (
  id          BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name        person_name NOT NULL,
  birthdate   DATE NOT NULL,
  sex         sex NULL
);