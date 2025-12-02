-- Additional Stored Procedures for Comic-Con Vendor Tracker

-- Procedure to delete Spider-Man #300 (for RESET demo)
DROP PROCEDURE IF EXISTS DeleteSpiderMan300;

DELIMITER //

CREATE PROCEDURE DeleteSpiderMan300()
BEGIN
    DELETE FROM Items WHERE itemID = 1;
END //

DELIMITER ;

/******Citations*******/
-- All work is based of course material from CS 340