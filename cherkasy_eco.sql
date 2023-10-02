create database cherkasy_env_monitoring;

use cherkasy_env_monitoring;
CREATE TABLE object (
  object_id int PRIMARY KEY auto_increment,
  name char(32) NOT NULL,
  activity TEXT(256) NOT NULL,
  address char(32) NOT NULL
);
CREATE TABLE pollutant (
	pollutant_code int PRIMARY KEY auto_increment,
    pollutant_name char(32) NOT NULL,
    gdk float(3) NOT NULL
);
CREATE TABLE pollution (
	pollution_id int PRIMARY KEY auto_increment,
	object_id int,
	pollutant_code int,
    pollutant_value float(3),
	date YEAR NOT NULL,
    FOREIGN KEY (object_id) REFERENCES object (object_id),
    FOREIGN KEY (pollutant_code) REFERENCES pollutant (pollutant_code)
);

insert into object(name, activity, address) VALUES ('Object 1', 'Activity 1', 'Address 1'),
	('Object 2', 'Activity 2', 'Address 2');
select * from object;
drop database cherkasy_env_monitoring;