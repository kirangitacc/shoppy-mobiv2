# My Fullstack App - Backend

This is the backend of the My Fullstack App, built using Express.js and MySQL. This application provides an API for managing customized printing products.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/my-fullstack-app.git
   ```

2. Navigate to the backend directory:
   ```
   cd my-fullstack-app/backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the backend directory and add your environment variables (see [Environment Variables](#environment-variables) section).

## Usage

To start the backend server, run:
```
npm start
```

The server will run on `http://localhost:5000` by default.

## API Endpoints

- **GET /api/products**: Retrieve a list of products.
- **GET /api/products/:id**: Retrieve a specific product by ID.
- **POST /api/products**: Create a new product.
- **PUT /api/products/:id**: Update an existing product.
- **DELETE /api/products/:id**: Delete a product.

## Environment Variables

- `MYSQL_HOST`: The host of the MySQL database.
- `MYSQL_USER`: The username for the MySQL database.
- `MYSQL_PASSWORD`: The password for the MySQL database.
- `MYSQL_DATABASE`: The name of the MySQL database.
- `PORT`: The port on which the server will run (default is 5000).

## License

This project is licensed under the MIT License. See the LICENSE file for details.