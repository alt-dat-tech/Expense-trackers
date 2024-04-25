const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://venkatsadhanala169:<Ramana@2003>@cluster0.lydexqr.mongodb.net/ExpenseApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Define Schema and Model for transactions
const transactionSchema = new mongoose.Schema({
  type: String, // 'income' or 'expense'
  name: String,
  amount: Number
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  const transaction = new Transaction({
    type: req.body.type,
    name: req.body.name,
    amount: req.body.amount
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(9090)
