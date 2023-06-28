var buttonCollours = ["red", "blue", "green", "yellow"];
// Game pattern of colors
var gamePattern = [];
// User pattern of colors
var userClickedPattern = [];
// Way to keep track of whether the game has started or not.
var started = false;
// Level of the game
var level = 0;

// Detect any key pressed
$(document).keypress(function () {
    if (!started) {
        //"h1" title starts saying "Press A Key to Start", when the game has started, change this to say "Level 0".
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

// Detect click on buttons
$(".btn").click(function () {
    // Get which button was clicked based on his id
    var userChosenColour = $(this).attr("id");
    // Add color to user pattern
    userClickedPattern.push(userChosenColour);
    // When a user clicks on a button, the corresponding sound is played.
    playSound(userChosenColour);
    // Animate pressed button
    animatePress(userChosenColour);
    // Verify the last answer of the user
    checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentLevel) {
    // check if the most recent user answer is the same as the game pattern
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("success");
        //If the user got the most recent answer right, then check that they have finished their sequence.
        if (userClickedPattern.length === gamePattern.length) {
            //Call nextSequence() after a 1000 millisecond delay.
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("wrong");
        // Play sound for wrong button
        playSound("wrong");
        // Add class game-over to the body of the website
        $("body").addClass("game-over");
        // Change "h1"
        $("h1").text("Game Over, Press Any Key to Restart");
        // Remove it after 200miliseconds
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);
        // Start the game over
        startOver();
    }
}

function nextSequence() {
    // reset the userClickedPattern to an empty array ready for the next level
    userClickedPattern = [];
    // increase the level by 1 every time nextSequence() is called.
    level++;
    //update the h1 with this change in the value of level.
    $("#level-title").text("Level " + level);
    // Generate a random number between 0 and 3
    var randomNumber = Math.floor(Math.random() * 4);
    // based on the generated random number choose a color from the array of colors
    var randomChosenColour = buttonCollours[randomNumber];
    // Add the random color selected to the pattern
    gamePattern.push(randomChosenColour);
    // Search for an id attribute of "button" element and add an animation of flashing
    $("#" + randomChosenColour).fadeIn(200).fadeOut(200).fadeIn(200);
    // Play sound of the correspondent color
    playSound(randomChosenColour);

}

// Restart the game
function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}

function playSound(name) {
    // Set the correspondent audio
    var audio = new Audio("./sounds/" + name + ".mp3");
    // Play Audio
    audio.play();
}

// Animate the pressed button
function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

