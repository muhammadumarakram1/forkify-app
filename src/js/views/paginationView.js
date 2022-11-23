import View from "./view";
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function (e) {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

        // Page 1 and there are other pages
        if (curPage === 1 && numPages > 1) {
            return this._btnMarkup(curPage, 'next');
        }

        // Last Page
        if (curPage === numPages && numPages > 1) {
            return this._btnMarkup(curPage, 'prev');
        }

        // Other Pages
        if (curPage < numPages) {
            return this._btnMarkup(curPage, 'next') + this._btnMarkup(curPage, 'prev');

            ;
        }

        // Page 1 and no others
        return ``;
    }
    _btnMarkup(curPage, direction) {
        return `
        <button data-goto="${direction === 'prev' ? curPage - 1 : curPage + 1}" class="btn--inline pagination__btn--${direction}">
                <svg class="search__icon">
                  <use href="${icons}#icon-arrow-${direction === 'prev' ? 'left' : 'right'}"></use>
                </svg>
                <span>Page ${direction === 'prev' ? curPage - 1 : curPage + 1}</span>
            </button>
        `;
    }
}

export default new PaginationView();