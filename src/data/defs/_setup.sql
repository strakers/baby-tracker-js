-- function for auto-updating modified fields
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

-- enum values for sex
CREATE TYPE sex AS ENUM ('XX', 'XY', 'XXY', 'XXX');

-- enum values for nursing sides
CREATE TYPE nursing_sides AS ENUM ('left', 'right');

-- complex type for person name
CREATE TYPE person_name AS (
  first      VARCHAR(50),
  middle     VARCHAR(50),
  last       VARCHAR(50)
);

-- function for retrieving full name from person
CREATE OR REPLACE FUNCTION full_name (person_name) 
RETURNS VARCHAR(150) AS $$
	SELECT concat_ws(' ', initcap($1.first), initcap($1.middle) , initcap($1.last));
$$ LANGUAGE sql;