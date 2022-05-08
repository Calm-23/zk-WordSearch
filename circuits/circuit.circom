pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/comparators.circom";
include "./node_modules/circomlib-matrix/circuits/matSub.circom";

template WordSearch() {
    /*  
    Original state of grid.
    It consists of letters represented by their ASCII values.
     */
    signal input ogGrid[4][4]; 
    /*  
    Selected state of grid.
    It consists of letters represented by their ASCII values.
     */
    signal input selectedGrid[4][4]; 
    /*  
    The grid submitted by the solver. 
    The position of the word submitted is represented by 1 in the respective cells and rest by 0. 
    */
    signal input subGrid[4][4];
    /* 
    Matrix of the selected search word, represented by it's ASCII values.
    */
    signal input selectedWord[4];
    /* 
    Matrix of the search word, represented by it's ASCII values.
    */
    signal input word[4];
    signal output out;

    signal tempGrid[4][4];
    component equalCheckGrid[4][4];
    for(var i = 0 ; i < 4 ; i++) {
        for(var j = 0 ; j < 4 ; j++) {
            equalCheckGrid[i][j] = IsEqual();
            equalCheckGrid[i][j].in[0] <== ogGrid[i][j];
            equalCheckGrid[i][j].in[1] <== selectedGrid[i][j];
            tempGrid[i][j] <== equalCheckGrid[i][j].out;
        }
    }

    signal subtractedGrid[4][4];
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            subtractedGrid[i][j] <== tempGrid[i][j] - subGrid[i][j];
            subtractedGrid[i][j] === 0;
        }
    }

    signal tempWord[4];
    for (var i = 0; i < 4; i++) {
        tempWord[i] <== selectedWord[i] - word[i];
        tempWord[i] === 0;
    }

    out <== 1;
} 

component main = WordSearch();