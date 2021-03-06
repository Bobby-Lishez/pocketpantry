//DOM selectors
var $recipeSearch = $("#recipeSearch"),
    $go = $("#go"),
    $recipeSearchResults = $("#recipeSearchResults"),
    $ingredients = $("#ingredients"),
    $recipeName = $("#recipeName");
    $directions = $("#directions"),
    $addRecipe = $("#addRecipe"),
    $recipeListCard = $("#recipeListCard");
    $addShelf = $("#addShelf"),
    $shelfBtn = $("#shelfBtn"),
    $addFoodName = $("#addFoodName"),
    $addFoodMeas = $("#addFoodMeas"),
    $addFoodUnit = $("#addFoodUnit"),
    $addFoodBtn = $("#addFoodBtn"),
    $pantry = $("#pantry");
//array of recipe objects
var myRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
//pantry object
var myPantry = JSON.parse(localStorage.getItem("pantry")) || {
    unShelved: [],
    shelves: []
};
//array of units of measure to match
var unitsOfMeasure = ["tsp" ,"tsp.", "teaspoon" , "teaspoons" , "tbsp" ,"tbsp.", 
                    "tablespoon" , "tablespoons" , "oz" ,"oz.", "ounce" , "ounces" , "cup" , "cups" , "c.",
                    "pint", "pints" , "qt" ,"qt.", "quart" , "quarts" , "gal" ,"gal.", "gallon" , "gallons" ,
                    "lbs" ,"lbs.",  "pound" , "pounds" , "ml" , "milliliter" , "milliliters" , "l" ,
                    "liter" , "liters" , "mg" , "milligram" , "milligrams" , "kg" , "kilogram" ,
                    "kilograms"];
//Empty object to store search results
var searchResults = {};
//ingredient counter for adding recipes
var currentIngredient = 1;
var pantryArray = [];

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

//function to convert a recipe to a recipe object.
function objectify(recipe) {
    //the values of our object
    var ingredientNames = [],
        measures = [],
        units = [],
        name = recipe.recipe.label,
        source = recipe.recipe.source;
    //grab our ingredints in an array
    var ingredients = recipe.recipe.ingredientLines;
    //split each ingredient string into the parts for our object
    for (var i = 0; i<ingredients.length; i++) {
        ingredientNames.push(ingredients[i]);
        var ingArray = ingredients[i].split(" ");
        for (var j = 0; j<ingArray.length; j++) {
            if (parseInt(ingArray[j].charAt(0))) {
                measures.push(ingArray[j]) ; break;
                }
            if (j === ingArray.length-1) {
                measures.push(0);
                }
            }
        for (var k = 0; k < ingArray.length; k++) {
            if (unitsOfMeasure.indexOf(ingArray[k]) >= 0) {
                units.push(ingArray[k]); break;
                }
            if (k === ingArray.length - 1) {
                units.push("-----");
                }
                }
        }
    //add a url to find directions 
    var directions = "Check out the directions for this recipe at <a href = '" + recipe.recipe.url + "' target = '_/blank'>" + recipe.recipe.url + "</a>";
    //then create a new object with the constructed values
    var recipeObject = {
        name: name,
        ingredients: ingredientNames,
        measures: measures,
        units: units,
        directions: directions,
        source: source
        };
    return recipeObject;
};

//function to display the label of a search result.
function displayResult(object) {
    $recipeSearchResults.append("<button class = 'button btn-light expandButton resultButton' type = button data-toggle='collapse' id='result" + searchResults.hits.indexOf(object) +"' aria-expanded='false' aria-controls='result" + searchResults.hits.indexOf(object) +"'>" +
                                    object.recipe.label +
                                "</button>" +
                                "<div class = 'collapse resultCollapse' id = 'collapse-result" + searchResults.hits.indexOf(object) +"'>" +
                                    "<div class = 'card card-body'>" +
                                        "<a href = " + object.recipe.url + " target = '_/blank'>Source: " + object.recipe.source + "</a>" +
                                        "<img src = '" + object.recipe.image + "' alt = recipePic>" + 
                                        "<button class = 'button btn-success searchResultAddButton' id = " + searchResults.hits.indexOf(object) + ">Add to My Recipes</button>" +
                                    "</div>" +
                                "</div>"
                            )
};

