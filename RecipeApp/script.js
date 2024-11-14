const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetails = document.querySelector('.recipe-details');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const closeBtn = document.querySelector('.closeBtn');
const startMessage = document.getElementById("start-message");
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const viewBtn = document.querySelector('.favBtn');

// pokazat recipes
const fetchRecipes = async (query) => {
    startMessage.classList.add("hide");
    recipeContainer.innerHTML = ""; // очистить
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        console.log(response);

        if (response.meals) {
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <h3>${meal.strMeal}</h3>
                    <p>Origin: ${meal.strArea}</p>
                    <p>Category: ${meal.strCategory}</p>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                `;
                const viewButton = document.createElement('button');
                viewButton.textContent = "View Recipe";

                viewButton.addEventListener('click', () => {
                    openRecipe(meal);
                });

                const favButton = document.createElement('button');
                favButton.textContent = favorites.some(fav => fav.idMeal === meal.idMeal) ? "Remove Favorite" : "Add Favorite";
                favButton.addEventListener('click', () => {
                    addFavorite(meal, favButton);
                });

                recipeDiv.appendChild(viewButton);
                recipeDiv.appendChild(favButton);
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = `<p>No recipes found for "${query}".</p>`;
        }
};

const addFavorite = (meal, button) =>{
    const index = favorites.findIndex(fav => fav.idMeal === meal.idMeal);
    if (index === -1) {
        // Add
        favorites.push(meal);
        button.textContent = "Remove Favorite";
    } else {
        // remove
        favorites.splice(index, 1);
        button.textContent = "Add Favorite";
    }
    // obnovlenie brawl stars
    localStorage.setItem('favorites', JSON.stringify(favorites));
};

const displayFavorites = () => {
    recipeContainer.innerHTML = ""; // очисткаа
    if (favorites.length === 0) {
        recipeContainer.innerHTML = `<p>No favorite recipes found.</p>`;
        return;
    }

    favorites.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <p>Origin: ${meal.strArea}</p>
            <p>Category: ${meal.strCategory}</p>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        `;
        
        // knopkii
        const viewButton = document.createElement('button');
        viewButton.textContent = "View Recipe";
        viewButton.addEventListener('click', () => {
            openRecipe(meal);
        });

        const favButton = document.createElement('button');
        favButton.textContent = "Remove Favorite";
        favButton.addEventListener('click', () => {
            removeFavorite(meal, favButton);
        });

        recipeDiv.appendChild(viewButton);
        recipeDiv.appendChild(favButton);
        recipeContainer.appendChild(recipeDiv);
    });
};

const removeFavorite = (meal, button) => {
    const index = favorites.findIndex(fav => fav.idMeal === meal.idMeal);
    if (index !== -1) {
        // udalit
        favorites.splice(index, 1);
        button.textContent = "Add Favorite";
        // obnovit
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites(); // pokazat po novoy
    }
};

viewBtn.addEventListener('click', () => {
    displayFavorites();
});

// display recipe
const openRecipe = (meal) => {
    recipeDetails.style.display = "block"; // pokazat recipe details
    recipeDetailsContent.innerHTML = `
        <h2 class="meal-name">${meal.strMeal}</h2>
        <p>Category: ${meal.strCategory}</p>
        <p>Origin: ${meal.strArea}</p>
        <h3>Ingredients:</h3>
        <ul class="ing-list">
            ${getIngredients(meal)}
        </ul>
        <h3>Instructions:</h3>
        <p class="ins-meal">${meal.strInstructions}</p>
    `;
};

// get ingredienti
const getIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        }
        else{
            break;
        }
    }
    return ingredientsList;
};

// knopka close
closeBtn.addEventListener('click', () => {
    recipeDetails.style.display = "none"; // скрыть рецепт
});

// search knopka
searchBtn.addEventListener('click', () => {
    const query = searchBox.value.trim();
    if (query) {
        fetchRecipes(query);
    } else {
        recipeContainer.innerHTML = `<p>Please enter a search term.</p>`;
    }
});

viewBtn.addEventListener('click', () => {
    displayFavorites();
});

document.addEventListener('DOMContentLoaded', displayFavorites);
