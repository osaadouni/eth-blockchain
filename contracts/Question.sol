pragma solidity ~0.4.0;

contract Questions {

    // global variables that aren't in a struct 
    mapping(address => uint) public answers; // integer where 0=no anwser, 1=yes, 2=no
    string question;
    address asker;
    uint trues;
    uint falses;

    // __init__
    function Questions(string _question) public {
        asker = msg.sender;
        question = _question;
    } 

    // We need a way to validate whether or not they've answered before.

    // The default of a mapping 
    function answerQuestion(bool _answer) public {
        
        if (answers[msg.sender] == 0 && _answer) { // hasnt answered yet 
            answers[msg.sender] = 1; // vote = true 
            trues += 1;             // increases total of true's
        }

        else if (answers[msg.sender] == 0 && !_answer ) { // answer is false 
            answers[msg.sender] = 2; // vote = false 
            falses += 1;            // increase total of false's 
        }
        else if (answers[msg.sender] == 2 && _answer ) { // false switching to true
            answers[msg.sender] = 1; // vote = true 
            trues  += 1;     //increase total of true's
            falses -= 1;     //decrease total of false's
        }
        else if (answers[msg.sender] == 1 && !_answer ) { // true switching to false
            answers[msg.sender] = 2; // vote = false 
            falses += 1;     //increase total of false's
            trues -= 1;     //decrease total of true's
        }
    }

    function getQuestion() public constant returns (string, uint, uint, uint) {

        return (question, trues, false, answers[msg.sender]);
    }

    function kill() public 
    {
        if ( msg.sender == asker ) selfdestruct(asker);
    }
}
