-- ITEMS TABLE

-- Browse all items
SELECT itemID, name, category, series, edition, imageURL
FROM Items
ORDER BY name;

-- Get single item by ID for Update form
SELECT itemID, name, category, series, edition, imageURL
FROM Items
WHERE itemID = @itemIDInput;

-- Add new item
INSERT INTO Items (name, category, series, edition, imageURL)
VALUES (@nameInput, @categoryInput, @seriesInput, @editionInput, @imageURLInput);

-- Update existing item
UPDATE Items
SET name = @nameInput,
    category = @categoryInput,
    series = @seriesInput,
    edition = @editionInput,
    imageURL = @imageURLInput
WHERE itemID = @itemIDInput;

-- Delete item
DELETE FROM Items
WHERE itemID = @itemIDInput;


-- VENDORS TABLE

-- Browse all vendors
SELECT vendorID, name, city, email, rating
FROM Vendors
ORDER BY name;

-- Get single vendor by ID for Update form
SELECT vendorID, name, city, email, rating
FROM Vendors
WHERE vendorID = @vendorIDInput;

-- Add new vendor
INSERT INTO Vendors (name, city, email, rating)
VALUES (@nameInput, @cityInput, @emailInput, @ratingInput);

-- Update existing vendor
UPDATE Vendors
SET name = @nameInput,
    city = @cityInput,
    email = @emailInput,
    rating = @ratingInput
WHERE vendorID = @vendorIDInput;

-- Delete vendor
DELETE FROM Vendors
WHERE vendorID = @vendorIDInput;


-- EVENTS TABLE

-- Browse all events
SELECT eventID, name, location, date, attendance
FROM Events
ORDER BY date DESC;

-- Get single event by ID for Update form
SELECT eventID, name, location, date, attendance
FROM Events
WHERE eventID = @eventIDInput;

-- Add new event
INSERT INTO Events (name, location, date, attendance)
VALUES (@nameInput, @locationInput, @dateInput, @attendanceInput);

-- Update existing event
UPDATE Events
SET name = @nameInput,
    location = @locationInput,
    date = @dateInput,
    attendance = @attendanceInput
WHERE eventID = @eventIDInput;

-- Delete event
DELETE FROM Events
WHERE eventID = @eventIDInput;


-- INVENTORIES TABLE

-- Browse all inventory with vendor and item names
SELECT
    inv.inventoryID,
    inv.vendorID,
    inv.itemID,
    v.name AS vendorName,
    i.name AS itemName,
    inv.quantity,
    inv.item_condition,
    inv.price
FROM Inventories inv
INNER JOIN Vendors v ON inv.vendorID = v.vendorID
INNER JOIN Items i ON inv.itemID = i.itemID
ORDER BY v.name, i.name;

-- Get single inventory record by ID for Update form
SELECT inventoryID, vendorID, itemID, quantity, item_condition, price
FROM Inventories
WHERE inventoryID = @inventoryIDInput;

-- Add new inventory record
INSERT INTO Inventories (vendorID, itemID, quantity, item_condition, price)
VALUES (@vendorIDInput, @itemIDInput, @quantityInput, @conditionInput, @priceInput);

-- Update existing inventory record
UPDATE Inventories
SET vendorID = @vendorIDInput,
    itemID = @itemIDInput,
    quantity = @quantityInput,
    item_condition = @conditionInput,
    price = @priceInput
WHERE inventoryID = @inventoryIDInput;

-- Delete inventory record
DELETE FROM Inventories
WHERE inventoryID = @inventoryIDInput;

-- Get all vendors for dropdown
SELECT vendorID, name
FROM Vendors
ORDER BY name;

-- Get all items for dropdown
SELECT itemID, name
FROM Items
ORDER BY name;


-- VENDOREVENTS TABLE

-- Browse all vendor-event relationships
SELECT
    ve.vendorID,
    ve.eventID,
    v.name AS vendorName,
    e.name AS eventName,
    e.date AS eventDate,
    ve.boothNumber
FROM VendorEvents ve
INNER JOIN Vendors v ON ve.vendorID = v.vendorID
INNER JOIN Events e ON ve.eventID = e.eventID
ORDER BY e.date DESC, v.name;

-- Get single vendor-event record for Update form
SELECT vendorID, eventID, boothNumber
FROM VendorEvents
WHERE vendorID = @vendorIDInput AND eventID = @eventIDInput;

-- Add vendor to event
INSERT INTO VendorEvents (vendorID, eventID, boothNumber)
VALUES (@vendorIDInput, @eventIDInput, @boothNumberInput);

-- Update vendor-event booth number
UPDATE VendorEvents
SET vendorID = @vendorIDInput_new,
    eventID = @eventIDInput_new,
    boothNumber = @boothNumberInput
WHERE vendorID = @vendorIDInput_old AND eventID = @eventIDInput_old;

-- Remove vendor from event
DELETE FROM VendorEvents
WHERE vendorID = @vendorIDInput AND eventID = @eventIDInput;

-- Get all vendors for dropdown
SELECT vendorID, name
FROM Vendors
ORDER BY name;

-- Get all events for dropdown
SELECT eventID, name, date
FROM Events
ORDER BY date DESC;

/******Citations*******/
-- All work is based of course material from CS 340