//function to display a recipe from myrecipes
function displayRecipe(recipe, int) {
    //console.log(recipe);
    var match = "";
    $recipeListCard.append(
        "<button class = 'btn btn-dark expandButton resultButton' id = 'myRecipe" + int + "'>" + recipe.name + "</button>" +
            "<div class = 'collapse' id = 'collapse-myRecipe" + int + "'>" +
                "Recipe Source: " + recipe.source +"<br>" +
                "Ingredients: <br>" +
                "<table class = ' table table-bordered'>" +
                    "<thead>" +
                        "<th style='width: 50%' class = 'myRecipeNames'>Ingredient</th>" +
                        "<th style='width: 8.33%' class = 'myRecipeMeasures'>Amt.</th>" +
                        "<th style='width: 16.66%' class = 'myRecipeUnits'>Unit</th>" +
                        "<th style='width: 25%' class = 'myRecipeAvailable'>Pantry Availability</th>" +
                    "</thead>" +
                    "<tbody id = 'ingredients-myRecipe" + int + "' >" +
                    "</tbody>" +
                "</table>" +
                "<h5>Directions:</h5>" +
                "<p>" + recipe.directions + "</p>" +
                "<button class = 'btn btn-danger deleteRecipe' id = 'delete" + int + "'>Delete Recipe</button>" +
            "</div>"
    );
    // loop to update each ingredient in our table
    for (var i = 0; i<recipe.ingredients.length; i++) {
        //first, we need to see if the ingredient is in our pantry
        var inPantry = false;
        //make an array from the ingredient name...
        var splitIngredient = recipe.ingredients[i].split(" ");
        //then check each word in the name against our pantry. if we get a hit, inPantry is set to true
        for (var j = 0; j<splitIngredient.length; j++) { 
            for (var k = 0; k<pantryArray.length; k++){
                var splitPantry = pantryArray[k].split(" ");
                for (var l = 0; l<splitPantry.length; l++) {
                    if (splitIngredient[j].toLowerCase() === splitPantry[l].toLowerCase()) {
                    inPantry = true; 
                    match = pantryArray[k];
                    break;
                }
                }
                
            
            }
        }
        //if it's in our pantry, add the ingredient with a green button and a description of the match
        if (inPantry) {
            $("#ingredients-myRecipe" + int).append(
                "<tr>" +
                    "<td><p id = myRecipe" + int + "-ingredient" + i + ">" + recipe.ingredients[i] + "</p></td>" +
                    "<td><p>" + recipe.measures[i] + "</p></td>" +
                    "<td><p>" + recipe.units[i] + "</p></td>" +
                    "<td class='myRecipeAvailable'><span id = 'myRecipe" + int + "-available" + i + "'><button class = 'btn btn-success btn-sm buyIngredient'>+</button></span>" +
                    match + " found in pantry</td>" +
                "</tr>"
            );
        }
        //Otherwise, add it with a blue button and a notice that no match was found.
        else {
            $("#ingredients-myRecipe" + int).append(
                "<tr>" +
                    "<td><p id = myRecipe" + int + "-ingredient" + i + ">" + recipe.ingredients[i] + "</p></td>" +
                    "<td><p>" + recipe.measures[i] + "</p></td>" +
                    "<td><p>" + recipe.units[i] + "</p></td>" +
                    "<td class='myRecipeAvailable'><span id = 'myRecipe" + int + "-available" + i + "'><button class = 'btn btn-primary btn-sm buyIngredient'>+</button></span> " +
                    " No matches in pantry</td>" +
                "</tr>"
            );
        }
    };
};

