pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/comparators.circom";

template WordSearch() {
    /*  
    Original state of grid.
    It consists of letters represented by their ASCII values.
     */
    signal input ogGrid[4][4]; 
    /*  
    The grid submitted by the solver. 
    The position of the word submitted is represented by 1 in the respective cells and rest by 0. 
    */
    signal input subGrid[4][4];
    /* 
    Matrix of the search word, represented by it's ASCII values.
    */
    signal input word[4];

    component positionAns[4][4]; //checking where value is 1 in subGrid
    component matchAns[4][4]; //checking is ASCII values are equal

    for (var i = 0; i < 4; i++) {
        var len = 0;
        for( var j = 0 ; j < 4; j++) {
            /*
            Checking which cells of the grid the player has selected.
            Cells with value 1 means that the user has selected that letter.  */
            positionAns[i][j] = IsEqual();
            positionAns[i][j].in[0] <== subGrid[i][j];
            positionAns[i][j].in[1] <== 1;

            /* 
            Checking if the word actually lies in the cells selected by the player.
            This is done by comparing the ASCII values of the given Word matrix and the selected cells by player.
            */
            matchAns[i][j] = IsEqual();
            matchAns[i][j].in[0] <== ogGrid[i][j];
            matchAns[i][j].in[1] <== word[j];

            positionAns[i][j].out === matchAns[i][j].out;
            len++;
        }
        //This represents that the player has identified the 4 letter word correctly in the grid.
        len === 4;
    }
} 

component main{public [subGrid]} = WordSearch();