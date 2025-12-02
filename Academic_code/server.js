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

// HOME PAGE - serves static index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ITEMS PAGE
app.get('/items.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'items.html'));
});

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

// VENDORS PAGE
app.get('/vendors.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'vendors.html'));
});

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

// CREATE Vendors
app.post('/api/vendors', async (req, res) => {
    const { name, city, email, rating } = req.body;
    try {
        const query = `
            INSERT INTO Vendors (name, city, email, rating)
            VALUES (?, ?, ?, ?);
        `;
        const [result] = await db.query(query, [name, city, email, rating]);
        res.status(201).json({
            message: "Vendor created successfully",
            vendorID: result.insertId
        });
    } catch (error) {
        console.error("Error creating vendor:", error);
        res.status(500).json({ error: "Error creating vendor: " + error.message });
    }
});

// UPDATE Vendors
app.put('/api/vendors/:id', async (req, res) => {
    const { id } = req.params;
    const { name, city, email, rating } = req.body;

    try {
        const query = `
            UPDATE Vendors
            SET name = ?, city = ?, email = ?, rating = ?
            WHERE vendorID = ?;
        `;
        const [result] = await db.query(query, [name, city, email, rating, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.json({ message: "Vendor updated successfully" });
    } catch (error) {
        console.error("Error updating vendor:", error);
        res.status(500).json({ error: "Error updating vendor: " + error.message });
    }
});

// EVENTS PAGE
app.get('/events.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'events.html'));
});

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

/******* INVENTORIES PAGE *******/

// Get inventories html
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

// Get dropdown data for Inventories page
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

// CREATE Inventory
app.post('/api/inventories', async (req, res) => {
    const { vendorID, itemID, quantity, item_condition, price } = req.body;

    try {
        const query = `
            INSERT INTO Inventories (vendorID, itemID, quantity, item_condition, price)
            VALUES (?, ?, ?, ?, ?);
        `;
        const [result] = await db.query(query, [vendorID, itemID, quantity, item_condition, price]);

        res.status(201).json({
            message: "Inventory row created successfully",
            inventoryID: result.insertId
        });
    } catch (error) {
        console.error("Error creating inventory:", error);
        res.status(500).json({ error: "Error creating inventory" });
    }
});

// UPDATE Inventory
app.put('/api/inventories/:id', async (req, res) => {
    const { id } = req.params; // inventoryID from URL
    const { vendorID, itemID, quantity, item_condition, price } = req.body;

    try {
        const query = `
            UPDATE Inventories
            SET vendorID = ?, itemID = ?, quantity = ?, item_condition = ?, price = ?
            WHERE inventoryID = ?;
        `;
        const [result] = await db.query(query, [vendorID, itemID, quantity, item_condition, price, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Inventory row not found" });
        }

        res.json({ message: "Inventory row updated successfully" });
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({ error: "Error updating inventory" });
    }
});

// DELETE Inventory
app.delete('/api/inventories/:id', async (req, res) => {
    const { id } = req.params; // inventoryID from URL

    try {
        const query = 'DELETE FROM Inventories WHERE inventoryID = ?;';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Inventory row not found" });
        }

        res.json({ message: "Inventory row deleted successfully" });
    } catch (error) {
        console.error("Error deleting inventory:", error);
        res.status(500).json({ error: "Error deleting inventory" });
    }
});

// VENDOR EVENTS PAGE
app.get('/vendorevents.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'vendorevents.html'));
});

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

// Get dropdown data for VendorEvents page
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

/****** Items CRUD *****/

// CREATE Items
app.post('/api/items', async (req, res) => {
    const { name, category, series, edition, imageURL } = req.body;
    try {
        const query = `
            INSERT INTO Items (name, category, series, edition, imageURL)
            VALUES (?, ?, ?, ?, ?);
        `;
        const [result] = await db.query(query, [name, category, series, edition, imageURL]);
        res.status(201).json({
            message: "Item created successfully",
            itemID: result.insertId
        });
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Error creating item" });
    }
});

// UPDATE Items
app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params; // itemID from the URL
    const { name, category, series, edition, imageURL } = req.body; // new values

    try {
        const query = `
            UPDATE Items
            SET name = ?, category = ?, series = ?, edition = ?, imageURL = ?
            WHERE itemID = ?;
        `;
        const [result] = await db.query(query, [name, category, series, edition, imageURL, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json({ message: "Item updated successfully" });
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Error updating item" });
    }
});

/// RESET database, call SP to reload ddl.sql
app.get('/reset-database', async (req, res) => {
    try {
        await db.query('CALL sp_load_comiconTrackerdb();');
        res.send('Database has been reset! <a href="/items.html">View Items</a>');
    } catch (error) {
        console.error("Error resetting database:", error);
        res.status(500).send("Error resetting database: " + error.message);
    }
});

const PORT = 9124;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://classwork.engr.oregonstate.edu:${PORT}`);
});

/*
 * Citation: Adapted from CS340 Activity 2 with
 * assistance from Claude AI and Microsoft Copilot.
 * Date: 11/07/2025
 */