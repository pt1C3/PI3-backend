const express = require('express');
const app = express();
//Route - const filmesRouter = require('./routes/filmesRoutes.js');


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
//app.use('/filmes', filmesRouter);


app.get('/', (req, res) => {
    res.send('Backend');
});

app.listen(app.get('port'), () => {
    console.log("Backend server started on port: " + app.get('port'))
})