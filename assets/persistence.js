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