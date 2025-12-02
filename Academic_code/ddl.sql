-- OSU CS340 Intro to Databases
-- Comicon vendor inventory tracker DB
-- PL/SQL to drop procedure
DROP PROCEDURE  IF EXISTS sp_load_comiconTrackerdb;
DELIMITER //
CREATE PROCEDURE sp_load_comiconTrackerdb()
BEGIN
    /* Disable commits and FK checks until end of file */
    SET FOREIGN_KEY_CHECKS = 0;
    SET AUTOCOMMIT = 0;
    DROP TABLE IF EXISTS Items, Vendors, Events, Inventories, VendorEvents;

    /*Create Tables*/

    -- CREATE Items Table
    CREATE TABLE Items(
        itemID INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        series VARCHAR(100),
        edition VARCHAR(50),
        imageURL VARCHAR(255),
        PRIMARY KEY (itemID)
    );

    -- CREATE Vendors Table
    CREATE TABLE Vendors(
        vendorID INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100),
        email VARCHAR(100) NOT NULL,
        rating DECIMAL(2,1),
        PRIMARY KEY (vendorID),
        CONSTRAINT rating_check CHECK (rating >= 0 AND rating <= 5),
        CONSTRAINT email_check UNIQUE (email)
    );

    -- CREATE Events Table
    CREATE TABLE Events (
        eventID INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        attendance INT,
        PRIMARY KEY (eventID)
    );

    -- CREATE Inventories Table
    CREATE TABLE Inventories (
        inventoryID INT AUTO_INCREMENT NOT NULL,
        vendorID INT NOT NULL,
        itemID INT NOT NULL,
        quantity INT NOT NULL,
        item_condition VARCHAR(50),
        price DECIMAL(8,2),
        PRIMARY KEY (inventoryID),
        FOREIGN KEY (vendorID) REFERENCES Vendors(vendorID) ON DELETE CASCADE,
        FOREIGN KEY (itemID) REFERENCES Items(itemID) ON DELETE CASCADE
    );

    -- CREATE VendorEvents Table
    CREATE TABLE VendorEvents (
        vendorID INT NOT NULL,
        eventID INT NOT NULL,
        boothNumber VARCHAR(10),
        PRIMARY KEY (vendorID, eventID),
        UNIQUE KEY unique_booth_per_event (eventID, boothNumber),
        FOREIGN KEY (vendorID) REFERENCES Vendors(vendorID) ON DELETE CASCADE,
        FOREIGN KEY (eventID) REFERENCES Events(eventID) ON DELETE CASCADE
    );


    /* Insert Example Data */

    -- INSERT data into Items
    INSERT INTO Items (itemID, name, category, series, edition, imageURL) VALUES
        (1, 'Amazing Spider-Man #300', 'Comic Book', 'Amazing Spider-Man', 'First Print', 'https://storage.googleapis.com/images.pricecharting.com/c31a9ef36b24b32be9d26b3a840cd24f1cbcf72f82a345d8f8c26492fb90a3fe/1600.jpg'),
        (2, 'Black Lotus', 'Trading Card', 'Magic: The Gathering', 'Alpha Edition', 'https://tcgplayer-cdn.tcgplayer.com/product/1042_in_1000x1000.jpg'),
        (3, 'Charizard', 'Trading Card', 'Pokemon', 'Base Set', 'https://tcgplayer-cdn.tcgplayer.com/product/42382_in_1000x1000.jpg'),
        (4, 'Batman: The Dark Knight Returns #1', 'Comic Book', 'Batman', 'First Edition', 'https://m.media-amazon.com/images/I/71JGiMGuZuL._UF1000,1000_QL80_.jpg'),
        (5, 'X-Men #1 (1991)', 'Comic Book', 'X-Men', 'Special Edition', 'https://m.media-amazon.com/images/I/A1tjqv4djIL._AC_UF1000,1000_QL80_.jpg');

    -- INSERT data into Vendors
    INSERT INTO Vendors (vendorID, name, city, email, rating) VALUES
        (1, 'Comic Freaks', 'Portland', 'contact@comicfreaks.com', 4.5),
        (2, 'TCG Dudes', 'Seattle', 'info@tcgdudes.com', 4.8),
        (3, 'Retro Collectibles', 'Eugene', 'sales@retrocollectibles.com', 4.1),
        (4, 'PokePpl', 'Corvallis', 'hello@pokeppl.com', 4.9),
        (5, 'Card Central', 'Portland', 'info@cardcentral.com', 4.7);

    -- INSERT data into Events
    INSERT INTO Events (eventID, name, location, date, attendance) VALUES
        (1, 'Portland Comic-Con', 'Oregon Convention Center', '2025-07-15', 45000),
        (2, 'Emerald City Comic Con', 'Seattle Convention Center', '2025-03-20', 95000),
        (3, 'Rose City Comic Con', 'Portland Expo Center', '2025-09-12', 30000),
        (4, 'TCG Cards/Collectibles Show', 'Josephine County Fairgrounds', '2025-11-23', NULL),
        (5, 'A Very Poke Christmas', 'Ashland Hills Hotel & Suites', '2025-12-23', NULL);

    -- INSERT data into Inventories
    INSERT INTO Inventories (inventoryID, vendorID, itemID, quantity, item_condition, price) VALUES
        (1, 1, 1, 1, 'CGC 9.8', 2500.00),
        (2, 1, 1, 2, 'CGC 9.2', 500.00),
        (3, 1, 3, 4, 'PSA 9', 2500.00),
        (4, 2, 2, 1, 'Good', 15000.00),
        (5, 2, 3, 3, 'Lightly Played', 250.00),
        (6, 3, 1, 1, 'CGC 8.0', 375.00),
        (7, 4, 3, 1, 'PSA 10', 9500.00),
        (8, 5, 4, 2, 'CGC 9.8', 800.00);

    -- INSERT data into VendorEvents
    INSERT INTO VendorEvents (vendorID, eventID, boothNumber) VALUES
        (1, 1, 'A-12'),
        (1, 3, '31'),
        (2, 2, 'C-45'),
        (2, 4, 'A-03'),
        (3, 1, 'D-22'),
        (4, 5, '5'),
        (5, 1, 'A-17');


    /* Re-enables commits and FK checks */
    SET FOREIGN_KEY_CHECKS = 1;
    COMMIT;
END //


DELIMITER ;
-- CALL sp_load_comiconTrackerdb()

/******Citations*******/
-- All work is based of course material from CS 340