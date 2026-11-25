# Comic-Con Vendor Tracker - CS 340 Portfolio Project

**Authors:** Brian Merritt & Wyatt Arnsdorf  
**Course:** CS 340 - Introduction to Databases  
**Term:** Fall 2025  
**Institution:** Oregon State University

---

## Project Overview

The Comic-Con Vendor Tracker is a full-stack web application designed to help collectors locate specific collectible items and discover which vendors will offer them at upcoming comic conventions and trade shows. The system manages relationships between items, vendors, events, and inventory through a normalized relational database.

---

## Technology Stack

- **Backend:** Node.js with Express.js
- **Database:** MariaDB (MySQL)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Process Management:** Forever
- **Database Driver:** mysql2 (with promises)

---

## Database Schema

The database consists of 5 entities with multiple relationships:

1. **Items** - Collectible products (comics, trading cards, etc.)
2. **Vendors** - Sellers/businesses participating in events
3. **Events** - Conventions and trade shows
4. **Inventories** - M:M relationship between Vendors and Items (tracks what vendors sell)
5. **VendorEvents** - M:M relationship between Vendors and Events (tracks vendor attendance)

---

## Features Implemented

### CRUD Operations (All entities)
- **CREATE:** Add new items, vendors, events, inventory records, and vendor-event relationships
- **READ:** Browse all entities with JOIN queries for related data
- **UPDATE:** Edit existing records including M:M relationships
- **DELETE:** Remove records with proper CASCADE handling for foreign keys

### Stored Procedures
All CREATE, UPDATE, and DELETE operations use PL/SQL stored procedures:
- `sp_create_[entity]` - Insert operations
- `sp_update_[entity]` - Update operations  
- `sp_delete_[entity]` - Delete operations
- `sp_load_comiconTrackerdb()` - Database reset functionality

### User Interface Features
- Dynamic dropdown menus for foreign key selection
- Form validation (HTML5 + server-side)
- Confirmation dialogs for destructive operations
- Real-time table updates without page refresh
- Responsive navigation across all pages

---

## File Structure
```
cs340-group80/
├── server.js              # Express server with all API routes
├── db-connector.js        # Database connection configuration
├── package.json           # Node.js dependencies
├── index.html             # Homepage with entity cards
├── items.html             # Items CRUD interface
├── vendors.html           # Vendors CRUD interface
├── events.html            # Events CRUD interface
├── inventories.html       # Inventories (M:M) CRUD interface
├── vendorevents.html      # VendorEvents (M:M) CRUD interface
├── DDL.sql                # Data Definition Language (schema + sample data)
├── DML.sql                # Data Manipulation Language (queries)
└── PL.sql                 # Procedural Language (stored procedures)
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MySQL/MariaDB server
- npm package manager

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/bmerritt4/cs340-group80.git
cd cs340-group80
```

2. Install dependencies:
```bash
npm install
```

3. Configure database connection in `db-connector.js`:
```javascript
const pool = mysql.createPool({
    host: 'your-host',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database'
}).promise();
```

4. Import database schema and data:
```bash
mysql -u username -p database_name < DDL.sql
```

5. Import stored procedures:
```bash
mysql -u username -p database_name < PL.sql
```

6. Start the server:
```bash
node server.js
```

7. Access the application at `http://localhost:9124`

---

## API Endpoints

### Items
- `GET /api/items` - Retrieve all items
- `POST /api/items` - Create new item (calls `sp_create_items`)
- `PUT /api/items/:id` - Update item (calls `sp_update_items`)
- `DELETE /api/items/:id` - Delete item (calls `sp_delete_items`)

### Vendors
- `GET /api/vendors` - Retrieve all vendors
- `GET /api/vendors-dropdown` - Get vendors for dropdown menus
- `POST /api/vendors` - Create new vendor (calls `sp_create_vendors`)
- `PUT /api/vendors/:id` - Update vendor (calls `sp_update_vendors`)
- `DELETE /api/vendors/:id` - Delete vendor (calls `sp_delete_vendors`)

### Events
- `GET /api/events` - Retrieve all events
- `GET /api/events-dropdown` - Get events for dropdown menus
- `POST /api/events` - Create new event (calls `sp_create_events`)
- `PUT /api/events/:id` - Update event (calls `sp_update_events`)
- `DELETE /api/events/:id` - Delete event (calls `sp_delete_events`)

### Inventories (M:M)
- `GET /api/inventories` - Retrieve all inventory records with JOINs
- `POST /api/inventories` - Create inventory (calls `sp_create_inventories`)
- `PUT /api/inventories/:id` - Update inventory (calls `sp_update_inventories`)
- `DELETE /api/inventories/:id` - Delete inventory (calls `sp_delete_inventories`)

