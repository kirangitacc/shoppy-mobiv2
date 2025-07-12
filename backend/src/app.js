import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors());
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'shoppy.db');

let db = null;
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
  } catch (e) {
    console.error(`Db Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();



const tokenAuthentication = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers['authorization'];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1];
  }
  if (jwtToken === undefined) {
    response.status(401).send('Invalid JWT Token');
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401).send('Invalid JWT Token');
      } else {
        next();
      }
    });
  }
};

app.get('/user/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  console.log('Fetching user data...'+id);
  try {
    const query = 'SELECT * FROM userdetails WHERE id = ?';
    const user = await db.get(query, [id]);
    console.log(user);  // Added for debugging

    if (user) {
      response.json(user);
    } else {
      response.status(404).send('User not found');
    }
  } catch (error) {
    response.status(500).send('Error fetching user data');
  }
});

app.post('/register', async (request, response) => {
  const { username, email, password, gender, phone, address } = request.body;
  console.log(username, email, password, gender, phone, address);

  if (!username || !email || !password || !gender || !phone || !address) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  if (password.length < 6) {
    return response.status(400).json({ message: 'Password is too short' });
  }

  try {
    const userDetails = await db.get(
      `SELECT * FROM userdetails WHERE username = ? OR email = ?`,
      [username, email]
    );
    console.log('User Details:', userDetails);

    if (userDetails === undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Hashed Password:', hashedPassword);

      const addUserQuery = `
        INSERT INTO userdetails (username, email, password, gender, phone, address)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.run(addUserQuery, [username, email, hashedPassword, gender, phone, address]);
      response.json({ message: 'User Registered successfully' });
    } else {
      console.log('User already exists:', userDetails);
      response.status(400).json({ message: 'User already exists' });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/login/', async (request, response) => {
  const { username, password } = request.body;

  try {
    const user = await db.get(`SELECT * FROM userdetails WHERE username = ?`, [username]);
    console.log('User:', user);


    if (!user) {
      response.status(400).send('Invalid user');
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const payload = { username: user.username };
        const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
        response.send({ jwtToken,userId:user.id,cartList:user.cartList,orders:user.orders });
      } else {
        response.status(400).send('Invalid password');
      }
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/products', tokenAuthentication, async (request, response) => {
  try {
    const query = 'SELECT * FROM products';
    const products = await db.all(query);
    response.json(products);
  } catch (error) {
    response.status(500).send('Error fetching products');
  }
});

app.get('/product/:id', tokenAuthentication, async (request, response) => {
  const { id } = request.params;
  try {
    const query = 'SELECT * FROM products WHERE id = ?';
    const product = await db.get(query, [id]);
    if (product) {
      response.json(product);
    } else {
      response.status(404).send('Product not found');
    }
  } catch (error) {
    response.status(500).send('Error fetching product');
  }});


app.post('/storeUserData', tokenAuthentication, async (request, response) => {
  try {
    const { orders, cartList, userId } = request.body;
    console.log('Received data: api', { orders, cartList, userId });
    
    // Ensure proper JSON string conversion for complex data structures
    const ordersString = JSON.stringify(orders);
    const cartListString = JSON.stringify(cartList);


    const query = `UPDATE userdetails SET orders = ?, cartList = ? WHERE id = ?;`;
    await db.run(query, [ordersString, cartListString, userId]);

    response.send({ message: 'User data stored successfully' });
  } catch (error) {
    console.error('Error storing user data:', error);
    response.status(500).send({ error: 'Internal server error while storing data' });
  }
});
export default app;
