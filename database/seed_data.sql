INSERT INTO users (name,email,role)
VALUES
('Ahmed','ahmed@ensa.ma','etudiant'),
('Sara','sara@ensa.ma','etudiant');

INSERT INTO signalements (title,description,location,status,user_id)
VALUES
('Lumière allumée','Salle vide avec lumière allumée','Salle B12','nouveau',1),
('Fuite d eau','Robinet qui fuit','Bloc C','en_cours',2);

INSERT INTO suggestions (suggestion_text,signalement_id)
VALUES
('Installer capteurs de mouvement pour les lumières',1),
('Réparer le robinet pour éviter le gaspillage',2);