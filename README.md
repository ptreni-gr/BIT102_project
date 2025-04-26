# MiZ2u Cafe Web Application

Welcome to **MiZ2u Cafe**, a web app that brings a cozy coffee shop to life! This project is my take on building an online platform where customers can browse a delicious menu, and admins can manage discounts to keep things exciting. Think creamy lattes, fizzy sodas, and dynamic pricing—all powered by a slick backend and a clean frontend. I built this to learn full-stack development, and I’m thrilled with how it turned out (cue my “WOAAWWW” moment when the discounts finally worked!).

## Features

- **Browse Products**: Check out the cafe’s menu on `products.html`, with prices updated in real-time based on active discounts.
- **Manage Discounts**: Admins can add, view, and delete discounts via `discounts.html`, with changes instantly reflected across the app.
- **RESTful API**: A Node.js backend with endpoints for creating, retrieving, and deleting discounts, all stored in a MySQL database.
- **Responsive Design**: Built with Bootstrap and custom CSS for a smooth experience on any device.
- **Lightweight Frontend**: Uses vanilla JavaScript for fast, dependency-free interactions.

## Project Structure

```
BIT102_project/
├── public/
│   ├── css/
│   │   ├── cardbox.css
│   │   ├── style.css
│   │   ├── responsive.css
│   ├── images/
│   │   ├── softTea.jpg
│   │   ├── mizuss coffee.jpg
│   │   ├── black_cafe.jpg
│   │   ├── latte_ice.jpeg
│   │   ├── ice_matcha.jpg
│   │   ├── pission_tea.jpg
│   │   ├── grape_soda.jpg
│   │   ├── peach_soda.webp
│   │   ├── green_milk_tea.avif
│   ├── discounts.html
│   ├── products.html
│   ├── index.html
│   ├── about.html
│   ├── costumer-peofile.html
│   ├── login.html
├── server.js
├── package.json
├── README.md
```

- `public/`: Contains static frontend files (HTML, CSS, images).
- `server.js`: The Node.js backend with Express.js and MySQL integration.
- `package.json`: Lists dependencies and scripts.

## Prerequisites

Before you start, make sure you have:

- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **MySQL** (v8 or higher): [Download](https://dev.mysql.com/downloads/)
- **Git**: To clone the repo [Download](https://git-scm.com/)
- A code editor like VS Code (optional but recommended)

## Setup Instructions

Follow these steps to get MiZ2u Cafe running on your machine. I’ve made it as painless as possible!

### 1. Clone the Repository
```bash
git clone https://github.com/ptreni-gr/BIT102_project.git
cd BIT102_project
```

### 2. Install Node.js Dependencies
Install the required Node.js packages:

```bash
npm install
```

This installs dependencies listed in `package.json`:
- `express`: For the server and API routes
- `mysql2`: For MySQL database connection
- `cors`: To enable frontend-backend communication

If `package.json` doesn’t exist, create it with:

```json
{
  "name": "BIT102_project",
  "version": "1.0.0",
  "description": "A web app for MiZ2u Cafe with discount management",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mysql2": "^3.6.0"
  }
}
```

Then run `npm install` again.

### 3. Set Up MySQL Database
1. **Start MySQL**:
   - Ensure MySQL is running on your machine (e.g., via MySQL Workbench or command line).
   - Log in to MySQL:
     ```bash
     mysql -u root -p
     ```
     Enter your MySQL root password.

2. **Create Database**:
   ```sql
   CREATE DATABASE miz2u_cafe;
   ```

3. **Create Discounts Table**:
   ```sql
   USE miz2u_cafe;
   CREATE TABLE discounts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       product_title VARCHAR(255) NOT NULL,
       UNIQUE (product_title),
       discount_percentage DECIMAL(5,2) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Verify Table**:
   ```sql
   DESCRIBE discounts;
   ```
   You should see:
   ```
   +---------------------+------------------+------+-----+-------------------+
   | Field               | Type             | Null | Key | Default           |
   +---------------------+------------------+------+-----+-------------------+
   | id                  | int(11)          | NO   | PRI | NULL              |
   | product_title       | varchar(255)     | NO   | UNI | NULL              |
   | discount_percentage | decimal(5,2)     | NO   |     | NULL              |
   | created_at          | timestamp        | YES  |     | CURRENT_TIMESTAMP |
   +---------------------+------------------+------+-----+-------------------+
   ```

### 4. Configure the Backend
Update `server.js` with your MySQL credentials. Your `server.js` should look something like this (only showing the database connection part for brevity):

```javascript
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_root_password', // Replace with your MySQL root password
    database: 'miz2u_cafe'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection failed:', err);
        return;
    }
    console.log('MySQL connected');
});
```

Replace `'your_root_password'` with your actual MySQL root password. If you’re using a different user or host, update those too.

### 5. Start the Server
Run the server:

```bash
npm start
```

You should see:
```
MySQL connected
Server running on port 3000
```

### 6. Access the Application
Open your browser and visit:
- **Home**: `http://localhost:3000/index.html`
- **Products**: `http://localhost:3000/products.html`
- **Discount Management**: `http://localhost:3000/discounts.html`

Try adding a discount in `discounts.html` (e.g., 20% off “Creamy Coffee”) and check `products.html` to see the updated price (e.g., `RM 3.90 RM 3.12 (20% OFF)`).

### 7. Troubleshooting
- **MySQL Errors**:
  - If you get `ER_ACCESS_DENIED_ERROR`, double-check your MySQL username and password in `server.js`.
  - If the database doesn’t exist, ensure you ran the `CREATE DATABASE` and `CREATE TABLE` commands.
- **Port Conflicts**:
  - If port 3000 is in use, update `server.js` to use another port (e.g., `app.listen(3001)`).
- **Discounts Not Showing**:
  - Check the console in your browser’s Developer Tools (F12 → Console) for errors.
  - Verify the database has discounts: `SELECT * FROM discounts;`
  - Ensure `products.html` and `discounts.html` are using the correct API endpoints (`http://localhost:3000/api/discounts`).

## API Endpoints

- **GET /api/discounts**: Retrieve all discounts.
  - Response: `[{"id":1,"product_title":"Creamy Coffee","discount_percentage":"30.00","created_at":"..."}]`
- **POST /api/discounts**: Add a new discount.
  - Body: `{"product_title":"Creamy Coffee","discount_percentage":30}`
  - Response: `{"id":1,"product_title":"Creamy Coffee","discount_percentage":30}`
- **DELETE /api/discounts/:id**: Delete a discount by ID.
  - Response: `{"message":"Discount deleted"}`
---

