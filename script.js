document.addEventListener('DOMContentLoaded', loadMainConditions);

function updateHeaderTitle(title) {
    const header = document.querySelector('header h1');
    if (title.length > 25) {
        header.textContent = title.slice(0, 25) + '...';
    } else {
        header.textContent = title;
    }
}

function loadMainConditions() {
    const container = document.getElementById('grid-container');
    container.className = 'grid-container grid-container-centered';
    container.innerHTML = '';

    const conditions = ['depression', 'anxiety', 'bipolar', 'schizophrenia'];
    conditions.forEach(condition => {
        const button = document.createElement('button');
        button.className = 'grid-item';
        button.innerText = condition.charAt(0).toUpperCase() + condition.slice(1);
        button.onclick = () => {
            loadSubclasses(condition);
            updateHeaderTitle(condition.charAt(0).toUpperCase() + condition.slice(1));
        };
        container.appendChild(button);
    });

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'none';
    const backToSubclassesButton = document.getElementById('back-to-subclasses-button');
    backToSubclassesButton.style.display = 'none';
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
            backButton.onclick = () => {
                loadMainConditions();
                updateHeaderTitle('CanPsyGuide');
            };

            const backToSubclassesButton = document.getElementById('back-to-subclasses-button');
            backToSubclassesButton.style.display = 'none';

            data.subclasses.forEach(subclass => {
                const button = document.createElement('button');
                button.className = 'subclass-button';
                button.innerText = subclass.name;
                button.onclick = () => {
                    loadGuidelines(subclass.guidelines, subclass.name, condition);
                    updateHeaderTitle(subclass.name);
                };
                container.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading the JSON file:', error);
            alert('Failed to load data. Please try again.');
        });
}

function loadGuidelines(guidelines, subclass, condition) {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'block';
    backButton.onclick = () => {
        loadMainConditions();
        updateHeaderTitle('CanPsyGuide');
    };

    const backToSubclassesButton = document.getElementById('back-to-subclasses-button');
    backToSubclassesButton.style.display = 'block';
    backToSubclassesButton.onclick = () => {
        loadSubclasses(condition);
        updateHeaderTitle(condition.charAt(0).toUpperCase() + condition.slice(1));
    };

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
            drugLink.onclick = (event) => toggleDrugDetails(drug, drugLink, event);
            drugsContainer.appendChild(drugLink);
        });

        container.appendChild(drugsContainer);

        guidelineButton.addEventListener("click", function () {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight && panel.style.maxHeight !== "0px") {
                panel.style.maxHeight = "0px";
                panel.style.padding = "0 15px";
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                panel.style.padding = "15px";
                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });
}


const categories = {
    '': ['drugclass', 'dose', 'LOE'],
    'Specific Symptom Treatment': ['Sleep', 'Pain', 'Fatigue', 'Cognitive Dysfunction'],
    'Other': ['Efficacy', 'Acceptability', 'Drug Interactions', 'Discontinuation Syndrome', 'Sedation', 'Weight Gain', 'Sexual Dysfunction', 'Other Tolerability'],
    'Notes': ['notes']
};

