/*
 * Citation for Base Server Structure:
 * Date: 11/07/2025
 * Adapted from: CS340 Activity 2 starter code
 * Source: CS 340 course materials, Oregon State University
 *
 * Citation for AI Assistance:
 * Date: 11/07/2025, 12/01/2025
 * AI Tool: Claude (Anthropic)
 * Source URLs: https://claude.ai/
 * Prompts used:
 *   - "reorganize these routes by entity with clear section headers"
 *   - "whats the correct syntax for calling a MySQL stored procedure with parameters?"
 *   - "Debug this: Cannot set headers after they are sent to the client"
 *   - "show me how to convert this INSERT query to a CALL statement"
 *   - "check out my parnter's code for inventory CUD using SP. adapt it and implement for all tables"
 * AI assistance used for: Route organization pattern, stored procedure CALL syntax,
 * composite key route patterns (:vendorID/:eventID), async/await error handling,
 * and HTTP status code best practices
 * Original work: All database schema design, entity-specific
 * query logic, relationship implementations, and integration with frontend forms
 *
 * Citation for AI Assistance:
 * Date: 11/07/2025, 12/07/2025
 * AI Tool: Microsoft Copilot
 * Source URLs: https://copilot.microsoft.com/
 * Prompts used:
 *   - "What i am looking for is to understand how to add more route handlers
 *      and stuff as I need to add more CRUD/CUD operations to the pages on our website."
 *   - "Yes, lets start with items. I need to add a create (post) route that
 *      interacts with our actual database."
 *   - "I am a little concerned with the ?, can you explain this?"
 * AI assistance used for: Route organization pattern, stored procedure CALL syntax,
 * async/await error handling.
 * Original work: All database schema design, entity-specific
 * query logic, relationship implementations, and integration with frontend forms/
 */

const express = require('express');
const path = require('path');
const app = express();

// Import database connection
const db = require('./db-connector');

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, images, etc.)
app.use(express.static(__dirname));

/******* HOME PAGE *******/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/******* ITEMS PAGE *******/

// Get items HTML page
app.get('/items.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'items.html'));
});

// SELECT from Items
app.get('/api/items', async (req, res) => {
    try {
        const query = 'SELECT itemID, name, category, series, edition, imageURL FROM Items ORDER BY name;';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Error loading items" });
    }
});

// CREATE Item (using stored procedure)
app.post('/api/items', async (req, res) => {
    const { name, category, series, edition, imageURL } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_create_items(?, ?, ?, ?, ?);',
            [name, category, series, edition, imageURL]
        );
        res.status(201).json({ message: "Item created successfully" });
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Error creating item" });
    }
});

// UPDATE Item (using stored procedure)
app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, category, series, edition, imageURL } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_update_items(?, ?, ?, ?, ?, ?);',
            [id, name, category, series, edition, imageURL]
        );
        res.json({ message: "Item updated successfully" });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Error updating item" });
    }
});

// DELETE Item (using stored procedure)
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'CALL sp_delete_items(?);',
            [id]
        );
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Error deleting item" });
    }
});

/******* VENDORS PAGE *******/

// Get vendors HTML page
app.get('/vendors.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'vendors.html'));
});

// SELECT from Vendors
app.get('/api/vendors', async (req, res) => {
    try {
        const query = 'SELECT vendorID, name, city, email, rating FROM Vendors ORDER BY name;';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching vendors:", error);
        res.status(500).json({ error: "Error loading vendors" });
    }
});

// Get dropdown data for Vendors
app.get('/api/vendors-dropdown', async (req, res) => {
    try {
        const query = 'SELECT vendorID, name FROM Vendors ORDER BY name;';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching vendors dropdown:", error);
        res.status(500).json({ error: "Error loading vendors" });
    }
});

// CREATE Vendor (using stored procedure)
app.post('/api/vendors', async (req, res) => {
    const { name, city, email, rating } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_create_vendors(?, ?, ?, ?);',
            [name, city, email, rating]
        );
        res.status(201).json({ message: "Vendor created successfully" });
    } catch (error) {
        console.error("Error creating vendor:", error);
        res.status(500).json({ error: "Error creating vendor: " + error.message });
    }
});

// UPDATE Vendor (using stored procedure)
app.put('/api/vendors/:id', async (req, res) => {
    const { id } = req.params;
    const { name, city, email, rating } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_update_vendors(?, ?, ?, ?, ?);',
            [id, name, city, email, rating]
        );
        res.json({ message: "Vendor updated successfully" });
    } catch (error) {
        console.error("Error updating vendor:", error);
        res.status(500).json({ error: "Error updating vendor: " + error.message });
    }
});

// DELETE Vendor (using stored procedure)
app.delete('/api/vendors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'CALL sp_delete_vendors(?);',
            [id]
        );
        res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error deleting vendor:", error);
        res.status(500).json({ error: "Error deleting vendor" });
    }
});

/******* EVENTS PAGE *******/

// Get events HTML page
app.get('/events.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'events.html'));
});

// SELECT from Events
app.get('/api/events', async (req, res) => {
    try {
        const query = 'SELECT eventID, name, location, date, attendance FROM Events ORDER BY date DESC;';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Error loading events" });
    }
});

