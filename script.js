// Function to load initial condition buttons
function loadMainConditions() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';  // Clears the existing content

    const conditions = ['depression', 'anxiety', 'bipolar', 'schizophrenia'];
    conditions.forEach(condition => {
        const button = document.createElement('button');
        button.className = 'grid-item';
        button.innerText = condition.charAt(0).toUpperCase() + condition.slice(1);
        button.onclick = () => loadSubclasses(condition);
        container.appendChild(button);
    });

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'none'; // Hide the back button
}

// Function to load subclasses and show the back button
function loadSubclasses(condition) {
    const filePath = `guidelines/${condition}.json`;

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('grid-container');
            container.innerHTML = '';  // Clears the existing condition buttons

            const backButton = document.getElementById('back-button');
            backButton.style.display = 'block'; // Show the back button
            backButton.onclick = loadMainConditions; // Attach event handler every time it's shown

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

// Initial load of main conditions
document.addEventListener('DOMContentLoaded', loadMainConditions);
