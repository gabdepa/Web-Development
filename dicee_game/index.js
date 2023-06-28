// Generate Random number between 1 and 6
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

// Take the image associated with that random number
var imageSelected1 = "./images/dice" + randomNumber1 + ".png";
var imageSelected2 = "./images/dice" + randomNumber2 + ".png";

// Change the source image  on html
var image1 = document.querySelectorAll("img")[0];
image1.setAttribute("src", imageSelected1);
var image2 = document.querySelectorAll("img")[1];
image2.setAttribute("src", imageSelected2);

// Determine who's the winner
if ( randomNumber1 > randomNumber2 )
{
    document.querySelector("h1").innerText ="Player 1 Wins!";
}
else if ( randomNumber1 < randomNumber2 )
{
    document.querySelector("h1").innerText = "Player 2 Wins!";
}
else
{
    document.querySelector("h1").innerText = "Draw !";
}