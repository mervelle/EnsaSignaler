INSERT INTO users (name, email, apogee_code, role)
VALUES 
('Marwa', 'Marwa@ensa.ma', '12345678', 'etudiante'),
('Rahma', 'Rahma@ensa.ma', '87654321', 'etudiante'),
('Salma', 'Salma@ensa.ma', '22254321', 'etudiante'),
('Hafssa', 'Hafssa@ensa.ma', '33354321', 'etudiante');

INSERT INTO signalements (title,description,location,status,user_id)
VALUES
INSERT INTO signalements (title, description, location, apogee, status, user_id)
VALUES 
('Lumière allumée', 'Salle vide avec lumière allumée', 'Salle B12', '12345678', 'nouveau', 1),
('Fuite d eau', 'Robinet qui fuit', 'Bloc C', '87654321', 'nouveau', 2);

INSERT INTO suggestions (suggestion_text,signalement_id)
VALUES
('Installer capteurs de mouvement pour les lumières',1),
('Réparer le robinet pour éviter le gaspillage',2);