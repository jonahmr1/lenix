-- ============================================================
--  PROJET 10 : Mini Pizzeria
--  Base de données MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS mini_pizzeria
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE mini_pizzeria;

-- ------------------------------------------------------------
-- Table : utilisateur (administrateur)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS utilisateur (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255)       NOT NULL,
    created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- Compte admin par défaut  (mot de passe : admin123)
INSERT INTO utilisateur (nom, email, mot_de_passe)
VALUES ('Administrateur', 'admin@pizzeria.dz', SHA2('admin123', 256));

-- ------------------------------------------------------------
-- Table : pizza
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pizza (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(150)        NOT NULL,
    taille        ENUM('Petite','Moyenne','Grande') NOT NULL DEFAULT 'Moyenne',
    prix          DECIMAL(8,2)        NOT NULL CHECK (prix > 0),
    disponible    TINYINT(1)          NOT NULL DEFAULT 1,
    created_at    TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- Données de test
INSERT INTO pizza (nom, taille, prix, disponible) VALUES
    ('Margherita',    'Petite',  800.00,  1),
    ('Margherita',    'Moyenne', 1200.00, 1),
    ('Margherita',    'Grande',  1600.00, 1),
    ('4 Fromages',    'Moyenne', 1400.00, 1),
    ('4 Fromages',    'Grande',  1800.00, 1),
    ('Reine',         'Moyenne', 1300.00, 1),
    ('Reine',         'Grande',  1700.00, 1),
    ('Chorizo',       'Moyenne', 1500.00, 1),
    ('Chorizo',       'Grande',  1900.00, 1),
    ('Végétarienne',  'Moyenne', 1200.00, 1),
    ('Végétarienne',  'Grande',  1600.00, 0);

-- ------------------------------------------------------------
-- Table : client
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS client (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100)    NOT NULL,
    prenom      VARCHAR(100)    NOT NULL,
    telephone   VARCHAR(20)     NOT NULL,
    created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- Données de test
INSERT INTO client (nom, prenom, telephone) VALUES
    ('Benali',  'Youssef',  '0550123456'),
    ('Hadj',    'Amira',    '0661234567'),
    ('Meziane', 'Karim',    '0770987654');

-- ------------------------------------------------------------
-- Table : commande
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS commande (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    date_commande   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total           DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    statut          ENUM('en_cours','terminee','annulee') NOT NULL DEFAULT 'en_cours',
    client_id       INT             NOT NULL,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commande_client
        FOREIGN KEY (client_id) REFERENCES client(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- Table : detail_commande
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS detail_commande (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    commande_id     INT             NOT NULL,
    pizza_id        INT             NOT NULL,
    quantite        INT             NOT NULL DEFAULT 1 CHECK (quantite > 0),
    prix_unitaire   DECIMAL(8,2)    NOT NULL,
    CONSTRAINT fk_detail_commande
        FOREIGN KEY (commande_id) REFERENCES commande(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detail_pizza
        FOREIGN KEY (pizza_id) REFERENCES pizza(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ------------------------------------------------------------
-- Vue : facture (commande + détails + client)
-- Utile pour l'affichage des factures
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vue_facture AS
SELECT
    c.id                AS commande_id,
    c.date_commande,
    c.total,
    c.statut,
    cl.id               AS client_id,
    cl.nom              AS client_nom,
    cl.prenom           AS client_prenom,
    cl.telephone,
    dc.id               AS detail_id,
    p.nom               AS pizza_nom,
    p.taille            AS pizza_taille,
    dc.quantite,
    dc.prix_unitaire,
    (dc.quantite * dc.prix_unitaire) AS sous_total
FROM commande c
JOIN client        cl ON cl.id = c.client_id
JOIN detail_commande dc ON dc.commande_id = c.id
JOIN pizza         p  ON p.id  = dc.pizza_id;

-- ------------------------------------------------------------
-- Vue : statistiques des ventes par pizza
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW vue_stats_pizza AS
SELECT
    p.nom,
    p.taille,
    SUM(dc.quantite)                    AS total_vendues,
    SUM(dc.quantite * dc.prix_unitaire) AS chiffre_affaires
FROM detail_commande dc
JOIN pizza p ON p.id = dc.pizza_id
GROUP BY p.id, p.nom, p.taille
ORDER BY total_vendues DESC;