//function to display a shelf from myPantry
function displayShelf(shelf) {
    $pantry.append(
        "<button class = 'btn btn-dark expandButton' id = 'shelf" + shelf.idNumber + "'>"+ shelf.name +"</button>" +
        "<div class = collapse id = 'collapse-shelf" + shelf.idNumber + "'></div>"
    );
};

//event listener for search button
$go.click(function(event){
    event.preventDefault(); 
    var queryURL = "https://api.edamam.com/search?q="+ $recipeSearch.val().trim() +"&app_id=604fe6ae&app_key=04fae8d1362d3d0b9a9eade3d98b4b49";
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        searchResults = response;
        console.log(searchResults);
        $recipeSearchResults.empty();
        searchResults.hits.map(displayResult);
        $recipeSearchResults.append(
            "<button class = 'btn btn-danger clearButton expandButton'>Clear Search Results</button>"
        );
        });
        $recipeSearch.val("");    
});

//event listener to add a search result to my recipes
$(document).on("click", ".searchResultAddButton", function(event){
    var myRecipe = objectify(searchResults.hits[event.currentTarget.id]);
    myRecipes.push(myRecipe);
    //update the local storage (eventually the database)
    localStorage.removeItem("recipes");
    localStorage.setItem("recipes", JSON.stringify(myRecipes));
    //add the recipe to the 'myrecipes' folder
    displayRecipe(myRecipe, myRecipes.length - 1);
});

//event listener to add an ingredient
$(document).on("click", ".addIngredient", function(event) {
    event.preventDefault();
    //hide the current button.
    $("#addIng" + currentIngredient).css({"visibility": "hidden"});
    //Increment the ingredient counter
    currentIngredient++;
    //append a new row to the ingredients table
    $ingredients.append ( "<tr>" +
        "<div class = 'form-group row'>" +
            "<td>" +
                "<input type = 'text' class = 'form-control ingredient' id = 'ing" + currentIngredient + "'>" +
            "</td>" +
            "<td>" +
                "<input type = 'number' class = 'form-control measure' id = 'meas"+ currentIngredient +"'>" +
            "</td>" +
            "<td>" +
                "<select class = 'form-control unit' id = 'unit" + currentIngredient + "'>" +
                    "<option>-----</option>" +
                    "<option>each</option>" +
                    "<option>tsp</option>" +
                    "<option>Tbsp</option>" +
                    "<option>cup(s)</option>" +
                    "<option>qt</option>" +
                    "<option>gal</option>" +
                    "<option>oz</option>" +
                    "<option>lbs</option>" +
                    "<option>ml</option>" +
                    "<option>L</option>" +
                    "<option>mg</option>" +
                    "<option>g</option>" +
                    "<option>Kg</option>" +
                "</select>" +
            "</td>" +
            "<td>" + 
                "<button class = 'addIngredient' id = 'addIng" + currentIngredient + "'><strong>+</strong></button>" +
            "</td>" +
        "</div></tr>"
    );       
});

