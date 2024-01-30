let cities = new Map();

// Function to retrieve entities items from localStorage.
function loadEntityFromLocalStorage(key) {
    // Retrieves the stored data from localStorage
    const storedData = JSON.parse(localStorage.getItem(key));

    // If there's no stored data, return an empty Map
    if (!storedData) {
        return new Map();
    }

    // Converts the stored data back into a Map
    return new Map(storedData);
}

// Function to save entities to localStorage.
function saveEntityToLocalStorage(entity, key) {
    // Retrieves existing entities from localStorage.
    const collectionList = loadEntityFromLocalStorage(key);

    // Adds the new entity to the map. Lower
    collectionList.set(entity.id.toLowerCase(), entity);

    // Stores the updated map back in localStorage.
    localStorage.setItem(key, JSON.stringify([...collectionList]));
}

// Function to abstract the CRUD operations for city object.
function CityRepository() {
    this.saveCity = function (city) {
        try {
            // Retrieve existing cities from localStorage
            cities = loadEntityFromLocalStorage('cities');

            // Add the new user to the cities array
            cities.set(city.id.toLowerCase(), city);

            // Save the updated cities array to localStorage
            saveEntityToLocalStorage(city, 'cities');

            return true; // Return true if saving succeeds
        } catch (error) {
            console.error('Error saving city:', error);
            return false; // Return false if saving fails
        }
    };

    this.findAll = function () {
        try {
            return Array.from(loadEntityFromLocalStorage('cities').values());
        } catch (error) {
            console.error('Error retrieving cities from localStorage:', error);
            return []; // Return an empty array if retrieval fails
        }
    };

    this.findById = function (cityId) {
        try {
            let foundItem = null;
            const citiesMap = loadEntityFromLocalStorage('cities');

            citiesMap.forEach((value, key) => {
                if (key === cityId.toLowerCase()) {
                    foundItem = value;
                }
            });
            return foundItem;
        } catch (error) {
            console.error('Error retrieving cities from localStorage:', error);
            return []; // Return an empty array if retrieval fails
        }
    };
}

const cityRepository = new CityRepository();