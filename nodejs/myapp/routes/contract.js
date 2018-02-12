var express = require('express');
var router = express.Router();

/* GET home page. */
/** router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
**/


console.log('Hush hush the world!');

const Web3 = require('web3');
const net = require('net');
const compiledContract = require('../../../contracts/contractv1');

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


/* GET home page. */
router.get('/contract', function(req, res, next) {
      res.render('contract', { title: 'Express' });
});


// post question
router.post('/contract', (req, res) => { 

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

router.get('/questions', function(req, res) {
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

router.post('/questions', function(req, res) { 
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

module.exports = router;
