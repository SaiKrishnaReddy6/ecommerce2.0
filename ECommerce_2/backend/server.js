const express = require('express');
const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
// const mongodbRoutes = require('./routes/mongodb/user');
// const mysqlRoutes = require('./routes/mysql/user');


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ecommerceApp', { useNewUrlParser: true,
    useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Connect to MySQL
const sequelize = new Sequelize('ecommerce', 'root', 'k82kk323', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((error) => console.log('Error connecting to database:', error));

// Create express app
const app = express();
app.use(cors({
  origin:'*'
}))
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(passport.initialize());


// MongoDB routes
app.use('/api/customers', require('./routes/customerRoute'));
app.use('/api/advertisers',require('./routes/advertiserRoute'));
app.use('/api/sellers',require('./routes/sellerRoute'));
// MySQL routes
app.use('/api/items',require('./routes/itemRoute'));
app.use('/api/inventory',require('./routes/inventoryRoute'));
app.use('/api/banks',require('./routes/bankRoute'));
app.use('/api/carts',require('./routes/cartRoute'));
app.use('/api/warehouses',require('./routes/warehouseRoutes'));
app.use('/api/coupons',require('./routes/couponRoute'));

// app.use('/api/mysql/users', mysqlRoutes);

// app.use('/api/product',require('./routes/productRoutes'))
// app.use('/api/cart',require('./routes/cartRoutes'))

// Start server
const port = process.env.PORT || 8800;
app.listen(port, () => console.log(`Server running on port ${port}`));

