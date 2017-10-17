// TO DO
// Change health points to number of pirate crew
// You have xx crew remaining
// you now attacked with yy firepower
// add icons to each character
// add scorecard


// -----------------------------
//   VARIABLES
// -----------------------------



// GLOBAL VARIABLES
// -----------------------------

var characterNames = ["Facebook", "Twitter", "Google", "Apple"]; //this makes it easy to add, remove or change characters in the future

//array for setting a unique class for each character to be able to provide unique css style
var characaterStyle = ["facebook", "twitter", "google", "apple"]; //this was going to be implemented so a user could select a color -> NOT COMPLETE
//array for setting font-awesome icons, I was originally going to use icons that were not the same as the character name but this is not necessary now
var icons = ["facebook", "twitter", "google", "apple"] //also not required anymore as icon names are same as character name
var characters = []; //used to store character objects
var userCharacter = ""; //index to user character object in array 
var enemyCharacter; //index to eney character object in array 
var enemiesKilled = 0; //used to check if all enemies killed


// Game Settings
// -----------------------------
var maxAttackPoints = 50; //global static
var minHealthPoints = 100; //global static
var extraHealthPointsMax = 100; //global static
var maxBaseAttackPower = 50; //global static
var maxCounterAttackPower = 75; //global static

// Game State Flags
// -----------------------------
var isNewGame = true;
var isNewRound = true;
var characterChosen = false;
var enemySelected = false;

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


//Helper function to find the index of the character in the array, given the character name
function findCharacterByName(currentName) {
    for (var i = 0; i < characters.length; i++) {
        //check the name property of each character against the currentName parameter
        if (characters[i].name == currentName) {
            // return the index of the object
            //console.log("findCharacterByName(): index is :" + i)
            return i;
        }
    };
    //display debug error if no character found
    console.log("********* findCharacterByName(): No index found for: " + currentName)
}

//Helper function to set the character object as user in the characters array
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

//Change the  class off the user character button to indicate the selected character
function displayUserCharacter(userPick) {
    //Add a class to the character element that the user selected
    $("#character-buttons").find("[data-character-name='" + userPick + "']").addClass("character-selected");
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
        var healthPointsRandom = Math.floor(Math.random() * extraHealthPointsMax + 1) + minHealthPoints; 
        console.log("New Character: " + characterNames[i] + " base: " + baseAttackPowerRandom + ", counter: " + counterAttackPowerRandom + ", health: " + healthPointsRandom);
        characters[i] = new Character(characterNames[i], baseAttackPowerRandom, counterAttackPowerRandom, healthPointsRandom);
        //console.log("Character: " + characters[i].name);
    };
};

//Dynamically Create Buttons and score fields for each character
function createCharacterButtons() {

    for (var i = 0; i < characters.length; i++) {
        var characterBtn = $("<div>");
        //give each character-button a class and bootstrap button classs
        characterBtn.addClass("character-button " + characaterStyle[i]);
        //give each button data equal to the character name
        //console.log("Creating Character Button for: " + characters[i].name);
        characterBtn.attr("data-character-name", characters[i].name);
        //add icon to the button
        characterBtn.html("<i class='fa fa-" + icons[i] + "'></i> ");
        //add the buttons under the #character-buttons div
        $("#character-buttons").append(characterBtn);

        //add the character health text in the scorecard area
        $("#character-scores").append("<div class='score'><div><i class='fa fa-map-pin'></i> " + characters[i].name + ": " + characters[i].healthPoints + "</div>");
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
    $("#message-area").text("You fired " + characters[userCharacter].attackPower + " employees of " + characters[enemyCharacter].name);
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
        $("#message-area3").text(characters[enemyCharacter].name + " has no more employees, you can choose to attack another company");

        console.log("Enemies Killed: " + enemiesKilled);
        console.log("Total Enemies: " + (characters.length - 1));
        //check if all enemies dead
        if (enemiesKilled == (characters.length - 1)) {
            //User has won game - GAME OVER
            console.log("User has won the game");
            removeRemainingCharacters();
            clearMessages();
            $("#message-area").text("You have won the game");
            //removeUserCharacter();
            $("#reset-button").show();
            //remove event listener from character ??

        }
    }
    //enemy still alive
    else {
        console.log("enemy still alive");

        //ANIMATE
        $(".enemy-selected").removeClass("enemy-selected");

    }
    updateHealthDisplay();


};

//remove all remaining characters from screen
function removeRemainingCharacters() {
    $("#character-buttons").empty();

}

function updateHealthDisplay() {
    $("#character-scores").empty();
    for (var i = 0; i < characters.length; i++) {
        // display health for all alive enemies
        if (characters[i].isAlive) {

            if (i == userCharacter) {
                //add the character health text in the scorecard area
                $("#character-scores").append("<div class='score'><div><i class='fa fa-map-pin'></i> " + characters[i].name + ": " + characters[i].healthPoints + "</div>");
            }
            else {
                $("#character-scores").append("<div class='score'><div><i class='fa fa-map-pin'></i> " + characters[i].name + ": " + characters[i].healthPoints + "</div>");

            }
        } else {
            $("#character-scores").append("<div class='score'><div><i class='fa fa-map-pin'></i> " + characters[i].name + ": <i class='fa fa-times' aria-hidden='true'></i></div>");
        }
    }

}



function counterAttackUser() {

    //create visual attack element
    $("#message-area2").text("They fired " + characters[enemyCharacter].counterAttackPower + " of your employees");
    console.log("->Character health was: " + characters[userCharacter].healthPoints);
    characters[userCharacter].healthPoints -= characters[enemyCharacter].counterAttackPower;
    console.log("->Character health now: " + characters[userCharacter].healthPoints);

    updateHealthDisplay();

    //check if user dead -> GAME OVER
    if (characters[userCharacter].healthPoints <= 0) {
        console.log("->user DEAD");
        $("#message-area3").text("Your Company is Dead. Better luck next time...");
         $("#character-scores").empty();
        removeRemainingCharacters();

        //ANIMATE dead user
        //END GAME - Game Over
        $("#reset-button").show(); //show the reset button if it is showing
    }
}

//hide the user messages from last move
function clearMessages() {
    console.log("clearMessages()");
    $("#message-area").text("");
    $("#message-area2").text("");
    $("#message-area3").text("");
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
                $("#message-area").text("Choose an enemy ship to fight");
                console.log("->End Click Early<-");
                return; //exit out
            }
        }

        // not a new game
        else {

            //this is a new round of the game
            if (isNewRound && !enemySelected) {
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
                $("#message-area").text("You can't fight yourself, pick an enemy");

                //user picked an enemy
            } else if (!enemySelected) {
                enemySelected = true;
                console.log("-->Enemy selected: " + userPick);
                //set the current enemy character
                enemyCharacter = findCharacterByName(userPick);
                //Move Enemy
                $("#character-buttons").find("[data-character-name='" + userPick + "']").removeClass("btn-secondary").addClass("enemy-selected");

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
        enemySelected = false;



    });




    //listener for click on reset button
    $("#reset-button").on("click", function() {
        location.reload();
    }); //END reset-button listener

});