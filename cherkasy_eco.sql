drop database if exists cherkasy_env_monitoring;
create database cherkasy_env_monitoring;

use cherkasy_env_monitoring;
CREATE TABLE object (
  object_id int PRIMARY KEY auto_increment,
  name char(128) NOT NULL unique,
  activity varchar(256) NOT NULL,
  address char(128) NOT NULL
);
CREATE TABLE pollutant (
	pollutant_code int PRIMARY KEY auto_increment,
    pollutant_name char(128) NOT NULL unique,
    gdk decimal NOT NULL
);
CREATE TABLE pollution (
	pollution_id int auto_increment,
	object_id int,
	pollutant_code int,
    pollutant_value float,
	date YEAR NOT NULL,
    FOREIGN KEY (object_id) REFERENCES object (object_id),
    FOREIGN KEY (pollutant_code) REFERENCES pollutant (pollutant_code),
    primary key(pollution_id, object_id, pollutant_code)
);

create table pollutant_concentration (
	concentration_id int auto_increment,
    object_id int,
    pollutant_code int,
    concentration_value float,
	FOREIGN KEY (object_id) REFERENCES object (object_id),
    FOREIGN KEY (pollutant_code) REFERENCES pollutant(pollutant_code),
    primary key(concentration_id, object_id, pollutant_code)
);

-- SET FOREIGN_KEY_CHECKS=OFF; 
DELETE FROM pollutant WHERE pollutant_code = 4;
-- insert into object(name, activity, address) VALUES ('Object 1', 'Activity 1', 'Address 1'),
	-- ('Object 2', 'Activity 2', 'Address 2');
select * from object;
select * from pollution where pollution_id = 2;

select * from pollutant_concentration;
-- drop database cherkasy_env_monitoring;