// Get dropdown data for Events
app.get('/api/events-dropdown', async (req, res) => {
    try {
        const query = 'SELECT eventID, name, date FROM Events ORDER BY date DESC;';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching events dropdown:", error);
        res.status(500).json({ error: "Error loading events" });
    }
});

// CREATE Event (using stored procedure)
app.post('/api/events', async (req, res) => {
    const { name, location, date, attendance } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_create_events(?, ?, ?, ?);',
            [name, location, date, attendance]
        );
        res.status(201).json({ message: "Event created successfully" });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Error creating event: " + error.message });
    }
});

// UPDATE Event (using stored procedure)
app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { name, location, date, attendance } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_update_events(?, ?, ?, ?, ?);',
            [id, name, location, date, attendance]
        );
        res.json({ message: "Event updated successfully" });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Error updating event: " + error.message });
    }
});

// DELETE Event (using stored procedure)
app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'CALL sp_delete_events(?);',
            [id]
        );
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Error deleting event" });
    }
});

/******* INVENTORIES PAGE *******/

// Get inventories HTML page
app.get('/inventories.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'inventories.html'));
});

// SELECT from Inventories
app.get('/api/inventories', async (req, res) => {
    try {
        const query = `
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
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching inventories:", error);
        res.status(500).json({ error: "Error loading inventories" });
    }
});

// Get dropdown data for Items
app.get('/api/items-dropdown', async (req, res) => {
    try {
        const query = 'SELECT itemID, name FROM Items ORDER BY name;';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching items dropdown:", error);
        res.status(500).json({ error: "Error loading items" });
    }
});

// CREATE Inventories (using stored procedure)
app.post('/api/inventories', async (req, res) => {
    const { vendorID, itemID, quantity, item_condition, price } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_create_inventories(?, ?, ?, ?, ?);',
            [vendorID, itemID, quantity, item_condition, price]
        );
        res.status(201).json({ message: "Inventory created successfully" });
    } catch (error) {
        console.error("Error creating inventory:", error);
        res.status(500).json({ error: "Error creating inventory" });
    }
});

// UPDATE Inventories (using stored procedure)
app.put('/api/inventories/:id', async (req, res) => {
    const { id } = req.params;
    const { vendorID, itemID, quantity, item_condition, price } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_update_inventories(?, ?, ?, ?, ?, ?);',
            [id, vendorID, itemID, quantity, item_condition, price]
        );
        res.json({ message: "Inventory updated successfully" });
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({ error: "Error updating inventory" });
    }
});

// DELETE Inventories (using stored procedure)
app.delete('/api/inventories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query(
            'CALL sp_delete_inventories(?);',
            [id]
        );
        res.json({ message: "Inventory deleted successfully" });
    } catch (error) {
        console.error("Error deleting inventory:", error);
        res.status(500).json({ error: "Error deleting inventory" });
    }
});

/******* VENDOR EVENTS PAGE *******/

// Get vendor events HTML page
app.get('/vendorevents.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'vendorevents.html'));
});

// SELECT from VendorEvents
app.get('/api/vendorevents', async (req, res) => {
    try {
        const query = `
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
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching vendor events:", error);
        res.status(500).json({ error: "Error loading vendor events" });
    }
});

// CREATE VendorEvent (using stored procedure)
app.post('/api/vendorevents', async (req, res) => {
    const { vendorID, eventID, boothNumber } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_create_vendorevents(?, ?, ?);',
            [vendorID, eventID, boothNumber]
        );
        res.status(201).json({ message: "Vendor event created successfully" });
    } catch (error) {
        console.error("Error creating vendor event:", error);
        res.status(500).json({ error: "Error creating vendor event" });
    }
});

// UPDATE VendorEvent (using stored procedure)
app.put('/api/vendorevents/:vendorID/:eventID', async (req, res) => {
    const { vendorID, eventID } = req.params;
    const { boothNumber } = req.body;
    try {
        const [result] = await db.query(
            'CALL sp_update_vendorevents(?, ?, ?);',
            [vendorID, eventID, boothNumber]
        );
        res.json({ message: "Vendor event updated successfully" });
    } catch (error) {
        console.error("Error updating vendor event:", error);
        res.status(500).json({ error: "Error updating vendor event" });
    }
});

// DELETE VendorEvent (using stored procedure)
app.delete('/api/vendorevents/:vendorID/:eventID', async (req, res) => {
    const { vendorID, eventID } = req.params;
    try {
        const [result] = await db.query(
            'CALL sp_delete_vendorevents(?, ?);',
            [vendorID, eventID]
        );
        res.json({ message: "Vendor event deleted successfully" });
    } catch (error) {
        console.error("Error deleting vendor event:", error);
        res.status(500).json({ error: "Error deleting vendor event" });
    }
});

/******* RESET DATABASE *******/

// RESET database - call stored procedure to reload DDL
app.get('/reset-database', async (req, res) => {
    try {
        await db.query('CALL sp_load_comiconTrackerdb();');
        res.send('Database has been reset! <a href="/">Return to Home</a>');    } catch (error) {
        console.error("Error resetting database:", error);
        res.status(500).send("Error resetting database: " + error.message);
    }
});

/******* START SERVER *******/

const PORT = 9124;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://classwork.engr.oregonstate.edu:${PORT}`);
});