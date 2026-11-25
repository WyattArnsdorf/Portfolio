-- Stored Procedures for Comic-Con Vendor Tracker Database
-- This file contains all PL/SQL procedures for CREATE, UPDATE, DELETE, and RESET operations
-- Authors: Brian Merritt and Wyatt Arnsdorf (with AI assistance, see citation)
-- Date: 12/07/2025

/*
 * Citation: Stored procedures authored by Brian Merritt and Wyatt Arnsdorf
 * Based on CS 340 course materials and MySQL documentation
 *
 * Citation for AI Assistance:
 * Date: 12/01/2025
 * AI Tool: Claude (Anthropic)
 * Source URL: https://claude.ai/
 * Prompt used:
 *   - "Wyatt created stored procedures for Inventories CUD operations. Help me adapt
 *      this pattern and implement the same stored procedure structure for Items, Vendors,
 *      Events, and VendorEvents entities."
 * AI assistance used for: Replicating the stored procedure pattern across all entities,
 * maintaining consistent parameter naming conventions, and handling the composite key
 * syntax for VendorEvents procedures
 * Original work: Brian adapted this pattern for the
 * remaining four entities. Procedure logic for DeleteSpiderMan300, parameter selection, and integration
 * with database schema designed by the team.
 *
 * Citation for AI Assistance:
 * Date: 12/07/2025
 * AI Tool: Microsoft Copilot
 * Source URLs: https://copilot.microsoft.com/
 * Prompts used:
 *   - "What if I wanted to implement the sql into stored procedures?"
 * AI assistance used for: Adapting stored procedures for CUD operations to our database schema.
 * Original work: All database schema design, entity-specific
 * query logic, relationship implementations, and integration with frontend forms
 */

/****** ITEMS CUD ******/

-- CREATE Items SP
DROP PROCEDURE IF EXISTS sp_create_items;
DELIMITER //
CREATE PROCEDURE sp_create_items (
    IN p_name VARCHAR(100),
    IN p_category VARCHAR(50),
    IN p_series VARCHAR(100),
    IN p_edition VARCHAR(50),
    IN p_imageURL VARCHAR(255)
)
BEGIN
    INSERT INTO Items (name, category, series, edition, imageURL)
    VALUES (p_name, p_category, p_series, p_edition, p_imageURL);
END //
DELIMITER ;

-- UPDATE Items SP
DROP PROCEDURE IF EXISTS sp_update_items;
DELIMITER //
CREATE PROCEDURE sp_update_items (
    IN p_itemID INT,
    IN p_name VARCHAR(100),
    IN p_category VARCHAR(50),
    IN p_series VARCHAR(100),
    IN p_edition VARCHAR(50),
    IN p_imageURL VARCHAR(255)
)
BEGIN
    UPDATE Items
    SET name = p_name,
        category = p_category,
        series = p_series,
        edition = p_edition,
        imageURL = p_imageURL
    WHERE itemID = p_itemID;
END //
DELIMITER ;

-- DELETE Items SP
DROP PROCEDURE IF EXISTS sp_delete_items;
DELIMITER //
CREATE PROCEDURE sp_delete_items (
    IN p_itemID INT
)
BEGIN
    DELETE FROM Items WHERE itemID = p_itemID;
END //
DELIMITER ;

/****** VENDORS CUD ******/

-- CREATE Vendors SP
DROP PROCEDURE IF EXISTS sp_create_vendors;
DELIMITER //
CREATE PROCEDURE sp_create_vendors (
    IN p_name VARCHAR(100),
    IN p_city VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_rating DECIMAL(2,1)
)
BEGIN
    INSERT INTO Vendors (name, city, email, rating)
    VALUES (p_name, p_city, p_email, p_rating);
END //
DELIMITER ;

-- UPDATE Vendors SP
DROP PROCEDURE IF EXISTS sp_update_vendors;
DELIMITER //
CREATE PROCEDURE sp_update_vendors (
    IN p_vendorID INT,
    IN p_name VARCHAR(100),
    IN p_city VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_rating DECIMAL(2,1)
)
BEGIN
    UPDATE Vendors
    SET name = p_name,
        city = p_city,
        email = p_email,
        rating = p_rating
    WHERE vendorID = p_vendorID;
END //
DELIMITER ;

-- DELETE Vendors SP
DROP PROCEDURE IF EXISTS sp_delete_vendors;
DELIMITER //
CREATE PROCEDURE sp_delete_vendors (
    IN p_vendorID INT
)
BEGIN
    DELETE FROM Vendors WHERE vendorID = p_vendorID;
END //
DELIMITER ;

/****** EVENTS CUD ******/

