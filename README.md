# MockServer

MockServer is an npm package that helps you quickly create a mock server, acting as a mock database without any complex DB connections.  
This library auto-generates REST APIs for CRUD operations, making mocking fast, easy, and **SIMPLE**.

## Features

- **Multiple Storage Backends:**
  - In-memory (RAM)
  - File-based (JSON/text)
  - Excel file (each table as a sheet in a temp `.xlsx` file)
- **Auto-generated REST API:**
  - CRUD endpoints for each table
  - Seed and purge endpoints for quick data resets
- **Easy Table Definition:**
  - Define tables and seed data in a single config array

## Usage

### 1. Install dependencies

```bash
npm install
```

### 2. Define your tables and seed data

In your `app.js`:

```javascript
const myTables = [
  {
    name: "Users",
    seed: [
      { id: 1, first_name: "Jhon", last_name: "Dantas", company_name: null },
      // ... more seed data ...
    ]
  }
];
```

### 3. Choose your storage backend

In your `app.js`, select one of:

```javascript
const { SimpleMockServer, DBFile, DBRam, DBFunction } = require("mockserver");
const DBExcel = require("mockserver/database/db_excel");

const dbInstance = new DBExcel(); // or new DBFile(), new DBRam()
```

### 4. Start the server

```bash
node app.js
```

Server runs on port 2000 by default.

### 5. API Endpoints

For each table (e.g., `Users`):

- `GET    /Users`           — Get all data
- `GET    /Users/:id`       — Get data by id
- `POST   /Users`           — Add new data (expects JSON body)
- `PUT    /Users/:id`       — Edit data by id (expects JSON body)
- `DELETE /Users/:id`       — Delete data by id
- `GET    /Users/seed`      — Reset table to seed data
- `GET    /Users/purge`     — Clear all data in table

## Excel Backend Details

- Uses a temporary `.xlsx` file in your system temp directory.
- Each table is a separate sheet.
- Data is stored as rows in the sheet.
- Requires the `xlsx` npm package.

## Example Request

```bash
curl -X POST http://localhost:2000/Users \
  -H "Content-Type: application/json" \
  -d '{"id":7,"first_name":"Jane","last_name":"Doe","company_name":"Acme Inc."}'
```

## License

MIT