import * as model from './model.js';
import ReciepeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import BookmarksView from './views/bookmarkView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import PaginationView from './views/paginationView.js';
import AddRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import { async } from 'regenerator-runtime/runtime';

///////////////////////////////////////


async function controlRecipe() {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    ReciepeView.renderSpinner();
    ResultsView.update(model.getSearchResultsPage());
    BookmarksView.update(model.state.bookmarks);

    // 1. Loading Recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;
    ReciepeView.render(model.state.recipe);
    // Rendering Recipe
  } catch (error) {
    ReciepeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    const query = SearchView.getQuery();
    if (!query) return;
    ResultsView.renderSpinner();
    await model.loadSearchResults(query);
    // ResultsView.render(model.state.search.results);
    ResultsView.render(model.getSearchResultsPage());
    PaginationView.render(model.state.search);

  } catch (error) {
    ResultsView.renderError();
  }
};

function controlPagination(goToPage) {
  ResultsView.render(model.getSearchResultsPage(goToPage));
  PaginationView.render(model.state.search);
};

function controlServings(newServings) {
  model.updateServings(newServings);
  // ReciepeView.render(model.state.recipe);
  ReciepeView.update(model.state.recipe);

};

function controlAddBookmark() {
  const recipe = model.state.recipe;
  (!recipe.bookmarked) ? model.addBookmark(recipe) : model.deleteBookmark(recipe.id);
  ReciepeView.update(recipe);
  BookmarksView.render(model.state.bookmarks)
}

function controlBookmark() {
  BookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    AddRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    ReciepeView.render(model.state.recipe);
    AddRecipeView.renderMessage();
    BookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    AddRecipeView.renderError(error.message);
    console.log(error);
  }
}

function init() {
  BookmarksView.addHandlerRender(controlBookmark);
  ReciepeView.addHandlerRender(controlRecipe);
  ReciepeView.addHandlerUpdateServings(controlServings);
  ReciepeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addHandlerUpload(controlAddRecipe);

};
init();