function createElementForKeyAndValue(key, value) {
    const element = document.createElement('div');
    element.className = 'drug-attribute';

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}  `;
    element.appendChild(title);

    const valueSpan = document.createElement('span');
    valueSpan.className = 'value';
    if (['LOE', 'Sleep', 'Pain', 'Fatigue', 'Cognitive Dysfunction'].includes(key)) {
        const pieChart = document.createElement('div');
        pieChart.className = 'pie-chart';
        const pieChartCanvas = document.createElement('canvas');
        pieChartCanvas.width = 60;
        pieChartCanvas.height = 60;
        pieChart.appendChild(pieChartCanvas);
        valueSpan.appendChild(pieChart);
        drawChart(pieChartCanvas, value);
    } else if (['Efficacy', 'Acceptability', 'Drug Interactions', 'Discontinuation Syndrome', 'Sedation', 'Weight Gain', 'Sexual Dysfunction', 'Other Tolerability'].includes(key)) {
        const icon = document.createElement('span');
        icon.className = value > 0 ? 'fa fa-thumbs-up thumbs-up' : 'fa fa-thumbs-down thumbs-down';
        valueSpan.appendChild(icon);
    } else {
        valueSpan.textContent = value;
    }

    element.appendChild(valueSpan);
    return element;
}

function appendWithHeaders(container, elements, categories) {
    for (const [category, keys] of Object.entries(categories)) {
        let section = document.createElement('div');
        section.className = 'section';

        const attributesContainer = document.createElement('div');
        attributesContainer.className = 'attributes-container';

        let attributesExist = false;

        keys.forEach(key => {
            if (elements[key]) {
                attributesContainer.appendChild(elements[key]);
                attributesExist = true;
                delete elements[key];
            }
        });

        if (attributesExist) {
            if (category) {
                const header = document.createElement('h3');
                header.textContent = category;
                header.className = 'section-title';
                section.appendChild(header);
            }
            section.appendChild(attributesContainer);
            container.appendChild(section);
        }
    }

    // Append any remaining elements
    Object.values(elements).forEach(element => container.appendChild(element));
}

function renderDrugDetails(drug) {
    let elements = {};
    for (const [key, value] of Object.entries(drug)) {
        // Skip adding name to the elements
        if (key !== 'name') {
            elements[key] = createElementForKeyAndValue(key, value);
        }
    }

    const container = document.createElement('div');
    container.className = 'drug-details drug-details-container';

    // Create the header for the drug name
    const drugHeader = document.createElement('h2');
    drugHeader.textContent = drug.name;
    drugHeader.className = 'drug-header'; // Add a class for styling
    container.appendChild(drugHeader);

    appendWithHeaders(container, elements, categories);

    return container;
}

function toggleDrugDetails(drug, drugLink, event) {
    if (event.type === 'click' && !event.target.closest('.drug-details')) {
        let existingDetails = drugLink.nextElementSibling;
        if (existingDetails && existingDetails.classList.contains('drug-details')) {
            existingDetails.style.maxHeight = 0;
            existingDetails.style.padding = '0 20px';
            existingDetails.addEventListener('transitionend', function handleTransitionEnd() {
                existingDetails.remove();
                existingDetails.removeEventListener('transitionend', handleTransitionEnd);
            });
            return;
        }

        const drugDetailsContainer = renderDrugDetails(drug);
        drugLink.after(drugDetailsContainer);

        setTimeout(() => {
            drugDetailsContainer.style.maxHeight = "300px";
            drugDetailsContainer.style.padding = '20px';
            adjustHeight(drugLink);
        }, 10);

        var panel = drugLink.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function adjustHeight(drugLink) {
    const parentPanel = drugLink.closest('.panel');
    parentPanel.style.maxHeight = parentPanel.scrollHeight + "px";
}


function drawChart(canvas, value) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 2;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const numericValue = parseInt(value, 10);

    if (numericValue > 0) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        switch (numericValue) {
            case 1:
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                break;
            case 2:
                ctx.arc(centerX, centerY, radius, 0, 1.5 * Math.PI);
                break;
            case 3:
                ctx.arc(centerX, centerY, radius, 0.5 * Math.PI, 1.5 * Math.PI);
                break;
            case 4:
                ctx.arc(centerX, centerY, radius, 0.5 * Math.PI, -0.5 * Math.PI);
                break;
        }

        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = '#00aa03';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00aa03';
        ctx.stroke();
    } else {
        ctx.beginPath();
        switch (numericValue) {
            case -1:
                ctx.rect(0, 0, width, height);
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                break;
            case -2:
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(width, centerY);
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.lineTo(0, 0);
                ctx.lineTo(centerX, 0);
                ctx.closePath();
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                break;
            case -3:
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(width, centerY);
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.lineTo(0, centerY);
                ctx.closePath();
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                break;
            case -4:
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX, 0);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, centerY);
                ctx.closePath();
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                break;
        }

        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }
}
