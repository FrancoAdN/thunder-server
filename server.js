/*
// SDK de Mercado Pago
const mercadopago = require('mercadopago');

// Agrega credenciales
mercadopago.configure({
    access_token: 'PROD_ACCESS_TOKEN'
});

// Crea un objeto de preferencia
let preference = {
    items: [
        {
            title: 'Mi producto',
            unit_price: 100,
            quantity: 1,
        }
    ]
};

mercadopago.preferences.create(preference)
    .then(function (response) {
        // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        global.id = response.body.id;
    }).catch(function (error) {
        console.log(error);
    });
*/
const express = require('express')
const path = require('path')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')

const app = express()
const PORT = 3000

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static('public'))

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/boost', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.get('/*', (req, res) => {
    res.redirect('/')
});

app.listen(PORT, () => console.log('Server running. Port: ' + PORT));
