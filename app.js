const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3100;

app.use(bodyParser.json());



const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connect('mongodb://localhost:27017/database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});



const Schema = mongoose.Schema;
const itemSchema = new Schema({
    name: String,
    age: Number,
});
const Item = mongoose.model('Item', itemSchema);


// app.get('/items', async (req, res) => {
//     const items = await Item.find();
//     res.json(items);
// });

app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.json(item);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/items', async (req, res) => {
    try {
        const itemName = res.params.name;
        if (!itemName) {
            return res.status(400).json({ error: 'Name query parameter is required' });
        }

        const item = await Item.findOne({ name: itemName });
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
});

app.put('/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).send('Item not found');
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.delete('/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});