//TEST-93a454a8-2835-421c-b74c-e97a501cefc3 public test key
// APP_USR-7d3c2ba3-1e93-4383-b931-5fd9e302d204 PUBLIC PROD KEY
// APP_USR-1752315195623213-090820-ab23c4182e4135b76584e917c9e3bf1e-425326318 ACCESS PROD TOKEN
// TEST-1752315195623213-090820-dc64b10cd84286724bcfd57334b1edde-425326318 access token test
const mercadopago = require('mercadopago');
const bodyParser = require('body-parser');
const express = require('express')
const path = require('path')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')
const cors = require('cors')
const app = express()
require('dotenv').config()

const PORT = 3000

app.use(cors())
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static('public'))
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

mercadopago.configure({
    access_token: process.env.MP_PRODTOKEN
});

app.post('/process_payment', (req, res) => {

    console.log(req.body)

    var payment_data = {
        transaction_amount: Number(req.body.transactionAmount),
        token: req.body.token,
        description: req.body.description,
        installments: Number(req.body.installments),
        payment_method_id: req.body.paymentMethodId,
        issuer_id: req.body.issuer,
        payer: {
            email: req.body.email,
            identification: {
                type: req.body.docType,
                number: req.body.docNumber
            }
        }
    };

    mercadopago.payment.save(payment_data)
        .then(function (response) {
            // res.status(response.status).json({
            //     status: response.body.status,
            //     status_detail: response.body.status_detail,
            //     id: response.body.id
            // });
            res.sendStatus(response.status)
        })
        .catch(function (error) {
            console.log(error)
            res.sendStatus(400);
        });
})

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
