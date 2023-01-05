INSERT INTO `location` (`city`, `state`, `country`)
VALUES ('Cagayan de Oro', 'Misamis Oriental', 'Philippines');

INSERT INTO `hospitals` (`location_id`, `hospital_name`)
SELECT loc.id, 'Madonna Hospital' FROM `location` as loc WHERE loc.city = 'Cagayan de Oro' LIMIT 1;

INSERT INTO `doctors` (`hospital_id`, `first_name`, `last_name`, `specialty`, `phone_number`, `email`)
SELECT hos.id, 'John', 'Doe', 'Neurology', '09068885455', 'johndoe@gmail.com' FROM `hospitals` as hos WHERE hos.hospital_name = 'Madonna Hospital' LIMIT 1;

INSERT INTO `patients` (`first_name`, `last_name`, `phone_number`)
VALUES ('Andrew', 'Rodriguez', '09114876453');

INSERT INTO `appointments` (`doctor_id`, `patient_id`, `datetime`, `is_booked`)
SELECT doc.id, pat.id, '2022-01-01 03:14:07', 'BOOKED' FROM `doctors` as doc, `patients` as pat WHERE doc.first_name = 'John' AND doc.last_name = 'Doe' AND pat.first_name = 'Andrew' AND pat.last_name = 'Rodriguez' LIMIT 1;