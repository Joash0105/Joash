CREATE TABLE IF NOT EXISTS `location`(
    id serial,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    INDEX (country)
);

CREATE TABLE IF NOT EXISTS `hospitals`(
    id serial,
    location_id BIGINT UNSIGNED NOT NULL,
    hospital_name VARCHAR(100),
    INDEX (location_id),
    FOREIGN KEY (location_id) REFERENCES `location`(id)
);

CREATE TABLE IF NOT EXISTS `doctors`(
    id serial,
    hospital_id BIGINT UNSIGNED NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    INDEX (hospital_id),
    INDEX (first_name),
    INDEX (last_name),
    FOREIGN KEY (hospital_id) REFERENCES `hospitals`(id)
);

CREATE TABLE IF NOT EXISTS `patients`(
    id serial,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100) NOT NULL,
    INDEX (first_name),
    INDEX (last_name)
);

CREATE TABLE IF NOT EXISTS `appointments`(
    id serial,
    doctor_id BIGINT UNSIGNED NOT NULL,
    patient_id BIGINT UNSIGNED NOT NULL,
    datetime datetime NOT NULL,
    is_booked enum('AVAILABLE', 'BOOKED', 'CANCELLED') DEFAULT 'AVAILABLE',
    INDEX (doctor_id),
    INDEX (patient_id),
    FOREIGN KEY (doctor_id) REFERENCES `doctors`(id),
    FOREIGN KEY (patient_id) REFERENCES `patients`(id)
);