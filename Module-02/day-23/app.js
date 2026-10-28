const routesContainer = document.getElementById("routes");
const favoritesContainer = document.getElementById("favorites");
const searchInput = document.getElementById("search");

let routes = [];
let favorites = JSON.parse(
    localStorage.getItem("shegerFavorites")
) || [];


async function loadRoutes() {
    try {
        const response = await fetch("data/routes.json");

        if (!response.ok) {
            throw new Error("Could not load routes.json");
        }

        routes = await response.json();

        displayRoutes(routes);
        displayFavorites();

    } catch (error) {
        console.error(error);
        routesContainer.textContent = "Could not load routes.";
    }
}

// DISPLAY ROUTES

function displayRoutes(routeList) {

    routesContainer.innerHTML = "";

    if (routeList.length === 0) {
        routesContainer.textContent = "No routes found.";
        return;
    }

    routeList.forEach(route => {

        const card = document.createElement("article");
        card.className = "route-card";

        const header = document.createElement("div");
        header.className = "route-card-header";

        const busNumber = document.createElement("span");
        busNumber.className = "bus-number";
        busNumber.textContent = `Bus ${route.routeNumber}`;

        const favoriteButton = document.createElement("button");
        favoriteButton.type = "button";
        favoriteButton.className = "favorite-btn";

        const saved = favorites.some(
            favorite => favorite.id === route.id
        );

        favoriteButton.textContent = saved ? "★" : "☆";

        if (saved) {
            favoriteButton.classList.add("active");
        }

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(route);
        });

        header.append(busNumber, favoriteButton);


        const routePath = document.createElement("div");
        routePath.className = "route-path";

        createStop(routePath, "From", route.from);
        createLine(routePath);
        createStop(routePath, "Via", route.via);
        createLine(routePath);
        createStop(routePath, "To", route.to, true);


        const footer = document.createElement("div");
        footer.className = "route-footer";

        const distance = document.createElement("span");
        distance.className = "distance";
        distance.textContent = `${route.distanceKm} km`;

        const type = document.createElement("span");
        type.textContent = route.type;

        footer.append(distance, type);


        const directions = document.createElement("a");
        directions.className = "directions-btn";
        directions.textContent = "Directions";

        directions.href =
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                route.to + ", Addis Ababa"
            )}`;

        directions.target = "_blank";
        directions.rel = "noopener noreferrer";


        card.append(
            header,
            routePath,
            footer,
            directions
        );

        routesContainer.appendChild(card);
    });
}



// CREATE STOP


function createStop(container, label, location, destination = false) {

    const stop = document.createElement("div");
    stop.className = "stop";

    const dot = document.createElement("span");
    dot.className = "stop-dot";

    if (destination) {
        dot.classList.add("destination");
    }

    const info = document.createElement("div");
    info.className = "stop-info";

    const stopLabel = document.createElement("span");
    stopLabel.className = "stop-label";
    stopLabel.textContent = label;

    const name = document.createElement("strong");
    name.textContent = location;

    info.append(stopLabel, name);
    stop.append(dot, info);

    container.appendChild(stop);
}


function createLine(container) {

    const line = document.createElement("div");

    line.className = "route-line";

    container.appendChild(line);
}



// FAVORITES


function toggleFavorite(route) {

    const exists = favorites.some(
        favorite => favorite.id === route.id
    );

    if (exists) {

        favorites = favorites.filter(
            favorite => favorite.id !== route.id
        );

    } else {

        favorites.push(route);
    }

    saveFavorites();

    displayRoutes(
        getCurrentSearchResults()
    );

    displayFavorites();
}


function saveFavorites() {

    localStorage.setItem(
        "shegerFavorites",
        JSON.stringify(favorites)
    );
}



// DISPLAY FAVORITES

function displayFavorites() {

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-favorites";

        message.textContent =
            "No saved routes yet.";

        favoritesContainer.appendChild(message);

        return;
    }


    favorites.forEach(route => {

        const favorite = document.createElement("div");

        favorite.className = "favorite-card";


        const info = document.createElement("div");

        info.className = "favorite-route-info";


        const bus = document.createElement("strong");

        bus.textContent =
            `Bus ${route.routeNumber}`;


        const routeName = document.createElement("span");

        routeName.textContent =
            `${route.from} → ${route.to}`;


        info.append(bus, routeName);


        const actions = document.createElement("div");

        actions.className = "favorite-actions";


        const directions = document.createElement("a");

        directions.className =
            "small-direction-btn";

        directions.textContent = "↗";

        directions.href =
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                route.to + ", Addis Ababa"
            )}`;

        directions.target = "_blank";


        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.type = "button";

        deleteButton.textContent = "×";


        deleteButton.addEventListener("click", () => {

            removeFavorite(route.id);

        });


        actions.append(
            directions,
            deleteButton
        );

        favorite.append(
            info,
            actions
        );

        favoritesContainer.appendChild(favorite);

    });
}

// DELETE FAVORITE


function removeFavorite(routeId) {

    favorites = favorites.filter(
        favorite => favorite.id !== routeId
    );

    saveFavorites();

    displayRoutes(
        getCurrentSearchResults()
    );

    displayFavorites();
}

// SEARCH


searchInput.addEventListener("input", function () {

    const searchTerm =
        this.value.toLowerCase().trim();


    const filteredRoutes = routes.filter(route => {

        return (
            String(route.routeNumber)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.name)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.from)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.via)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.to)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.type)
                .toLowerCase()
                .includes(searchTerm)
        );
    });


    displayRoutes(filteredRoutes);
});


// KEEP CURRENT SEARCH


function getCurrentSearchResults() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();


    if (!searchTerm) {
        return routes;
    }


    return routes.filter(route => {

        return (
            String(route.routeNumber)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.name)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.from)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.via)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.to)
                .toLowerCase()
                .includes(searchTerm)

            ||

            String(route.type)
                .toLowerCase()
                .includes(searchTerm)
        );
    });
}
loadRoutes();