const express = require('express');
const app = express();
const produtosRouter = require('./routes/produtosRouter.js');
const categoryRouter = require('./routes/categoryRouter.js');
const initModels = require('./models/init-models');
var sequelize = require('./models/database');

//Configurações
app.set('port', process.env.PORT || 3000);

app.use(express.json());


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
    }); 

//Rotas
app.use('/produtos', produtosRouter);
app.use('/category', categoryRouter);


app.get('/', (req, res) => {
    initModels(sequelize);
    res.send('Backend');
});

app.listen(app.get('port'), () => {
    console.log("Backend server started on port: " + app.get('port'))
})