const searchDiv = document.querySelector('.search')

generateSearchBox();

function generateSearchBox() {
    let searchForm = document.createElement("form");
    searchForm.className = "searchForm";
    searchForm.action = "https://duckduckgo.com/";
    searchForm.method = "get";
    searchDiv.appendChild(searchForm);

    let searchInput = document.createElement("input");
    searchInput.id = "searchInput"
    searchInput.type = "search";
    searchInput.name = "q";
    searchForm.appendChild(searchInput);

    searchInput.focus();
}