### VendorEvents (M:M)
- `GET /api/vendorevents` - Retrieve vendor-event relationships with JOINs
- `POST /api/vendorevents` - Create vendor-event (calls `sp_create_vendorevents`)
- `PUT /api/vendorevents/:vendorID/:eventID` - Update booth number (calls `sp_update_vendorevents`)
- `DELETE /api/vendorevents/:vendorID/:eventID` - Delete relationship (calls `sp_delete_vendorevents`)

### Utility
- `GET /reset-database` - Reset database to original state (calls `sp_load_comiconTrackerdb`)

---

## Code Citations

### Base Code Structure
All code is adapted from **CS340 Activity 2 starter code** provided in CS 340 - Introduction to Databases course materials at Oregon State University (Fall 2025).

### AI Assistance

This project utilized AI tools for coding assistance as documented below:

#### Brian Merritt - Claude AI (Anthropic)
**Source:** https://claude.ai/  
**Dates:** 11/07/2025, 11/15/2025, 12/01/2025

**AI assistance used for:**
- Frontend HTML/CSS/JavaScript structure and patterns
- JavaScript fetch API patterns for CRUD operations
- Dropdown population from database queries
- Date formatting for HTML5 date inputs
- Replicating stored procedure patterns across all entities
- Form validation and error handling
- Composite key handling in VendorEvents

**Prompts used:**
- "Help me create an HTML page that displays Items from my database with a table"
- "How do I populate a dropdown menu from a database query in JavaScript?"
- "Help me write an async fetch function to handle form submission"
- "How do I format a SQL DATE field for display in JavaScript?"
- "I need to create a page for my Inventories table which is an M:M relationship between Vendors and Items"
- "Wyatt created stored procedures for Inventories CUD operations. Help me adapt this pattern and implement the same stored procedure structure for Items, Vendors, Events, and VendorEvents entities."

#### Wyatt Arnsdorf - Microsoft Copilot
**Source:** https://copilot.microsoft.com/  
**Dates:** 11/07/2025, 12/07/2025

**AI assistance used for:**
- Route organization pattern and handler structure
- Stored procedure CALL syntax for Inventories entity
- Async/await error handling patterns
- Adapting stored procedures for CUD operations to database schema
- Understanding parameterized queries with ? placeholders

**Prompts used:**
- "What i am looking for is to understand how to add more route handlers and stuff as I need to add more CRUD/CUD operations to the pages on our website."
- "Yes, lets start with items. I need to add a create (post) route that interacts with our actual database."
- "I am a little concerned with the ?, can you explain this?"
- "What if I wanted to implement the sql into stored procedures?"

### Original Work
The following aspects were entirely authored by Brian Merritt and Wyatt Arnsdorf:

- Complete database schema design (5 entities, relationships, constraints)
- Database normalization and relationship implementations
- CASCADE operation design for foreign key constraints
- Integration between frontend forms and backend stored procedures
- Sample data creation representing realistic comic convention scenarios
- Project-specific attribute selection and data types
- Navigation structure and user experience flow
- M:M relationship logic for Inventories and VendorEvents

### Division of Labor
- **Wyatt Arnsdorf:** Backend route organization and commenting structure, initial Inventories stored procedures implementation, server.js route handler patterns, comprehensive project documentation, final assembly of project and executive statement
- **Brian Merritt:** Frontend HTML/CSS/JavaScript implementation for all 5 entities, stored procedures for Items/Vendors/Events/VendorEvents, comprehensive citations across all code files, final integration and testing

---

## Database Reset Functionality

The application includes a RESET feature that restores the database to its original state using the stored procedure `sp_load_comiconTrackerdb()`. This procedure:
1. Drops and recreates all tables
2. Re-establishes foreign key constraints
3. Reloads original sample data

**Access:** Click "RESET Database" in the navigation bar on any page

---

## Known Limitations

- No user authentication system (designed for single-user educational purposes)
- Limited to 5 entities per CS340 project requirements
- Hosted on OSU's ENGR servers (access expires end of term)

---

## Future Enhancements

Potential features for production deployment:
- User authentication and authorization
- Search and filter functionality across entities
- Vendor ratings and review system
- Event calendar integration
- Image upload for collectible items
- Price history tracking and analytics
- Email notifications for vendor event attendance

---

## Academic Integrity Statement

This project was completed as a portfolio assignment for CS 340 at Oregon State University. All code citations follow the course syllabus requirements for acknowledging non-original work. The use of AI tools has been documented in accordance with university policies on AI assistance in coursework.

---

## License

This project is submitted as academic coursework and is not licensed for commercial use.

---

## Contact

For questions about this project:
- **Brian Merritt** - merrittb@oregonstate.edu
- **Wyatt Arnsdorf** - arnsdorw@oregonstate.edu

**Course Instructor:** Michael Curry, Oregon State University

---

**Last Updated:** December 8, 2025
