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
    gdk float,
    danger_class int,
    tax_rate float
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

create table risks (
	risk_id int auto_increment,
    concentration_id int,
    add_ladd float,
    cr float,
    pcr float,
    hq float,
    FOREIGN KEY (concentration_id) REFERENCES pollutant_concentration(concentration_id),
    primary key(risk_id, concentration_id)
);

create table excessive_emission (
	excessive_emission_id int auto_increment,
    concentration_id int,
    mass float,
    a float,
    kt float,
    kzi float,
    z float,
    FOREIGN KEY (concentration_id) REFERENCES pollutant_concentration(concentration_id),
    primary key(excessive_emission_id, concentration_id)
);


DELIMITER //
CREATE TRIGGER create_excessive_emission_on_concentration_insert
AFTER INSERT ON pollutant_concentration
FOR EACH ROW
BEGIN
  INSERT INTO excessive_emission (concentration_id, mass, a, kt, kzi, z)
  VALUES (NEW.concentration_id, 0, 0, 0, 0, 0);
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER create_risks_on_concentration_insert
AFTER INSERT ON pollutant_concentration
FOR EACH ROW
BEGIN
  INSERT INTO risks (concentration_id, add_ladd, cr, pcr, hq)
  VALUES (NEW.concentration_id, 0, 0, 0, 0);
END;
//
DELIMITER ;
select * from risks;
-- SET FOREIGN_KEY_CHECKS=OFF; 

select * from object;

select * from pollutant_concentration;
