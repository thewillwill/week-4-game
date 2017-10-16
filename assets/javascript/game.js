// TO DO
// Add ability for user to add themselve as a character e.g. Will Doesn't Bear
// 


// -----------------------------
//   VARIABLES
// -----------------------------



// GLOBAL VARIABLES
// -----------------------------

var characterNames = ["One", "Two", "Three", "Four"];
//array for setting a unique class for each character to be able to provide unique css style
var characterColors = ["one","two","three","four","five"];
var characters = [];
var userCharacter = ""; //index to user character object in array 
var enemyCharacter; //index to eney character object in array 
var enemiesKilled = 0;


// Game Settings
// -----------------------------
var maxAttackPoints = 200; //global static
var defaultHealth = 100;

var maxBaseAttackPower = 100;
var maxCounterAttackPower = 100;

// Game State Flags
// -----------------------------
var isNewGame = true;
var isNewRound = true;
var characterChosen = false;



// Character Object
// -----------------------------

function Character(name, baseAttackPower, counterAttackPower, healthPoints) {
    this.name = name;
    this.baseAttackPower = baseAttackPower;
    this.attackPower = baseAttackPower;
    this.counterAttackPower = counterAttackPower;
    this.healthPoints = healthPoints;
    this.isDefending = true;
    this.isUser = false;
    this.isAlive = true;
};


// -----------------------------
//   Functions
// -----------------------------


//Helper function to find the index of the character in the array
function findCharacterByName(currentName) {
    for (var i = 0; i < characters.length; i++) {
        //check the name property of each character against the currentName parameter
        if (characters[i].name == currentName) {
            // return the index of the object
            console.log("findCharacterByName(): index is :" + i)
            return i;
        }
    };
    //display debug error if no character found
    console.log("********* findCharacterByName(): No index found for: " + currentName)
}

//Helper function to get the character object from array
//Returns a character object
function setUserCharacterByName(currentName) {
    for (var i = 0; i < characters.length; i++) {
        //check the name property of each character against the currentName parameter
        if (characters[i].name == currentName) {
            // return the object
            console.log("setUserCharacterByName(): 'isUser = true' for character: " + currentName);
            characters[i].isUser = true;
            return;
        }
    };
    //display debug error if no character found
    console.log("setUserCharacterByName(): No character index found for: " + currentName);
}

//change the class off the user character button to indicate the selected character
function displayUserCharacter(userPick) {
    //look up the current character button
    //remove the default class and change to selected character class
    $("#character-buttons").find("[data-character-name='" + userPick + "']").removeClass("btn-secondary").addClass("btn-primary");
}

function removeEnemyCharacter() {
    $("#character-buttons").find("[data-character-name='" + characters[enemyCharacter].name + "']").remove();
}

function removeUserCharacter() {
    $("#character-buttons").find("[data-character-name='" + characters[userCharacter].name + "']").remove();
}

//create a character object for each charcter name
function createCharacterObjects() {

    //add name and random attack & counter attack powers to each character
    for (var i = 0; i < characterNames.length; i++) {
        var baseAttackPowerRandom = Math.floor(Math.random() * maxBaseAttackPower + 1);
        var counterAttackPowerRandom = Math.floor(Math.random() * maxCounterAttackPower + 1);
        console.log("New Character: " + characterNames[i] + " base: " + baseAttackPowerRandom + ", counter: " + counterAttackPowerRandom + ", health: " + defaultHealth);
        characters[i] = new Character(characterNames[i], baseAttackPowerRandom, counterAttackPowerRandom, defaultHealth);
        //console.log("Character: " + characters[i].name);
    };
};

//Dynamically Create Buttons for each character
function createCharacterButtons() {

    for (var i = 0; i < characters.length; i++) {
        var characterBtn = $("<button>");
        //give each character-button a class and bootstrap button classs
        characterBtn.addClass("character-button btn btn-secondary " + characterColors[i]);
        //give each button data equal to the character name
        console.log("Creating Character Button for: " + characters[i].name);
        characterBtn.attr("data-character-name",  characters[i].name);

        //add text to the button
        characterBtn.text(characters[i].name);

        //add the buttons under the #character-buttons div
        $("#character-buttons").append(characterBtn);
    }

};

function characterIsUser(currentName) {
    for (var i = 0; i < characters.length; i++) {
        //check the character is an enemy (not the current)
        if (characters[i].name == currentName) {
            //console.log("Character isUser: " + characters[i].isUser);
            return characters[i].isUser;
        }
    }
}


