import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const app = express();

app.use(express.json());
const Client = new PrismaClient();

app.get('/',async (req, res) => {
  const data = await Client.users.findMany()
  res.send(data);
});

app.post('/', async(req , res) =>{
    const{username, password} = req.body;
    const data = await Client.users.create({
        data: {
            username,
            password
        }
    })
    res.send(data);
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});