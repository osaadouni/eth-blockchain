const Web3 = require('web3');
const net = require('net');
const compiledContract = require('../contracts/contractv1');

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

app.post('/', (req, res) => { 

    const question = req.body.question;

    web3.eth.personal.unlockAccount(coinbaseAddress, coinbasePassphrase, function(err, uares) { 
    
        QuestionContract.deploy({
            data: byteCode, arguments: question 
        }).send({
            from: coinbaseAddress, gas: 2000000 
        }).on('receipt', function(receipt) { 
            console.log('Contract Address: ' + receipt.contractAddress);
            //res.redirect('/questions?address=' + receipt.contractAddress);
        }) ;
    
    });

});
