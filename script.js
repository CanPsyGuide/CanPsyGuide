function loadMainConditions() {
    const container = document.getElementById('grid-container');
    container.className = 'grid-container grid-container-centered'; 
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
    backButton.style.display = 'none';
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

            const backToSubclassesButton = document.getElementById('back-to-subclasses-button');
            backToSubclassesButton.style.display = 'none';

            data.subclasses.forEach(subclass => {
                const button = document.createElement('button');
                button.className = 'subclass-button';
                button.innerText = subclass.name;
                button.onclick = () => loadGuidelines(subclass.guidelines, condition);
                container.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
            alert('Failed to load data. Please try again.');
        });
}


document.addEventListener('DOMContentLoaded', loadMainConditions);


function loadGuidelines(guidelines, condition) {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'block';
    backButton.onclick = () => loadMainConditions();

    const backToSubclassesButton = document.getElementById('back-to-subclasses-button');
    backToSubclassesButton.style.display = 'block';
    backToSubclassesButton.onclick = () => loadSubclasses(condition);

    guidelines.forEach(guide => {
        const guidelineButton = document.createElement('button');
        guidelineButton.className = 'accordion';
        guidelineButton.innerText = guide.level;
        container.appendChild(guidelineButton);

        const drugsContainer = document.createElement('div');
        drugsContainer.className = 'panel';

        guide.drugs.forEach(drug => {
            const drugLink = document.createElement('div');
            drugLink.className = 'drug-menu-item';
            drugLink.innerText = drug.name;
            drugLink.onclick = () => openDrugDetailsModal(drug);
            drugsContainer.appendChild(drugLink);
        });

        container.appendChild(drugsContainer);

        guidelineButton.addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });
}


function openDrugDetailsModal(drug) {
    const modal = document.getElementById('drugModal');
    const nameElement = document.getElementById('drugName');
    const attributesElement = document.getElementById('drugAttributes');

    nameElement.textContent = drug.name;
    attributesElement.innerHTML = ''; // Clear previous content

    // Dynamically create a list of attributes
    for (const [key, value] of Object.entries(drug)) {
        if (key !== 'name') { // Avoid repeating the drug name
            const detailItem = document.createElement('p');
            detailItem.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
            attributesElement.appendChild(detailItem);
        }
    }

    modal.style.display = 'block'; // Display the modal
}

document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.querySelector('.modal .close');
    if (closeButton) {
        closeButton.onclick = closeModal;
    }
});

function closeModal() {
    const modal = document.getElementById('drugModal');
    modal.style.display = 'none';
}


// for lst clicked guideline

