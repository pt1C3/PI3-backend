const express = require('express');
const stripe = require('stripe')('sk_test_51PVjYGAJPMUjqPpZZ7cLrPaEv475zBqe8ct0WgsqHOVjYjvr4JhfCDELUFESkc5rUcATJ0A1WGUd7VktRJbeyPjV00Xbrg47lL');
const path = require('path');

const app = express();
const produtosRouter = require('./routes/productRouter.js');
const categoryRouter = require('./routes/categoryRouter.js');
const businessRouter = require('./routes/businessRouter.js');
const versionRouter = require('./routes/versionRouter.js');
const userRouter = require('./routes/userRouter.js');
const ownerRouter = require('./routes/ownerRouter.js');
const addonRouter = require('./routes/addonRouter.js');

//Configurações
app.set('port', process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(path.join(__dirname, './public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
    }); 
    
app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


//Rotas
app.use('/product', produtosRouter);
app.use('/category', categoryRouter);
app.use('/business', businessRouter);
app.use('/version', versionRouter);
app.use('/user', userRouter);
app.use('/owner', ownerRouter);
app.use('/addon', addonRouter);


app.get('/', (req, res) => {
    res.send('Backend');
});

app.listen(app.get('port'), () => {
    console.log("Backend server started on port: " + app.get('port'))
})