const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Ema john server is running');
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f75ntdx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const productsCollection = client.db('emajohn').collection('products');
        app.get('/products', async(req, res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {}
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count, products});
        })

        app.post('/productsByIds', async(req, res)=>{
            const ids = req.body;
            const ObjectIds = ids.map(id=> ObjectId(id));
            const query = {_id: {$in: ObjectIds}};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally{

    }

}
run().catch(error=> console.log(error))


app.listen(port, ()=>{
    console.log('Server is running at port', port);
})