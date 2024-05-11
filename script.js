function loadMainConditions() {
    const container = document.getElementById('grid-container');
    container.className = 'grid-container grid-container-centered';  // Use centered for main buttons
    container.innerHTML = '';

    const conditions = ['depression', 'anxiety', 'bipolar', 'schizophrenia'];
    conditions.forEach(condition => {
        const button = document.createElement('button');
        button.className = 'grid-item';
        button.innerText = condition.charAt(0).toUpperCase() + condition.slice(1);
        button.onclick = () => loadSubclasses(condition);
        container.appendChild(button);
    });

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'none'; // Hide the back button when viewing main conditions
}

function loadSubclasses(condition) {
    const filePath = `guidelines/${condition}.json`;

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('grid-container');
            container.className = 'grid-container grid-container-vertical';
            container.innerHTML = '';

            const backButton = document.getElementById('back-button');
            backButton.style.display = 'block';
            backButton.onclick = loadMainConditions;

            data.subclasses.forEach(subclass => {
                const button = document.createElement('button');
                button.className = 'subclass-button';
                button.innerText = subclass.name;
                button.onclick = () => loadGuidelines(subclass.guidelines);
                container.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
            alert('Failed to load data. Please try again.');
        });
}


document.addEventListener('DOMContentLoaded', loadMainConditions);


function loadGuidelines(guidelines) {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';  // Clear the container for guideline buttons

    guidelines.forEach(guide => {
        const button = document.createElement('button');
        button.className = 'subclass-button';
        button.innerText = guide.level; // Assumes 'guide.level' is a property containing the text
        button.onclick = () => {
            console.log(`Details for ${guide.level}`); // Placeholder for detailed view
        };
        container.appendChild(button);
    });
}
