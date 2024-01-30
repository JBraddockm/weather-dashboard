let cities = new Map();

// Function to retrieve entities items from localStorage.
function loadEntityFromLocalStorage(key) {
    // Retrieve the stored data from localStorage
    const storedData = JSON.parse(localStorage.getItem(key));

    // If there's no stored data, return an empty Map
    if (!storedData) {
        return new Map();
    }

    // Convert the stored data back into a Map
    return new Map(storedData);
}