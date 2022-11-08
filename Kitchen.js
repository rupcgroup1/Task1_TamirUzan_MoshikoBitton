let dishes = [];

$(document).ready(function () {
    $("#ingredient").hide();
    $("#recipe").hide();
    $("#createNclose").hide();
    $("#submitIngFRM").submit(createIngredient);
    $("#submitRecFRM").submit(createRecipe);


    if (localStorage.getItem("dishes") != undefined)
        RenderDishes();
    else {
        document.getElementById("main").innerHTML = "<h2>Currently there are no recipes</h2>";
    }
});
class Ingredient {
    constructor(id, name, url, calories) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.calories = calories;
        this.showIngredients = () => "<div> Ingredient details: </br>" + this.url + "</br>" + this.name + "</br>" + this.calories + "</div>"; 
    }
}

class DishRecipe {
    constructor(name, ingredient, time, cookingMethod, image) {
        this.name = name;
        this.ingredient = ingredient;
        this.time = time;
        this.cookingMethod = cookingMethod;
        this.image = image;
        this.Render = () => 
             "<div class='recipe'><h2>Dish Recipe details:</h2>" + this.image + "</br>" + "Dish name:" + this.name +
                "</br>" + "Cooking method:" + this.cookingMethod + "</br>" + "Total cooking time:" + this.time + "</br>"
                + "Total calories:" + this.calories + "</div>";

        this.GetTotalCalories = function () {
            let sum = 0;
            for (let i = 0; i < ingredient.length; i++) {
                sum += parseInt(ingredient[i].calories);
            }
            return sum;
        };
        this.GetIngredients = function () {
            let str = "";
            for (i in ingredient) {
                str += "<div class='allIngredients'>" + ingredient[i].showIngredients() + "</div>";
            }
            return str;
        };

    }
}

//Show ingredient form
function addIngredient() {
    $("#recipe").hide();
    $("#ingredient").show();
    $("#createNclose").show();
}

//Onclick method for adding ingredient
function createIngredient() {
    let name = document.getElementById('ingredientName').value;
    let image = document.getElementById('ingredientImage').value;
    let calories = document.getElementById('ingredientCalories').value;
    let id = 1;
    if (localStorage.getItem("id") != undefined)
        id = parseInt(localStorage.getItem("id"));
    let ingredient = new Ingredient(id, name, image, calories);
    id += 1;
    localStorage.setItem("id", JSON.stringify(id));
    let ingredients = [];
    if (localStorage.getItem("ingredients") != undefined)
        ingredients = JSON.parse(localStorage.getItem("ingredients"));

    ingredients.push(ingredient);
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
    $("#ingredient").hide();
    $("#createNclose").hide();
    return false;
}

//Add recipe
function addRecipe() {
    $("#recipe").show();
    $("#ingredient").hide();
    $(".allIngredients").show();
    $("#createNclose").show();
    let ingredients = [];
    //Show all ingredients
    if (localStorage.getItem("ingredients") != undefined)
        ingredients = JSON.parse(localStorage.getItem("ingredients"));
    else {
        document.getElementById('head').value = "There are no ingredients available";
        return;
    }
    //Render dynamically the ingredients.
    let str = renderIngredients(ingredients);
    document.getElementsByClassName("allIngredients")[0].innerHTML = str;
}

function renderIngredients(ingredients) {
    let str = "";
    for (let i = 0; i < ingredients.length; i++) {
        str += "<label for='ingredient" + (i + 1) + "'>Add" + "<input type='checkbox' id='item" + (i + 1) + "'/>";
        str += "<div id='ingredient" + (i + 1) + "'>" + "<p>Ingredient details: </p>" + "<img src='" + ingredients[i].url + "'>" + "<span>" + ingredients[i].name + "</span>" +
            "</br><span>calories: " + ingredients[i].calories + "</span>" + "</div>" + "</label>";
    }
    return str;  
}

function renderForModal(ingredients){
    let str = "";
    for (let i = 0; i < ingredients.length; i++) {
        str += "<div id='ingredient" + (i + 1) + "'>" + "<p>Ingredient details: </p>" + "<img src='" + ingredients[i].url + "'>" + "<span>" + ingredients[i].name + "</span>" +
            "</br><span>calories: " + ingredients[i].calories + "</span>" + "</div>" + "</label>";
    }
    return str;
}

function createRecipe() {
    let name = document.getElementById('recipeName').value;
    let method = document.getElementById('recipeMethod').value;
    let url = document.getElementById('recipeImage').value;
    let time = document.getElementById('recipeTime').value;

    //Taking the ingredients the customer choose.
    let ingredientsSelector = document.querySelectorAll('input[type=checkbox]:checked');

    //Getting all the ingredients from the localStorage.
    let allIngredients = JSON.parse(localStorage.getItem("ingredients"));
    let selected = [];


    for (let i = 0; i < ingredientsSelector.length; i++) {
        let index = parseInt(ingredientsSelector[i].id.split("item")[1]);
        selected.push(allIngredients[index - 1]);      
    }
    
    let dishes = [];
    if (localStorage.getItem("dishes") != undefined) {
        dishes = JSON.parse(localStorage.getItem("dishes"));
    }

    let recipe = new DishRecipe(name, selected, time, method, url);
    dishes.push(recipe);
    localStorage.setItem("dishes", JSON.stringify(dishes));
    document.getElementsByClassName("allIngredients")[0].innerHTML = "";
    $("#recipe").hide();
    RenderDishes();
    //Here we need to render the new dishes.
    return false;
}

function RenderDishes() {
    let dishes = JSON.parse(localStorage.getItem("dishes"));
    let str = "";
    for (let i = 0; i < dishes.length; i++) {
        recipe = new DishRecipe(dishes[i].name, dishes[i].ingredient, dishes[i].time, dishes[i].cookingMethod, dishes[i].image);
        str += getDiv(recipe);
    }
    document.getElementById("main").innerHTML = str;
}

function getDiv(recipe) {
    let str = "";
    str += '<div class="recipes">' + "Dish Recipes Details:</br>" + '<p> <img src=' + recipe.image + '></p>' +
        "<p>Cooking method: " + recipe.cookingMethod + "</p>" + "<p>Total cooking time: " + recipe.time + "</p>" + "<p>Total calories: " + recipe.GetTotalCalories() +
        "</p>" + '<button id="' + recipe.name + '"' + `onclick='showRecIngredients(` +JSON.stringify(recipe)+ `)'>Show Ingredients</button>` + '</div>';
    return str;
}

function showRecIngredients(recipe) {
    //Do something
    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    //Passing false because its modal pop up and i dont want checkbox.
    document.getElementsByClassName("allIngredients")[1].innerHTML = renderForModal(recipe.ingredient);
    $(".allIngredients").show();
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}

function closeBTN() {
    $(".allIngredients").hide();
    $("#recipe").hide();
    $("#ingredient").hide();
}