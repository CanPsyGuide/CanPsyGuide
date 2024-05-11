function loadSubclasses(condition) {
    // Path to JSON files
    const filePath = `guidelines/${condition}.json`;

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('grid-container');
            container.innerHTML = '';  // Clears the existing condition buttons

            // Create new buttons for subclasses
            data.subclasses.forEach(subclass => {
                const button = document.createElement('button');
                button.className = 'grid-item';
                button.innerText = subclass.name;
                button.onclick = () => loadDetails(subclass.id); // Function to load more details
                container.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
            alert('Failed to load data. Please try again.');
        });
}

function loadDetails(subclassId) {
    // Placeholder function for loading more detailed content
    console.log(`Load details for ${subclassId}`);
}


function loadSubclasses(condition) {
    const filePath = `guidelines/${condition}.json`;
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('grid-container');
            container.innerHTML = '';  // Clears the existing content
            document.getElementById('back-button').style.display = 'block'; // Show the back button

            data.subclasses.forEach(subclass => {
                const button = document.createElement('button');
                button.className = 'grid-item';
                button.innerText = subclass.name;
                button.onclick = () => alert('Load details for ' + subclass.name);
                container.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
            alert('Failed to load data. Please try again.');
        });
}

function loadMainConditions() {
    window.location.reload(); // Or hide back button and restore initial grid
    document.getElementById('back-button').style.display = 'none'; // Hide the back button
}
