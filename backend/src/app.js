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


app.post('/login/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.get(`SELECT * FROM userdetails WHERE username = ?`, [username]);

    if (!user) {
      res.status(400).send('Invalid user');
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const payload = { username: user.username };
        const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
        res.send({ jwtToken,userId:user.id});
      } else {
        res.status(400).send('Invalid password');
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

  app.post('/userdetails/:id', tokenAuthentication, async (request, response) => {
    const { id } = request.params;
    const userCartList = request.body;
    const query=`UPDATE userdetails SET cartList = ?  WHERE id = ?;`
    await db.run(query,[id],[userCartList]);
    response.send('User cart updated successfully');
  });

  app.get('/userdetails/:id', tokenAuthentication, async (request, response) => {
    const { id } = request.params;
    const query=`SELECT cartList FROM userdetails WHERE user_id = ?;`
    const cartList = await db.all(query,[id]);
    if (cartList) {
      response.json(cartList);
    } else {
      response.status(404).send('Cart not found');
    }});

export default app;
