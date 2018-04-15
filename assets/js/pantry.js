var fs = require("fs");
console.log("pantry.js loaded");
//DOM selectors
$addShelf = $("#addShelf");
$shelfBtn = $("#shelfBtn");
$addFoodName = $("#addFoodName");
$addFoodMeas = $("#addFoodMeas");
$addFoodUnit = $("#addFoodUnit");
$addFoodBtn = $("#addFoodBtn");
$pantry = $("#pantry");
//pantry object
var myPantry = {
    unShelved: [],
    shelves: []
};
//constructor to create a new shelf
function Shelf(name, int) {
    this.name = name;
    this.idNumber = int,
    this.contents = {
        names: [],
        measures: [],
        units: []
    };
}

//event listener for the add shelf button
$shelfBtn.click(function(event) {
    event.preventDefault();
    //grab the shelf name the user entered.
    var name = $addShelf.val().trim();
    //use the shelf name to construct a new shelf.
    var newShelf = new Shelf(name, myPantry.shelves.length);
    //Then push our new shelf to our pantry.
    myPantry.shelves.push(newShelf);
    //and append it to the screen.
    $pantry.append(
        "<button class = 'btn btn-dark expandButton' id = 'shelf" + newShelf.idNumber + "'></button>" +
        "<div class = collapse id = 'collapse-shelf" + newShelf.idNumber + "'></div>"
    );
});