-- CREATE Events SP
DROP PROCEDURE IF EXISTS sp_create_events;
DELIMITER //
CREATE PROCEDURE sp_create_events (
    IN p_name VARCHAR(100),
    IN p_location VARCHAR(100),
    IN p_date DATE,
    IN p_attendance INT
)
BEGIN
    INSERT INTO Events (name, location, date, attendance)
    VALUES (p_name, p_location, p_date, p_attendance);
END //
DELIMITER ;

-- UPDATE Events SP
DROP PROCEDURE IF EXISTS sp_update_events;
DELIMITER //
CREATE PROCEDURE sp_update_events (
    IN p_eventID INT,
    IN p_name VARCHAR(100),
    IN p_location VARCHAR(100),
    IN p_date DATE,
    IN p_attendance INT
)
BEGIN
    UPDATE Events
    SET name = p_name,
        location = p_location,
        date = p_date,
        attendance = p_attendance
    WHERE eventID = p_eventID;
END //
DELIMITER ;

-- DELETE Events SP
DROP PROCEDURE IF EXISTS sp_delete_events;
DELIMITER //
CREATE PROCEDURE sp_delete_events (
    IN p_eventID INT
)
BEGIN
    DELETE FROM Events WHERE eventID = p_eventID;
END //
DELIMITER ;

/****** INVENTORIES CUD ******/

-- CREATE Inventories SP
DROP PROCEDURE IF EXISTS sp_create_inventories;
DELIMITER //
CREATE PROCEDURE sp_create_inventories (
    IN p_vendorID INT,
    IN p_itemID INT,
    IN p_quantity INT,
    IN p_condition VARCHAR(50),
    IN p_price DECIMAL(8,2)
)
BEGIN
    INSERT INTO Inventories (vendorID, itemID, quantity, item_condition, price)
    VALUES (p_vendorID, p_itemID, p_quantity, p_condition, p_price);
END //
DELIMITER ;

-- UPDATE Inventories SP
DROP PROCEDURE IF EXISTS sp_update_inventories;
DELIMITER //
CREATE PROCEDURE sp_update_inventories (
    IN p_inventoryID INT,
    IN p_vendorID INT,
    IN p_itemID INT,
    IN p_quantity INT,
    IN p_condition VARCHAR(50),
    IN p_price DECIMAL(8,2)
)
BEGIN
    UPDATE Inventories
    SET vendorID = p_vendorID,
        itemID = p_itemID,
        quantity = p_quantity,
        item_condition = p_condition,
        price = p_price
    WHERE inventoryID = p_inventoryID;
END //
DELIMITER ;

-- DELETE Inventories SP
DROP PROCEDURE IF EXISTS sp_delete_inventories;
DELIMITER //
CREATE PROCEDURE sp_delete_inventories (
    IN p_inventoryID INT
)
BEGIN
    DELETE FROM Inventories WHERE inventoryID = p_inventoryID;
END //
DELIMITER ;

/****** VENDOR EVENTS CUD ******/

-- CREATE VendorEvents SP
DROP PROCEDURE IF EXISTS sp_create_vendorevents;
DELIMITER //
CREATE PROCEDURE sp_create_vendorevents (
    IN p_vendorID INT,
    IN p_eventID INT,
    IN p_boothNumber VARCHAR(10)
)
BEGIN
    INSERT INTO VendorEvents (vendorID, eventID, boothNumber)
    VALUES (p_vendorID, p_eventID, p_boothNumber);
END //
DELIMITER ;

-- UPDATE VendorEvents SP
DROP PROCEDURE IF EXISTS sp_update_vendorevents;
DELIMITER //
CREATE PROCEDURE sp_update_vendorevents (
    IN p_vendorID INT,
    IN p_eventID INT,
    IN p_boothNumber VARCHAR(10)
)
BEGIN
    UPDATE VendorEvents
    SET boothNumber = p_boothNumber
    WHERE vendorID = p_vendorID AND eventID = p_eventID;
END //
DELIMITER ;

-- DELETE VendorEvents SP
DROP PROCEDURE IF EXISTS sp_delete_vendorevents;
DELIMITER //
CREATE PROCEDURE sp_delete_vendorevents (
    IN p_vendorID INT,
    IN p_eventID INT
)
BEGIN
    DELETE FROM VendorEvents
    WHERE vendorID = p_vendorID AND eventID = p_eventID;
END //
DELIMITER ;

/****** RESET DATABASE ******/

-- Procedure to delete Spider-Man #300 (for demo purposes)
DROP PROCEDURE IF EXISTS DeleteSpiderMan300;
DELIMITER //
CREATE PROCEDURE DeleteSpiderMan300()
BEGIN
    DELETE FROM Items WHERE itemID = 1;
END //
DELIMITER ;