function attackEnemy() {

    //create visual attack element
    $("#attack-area").text("You attacked " + characters[enemyCharacter].name + " for " + characters[userCharacter].attackPower);
    console.log("-->Enemy health was: " + characters[enemyCharacter].healthPoints);
    characters[enemyCharacter].healthPoints -= characters[userCharacter].attackPower;
    characters[userCharacter].attackPower += characters[userCharacter].baseAttackPower;
    console.log("-->Enemy health now: " + characters[enemyCharacter].healthPoints);
    console.log("->User attack power now: " + characters[userCharacter].attackPower);

    //check if enemy dead
    if (characters[enemyCharacter].healthPoints <= 0) {
        console.log("->Enemy DEAD");
        enemiesKilled++;
        characters[enemyCharacter].isAlive = false;
        //remove dead enemy
        removeEnemyCharacter();
        //create visual attack element
        $("#dead-message").text(characters[enemyCharacter].name + " Dead, you can choose to attack another character");

        console.log("Enemies Killed: " + enemiesKilled);
        console.log("Total Enemies: " + (characters.length - 1));
        //check if all enemies dead
        if (enemiesKilled == (characters.length - 1)) {
            //User has won game - GAME OVER
            console.log("User has won the game");
            removeRemainingCharacters();
            clearMessages();
            $("#attack-area").text("You have won the game");
            //removeUserCharacter();
            $("#reset-button").show();
            //remove event listener from character ??

        }
    }



};

//remove all remaining characters from screen
function removeRemainingCharacters() {
    $("#character-buttons").empty();

}


function counterAttackUser() {

    //create visual attack element
    $("#attack-area2").text("You got attacked back for " + characters[enemyCharacter].counterAttackPower);
    console.log("->Character health was: " + characters[userCharacter].healthPoints);
    characters[userCharacter].healthPoints -= characters[enemyCharacter].counterAttackPower;
    console.log("->Character health now: " + characters[userCharacter].healthPoints);

    //check if user dead -> GAME OVER
    if (characters[userCharacter].healthPoints <= 0) {
        console.log("->user DEAD");
        $("#dead-message").text("you are dead. game over")
        removeRemainingCharacters();

        //display dead user
        //END GAME - Game Over
        $("#reset-button").show(); //show the reset button if it is showing
    }
}

//hide the user messages from last move
function clearMessages() {
    console.log("clearMessages()");
    $("#attack-area").text("");
    $("#attack-area2").text("");
    $("#dead-message").text("");
    // $("#reset-button").hide(); //hide the reset button if it is showing
}


// -----------------------------
//   Listener Functions
// -----------------------------


//listener for document ready
$(document).ready(function() {


    //hide the attack button
    $('#attack-button').hide();
    $('#reset-button').hide();
    //create a character object for each charcter name
    createCharacterObjects();

    //Dynamically Create Buttons for each character
    createCharacterButtons();

    //listen for click on characters
    $(".character-button").on("click", function() {
        clearMessages();
        var userPick = $(this).attr("data-character-name");
        console.log("---> Character Clicked: " + userPick);
        //set up game
        if (isNewGame) {
            console.log("---------NEW GAME--------");
            isNewGame = false;


            //if user has not picked a character
            if (!characterChosen) {
                //get the character name from the button data-character-name attribute.
                //set the global variable userCharacter as a character object
                console.log("--> User Picked: '" + userPick + "'. finding index");
                userCharacter = findCharacterByName(userPick);
                //console.log("Found Object: '" + userCharacter.name);
                setUserCharacterByName(userPick);
                displayUserCharacter(userPick);
                console.log("->End Click Early<-");
                return; //exit out
            }
        }

        // not a new game
        else {

            //this is a new round of the game
            if (isNewRound) {
                console.log("----NEW Round---");
                isNewRound = false;
                //hide the attack button
                $('#attack-button').hide();
            }
            // Not a new game or new round - currently in a round
            else {
                //insert thing to do during round
                isNewRound = true; //when round complete set flag
            }
            //check if they have selected an enemy
            if (characterIsUser(userPick)) {

                console.log("-->Character is user, can't fight themself");
                //display message for user to pick an enemy
                $("#attack-area").text("You can't fight yourself, pick an enemy");

                //user picked an enemy
            } else {
                console.log("-->Enemy selected: " + userPick);
                //set the current enemy character
                enemyCharacter = findCharacterByName(userPick);

                //TO DO
                //move the enemy into position

                console.log("-> enemy has Counter attack points: " + characters[enemyCharacter].counterAttackPower);

                //show the attack button
                $('#attack-button').show();
            }

        }
        console.log("->End Click<-");

    }); //END character-button listener



    //listener for click on attack button
    $("#attack-button").on("click", function() {
        console.log("---> attack-button clicked")
        $('#attack-button').hide();

        //take away health from enemy
        attackEnemy();

        //Check if enemy still alive
        if (characters[enemyCharacter].isAlive) {
            //counter attack the user
            counterAttackUser();
        }
        //enemy character is dead
        else {
            //dead enemy already handled in counterAttackUser()
        }



    });




    //listener for click on reset button
    $("#reset-button").on("click", function() {
        location.reload();
        // console.log("---> reset-button clicked");
        // clearMessages();
        // isNewGame = true;
        // characterChosen = false;
        // //Create Buttons again for each character
        // createCharacterButtons();
        //     //create a character object for each charcter name
        // createCharacterObjects();

        // $('#reset-button').hide();
    }); //END reset-button listener

});