//event listener to submit a recipe
$addRecipe.click(function(event){
    //pull the values from the form as variables
    var name = $recipeName.val().trim();
    var directions = $directions.val().trim();
    var ingredients = [],
        measures = [],
        units = [];
    for( var i = 1; i<= currentIngredient; i++) {
        ingredients.push($("#ing" + i).val().trim());
        measures.push($("#meas" + i).val());
        units.push($("#unit" + i).val());
    }
    //create a new object from the values
    var recipe = {
        name: name,
        ingredients: ingredients,
        measures: measures,
        units: units,
        directions: directions,
        source: "User Submitted Recipe"
    }
    //console.log(recipe);
    //add our new recipe to myRecipes
    myRecipes.push(recipe);
    //Add our new recipe to the 'myrecipes' folder
    displayRecipe(recipe, myRecipes.length - 1);
    //update the local storage (eventually the database)
    localStorage.removeItem("recipes");
    localStorage.setItem("recipes", JSON.stringify(myRecipes));
    //reset the form
    currentIngredient = 1;
    $directions.val("");
    $recipeName.val("");
    $ingredients.html ( "<tr>" +
        "<div class = 'form-group row'>" +
            "<td>" +
                "<input type = 'text' class = 'form-control ingredient' id = 'ing" + currentIngredient + "'>" +
            "</td>" +
            "<td>" +
                "<input type = 'number' class = 'form-control measure' id = 'meas"+ currentIngredient +"'>" +
            "</td>" +
            "<td>" +
                "<select class = 'form-control unit' id = 'unit" + currentIngredient + "'>" +
                    "<option>-----</option>" +
                    "<option>each</option" +
                    "<option>tsp</option>" +
                    "<option>Tbsp</option>" +
                    "<option>cup(s)</option>" +
                    "<option>qt</option>" +
                    "<option>gal</option>" +
                    "<option>oz</option>" +
                    "<option>lbs</option>" +
                    "<option>ml</option>" +
                    "<option>L</option>" +
                    "<option>mg</option>" +
                    "<option>g</option>" +
                    "<option>Kg</option>" +
                "</select>" +
            "</td>" +
            "<td>" + 
                "<button class = 'addIngredient' id = 'addIng" + currentIngredient + "'><strong>+</strong></button>" +
            "</td>" +
        "</div></tr>"
    );       
});

//event listener for the add shelf button
$shelfBtn.click(function(event) {
    event.preventDefault();
    //grab the shelf name the user entered.
    var name = $addShelf.val().trim();
    $addShelf.val("");
    //use the shelf name to construct a new shelf.
    var newShelf = new Shelf(name, myPantry.shelves.length);
    //Then push our new shelf to our pantry.
    myPantry.shelves.push(newShelf);
    //and append it to the screen.
    displayShelf(newShelf);
    //update the storage
    localStorage.removeItem("pantry");
    localStorage.setItem("pantry", JSON.stringify(myPantry));
});

//function to allow dynamically-created collapses to display
$(document).on("click", ".resultButton", function(event){
    var target = "collapse-" + event.currentTarget.id;
    $("#" + target).collapse("toggle");
    
});

//click listener for the clear button
$(document).on("click", ".clearButton", function(event){
    $recipeSearchResults.empty();
})

//click listener for the delete recipe button
$(document).on("click", ".deleteRecipe", function(event) {
    var itemVal = parseInt(event.currentTarget.id.substr(6));
    myRecipes.splice(itemVal, 1);
    //update my recipe display
    $recipeListCard.empty();
    for (var i = 0; i < myRecipes.length; i++){
        displayRecipe(myRecipes[i], i);
    }
    //update the local storage (eventually the database)
    localStorage.removeItem("recipes");
    localStorage.setItem("recipes", JSON.stringify(myRecipes));
});

//click listener for the buy Ingredient button
$(document).on("click", ".buyIngredient", function(event) {
    var target = event.currentTarget.id.substr()
    groceryArray.push("ingredient");
                    
    console.log(groceryArray);
    // Change the HTML to reflect
    

    var newFood1 = $("<li id='deleteFood1" + groceryCount + "'>");
    newFood1.attr("data-id", "");
    newFood1.append(" " + "");
    var foodDelete1 = $("<img src='assets/close.png' class='delete' id='deleteButton" + groceryCount + "'>");
        groceryCount++;
    foodDelete1.attr("");
    foodDelete1.addClass("checkbox1");
    //foodDelete1.append("X");
    newFood1 = newFood1.append(foodDelete1);
    $("#grocery").append(newFood1);
});

//function to initialize my recipes on load
$(document).ready(function(){
    for (var i = 0; i < myRecipes.length; i++){
        displayRecipe(myRecipes[i], i);
    }
    for (var i = 0; i < myPantry.shelves.length; i++){
        displayShelf(myPantry.shelves[i]);
    }
});