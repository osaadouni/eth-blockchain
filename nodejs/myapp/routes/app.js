var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


const Web3 = require('web3');
const net = require('net');
const compiledContract = require('../../contracts/contractv1');

web3IPC = '/home/osboxes/blockchain/PrivEth3/geth.ipc';
let web3 = new Web3(web3IPC, net);

const byteCode = compiledContract.byteCode;
const abi      = compiledContract.abi;

const QuestionContract = new  web3.eth.Contract(abi);

console.log('compiledContract: ');
console.log(compiledContract);
console.log('abi: '      + abi);
console.log('byteCode: ' + byteCode);

web3.eth.getCoinbase(function(err, cba) { 
    coinbaseAddress = cba;
    console.log('0. coinbaseAddress: ' + coinbaseAddress);
});

const coinbasePassphrase = 'Africano1067';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// post question
app.post('/', (req, res) => { 

    const question = req.body.question;

    web3.eth.personal.unlockAccount(coinbaseAddress, coinbasePassphrase, function(err, uares) { 
    
        QuestionContract.deploy({
            data: byteCode, arguments: question 
        }).send({
            from: coinbaseAddress, gas: 2000000 
        }).on('receipt', function(receipt) { 
            console.log('Contract Address: ' + receipt.contractAddress);
            res.redirect('/questions?address=' + receipt.contractAddress);
        }) ;
    
    });

});

app.get('/questions', function(req, res) {
    const contractAddress = req.query.address;
    if (web3.utils.isAddress(contractAddress)) {
            
        QuestionContract.options.address = contractAddress;
        const info = QuestionContract.methods.getQuestion().call(function(err, gqres) {
            // using number strings to get the data from the method
            const question = gqres['0'];
            const trues = gqres['1'];
            const falses = gqres['2'];
            const currentAnswerInt = parseInt(gqres['3'], 10);
            data = {contractAddress: contractAddress, question: question, currentAnswerInt, trues: trues, falses: falses};
            res.render('question', data);
        });
    } else { 
        res.status(404).send("No question with that address.");
    }
});

app.post('/questions', function(req, res) { 
    const contractAddress = req.query.address;
    const answerValue = req.body.answer == 'true' ? true : false;
    if (web3.utils.isAddress(contractAddress)) { 
        web3.eth.personal.unlockAccount(coinbaseAddress, coinbasePassphrase, function(err, uares) { 
            QuestionContract.options.address = contractAddress;
            QuestionContract.methods.answerQuestion(answerValue).send({from: coinbaseAddress, gas: 2000000})
                .on('receipt', function(receipt) {
                    console.log('Question with address $(contractAddress) updated.');
                    res.redirect('/questions?address=' + contractAddress);
                }
            );
        });
    }
});

module.exports = app;
