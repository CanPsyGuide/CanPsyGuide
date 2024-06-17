document.addEventListener('DOMContentLoaded', loadMainConditions);

function updateHeaderTitle(title) {
    const header = document.querySelector('header h1');
    header.textContent = title.length > 25 ? title.slice(0, 25) + '...' : title;
}

function loadMainConditions() {
    const container = document.getElementById('grid-container');
    container.className = 'grid-container grid-container-centered';
    container.innerHTML = '';

    const conditions = ['depression', 'anxiety', 'bipolar', 'about'];
    conditions.forEach(condition => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-3 my-2 d-flex justify-content-center';

        const button = document.createElement('button');
        button.className = condition === 'about' ? 'btn btn-about grid-item' : 'btn btn-primary grid-item';
        button.innerText = condition.charAt(0).toUpperCase() + condition.slice(1);
        button.onclick = () => {
            if (condition === 'about') {
                loadAboutSection();
                updateHeaderTitle('About');
            } else {
                loadSubclasses(condition);
                updateHeaderTitle(condition.charAt(0).toUpperCase() + condition.slice(1));
            }
        };

        colDiv.appendChild(button);
        container.appendChild(colDiv);
    });

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'none';
    const backToSubclassesButton = document.getElementById('back-to-subclasses-button');
    backToSubclassesButton.style.display = 'none';
}

function loadAboutSection() {
    const container = document.getElementById('grid-container');
    container.className = 'grid-container grid-container-centered';
    container.innerHTML = '';

    const aboutText = `
    <div class="about-section">
    <h2>About CanPsyGuide</h2>
    <p>This tool does not provide medical advice and is intended for informational purposes only, specifically to facilitate quick referencing of Canadian treatment guidelines. No information on this site is intended to substitute for professional medical advice, clinical supervision, diagnosis, or treatment. Always seek the advice of your physician or clinical supervisor with any questions you may have regarding a medical condition or treatment.</p>
    <p>Be sure to read the full guidelines before using this tool as a quick reference. Remain up-to-date with regards to any guideline updates, as this tool may not reflect the most recent guidelines. Current guidelines referenced:</p>
    <ul>
        <li><a href="https://journals.sagepub.com/doi/full/10.1177/07067437241245384" target="_blank">Canadian Network for Mood and Anxiety Treatments (CANMAT) 2023 Update on Clinical Guidelines for Management of Major Depressive Disorder in Adults</a></li>
        <li><a href="https://bmcpsychiatry.biomedcentral.com/articles/10.1186/1471-244X-14-S1-S1" target="_blank">Canadian Anxiety Disorders Guidelines Initiative: Clinical practice guidelines for the management of anxiety, posttraumatic stress, and obsessive-compulsive disorders</a></li>
        <li><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5947163/" target="_blank">Canadian Network for Mood and Anxiety Treatments (CANMAT) and International Society for Bipolar Disorders (ISBD) 2018 guidelines for the management of patients with bipolar disorder</a></li>
    </ul>
    <p>If you would like to contribute to the development, updating, or maintenance of this clinical tool or if you have any feedback or suggestions, please contact <a href="mailto:canpsyguide@gmail.com">Alexander Levit or Victor Li</a>.</p>
    <p>Special thanks to <a href="https://www.linkedin.com/in/rohin-attrey/" target="_blank">Rohin Attrey</a> for developing this application.</p>
    <p>This tool is available to you for free through the support of the UBC Department of Psychiatry's PGME CanMEDS Award.</p>
    <p>If you are interested in the source code or would like to contribute, visit our <a href="https://github.com/CanPsyGuide/CanPsyGuide" target="_blank">GitHub repository</a>.</p>
</div>

    `;

    const aboutDiv = document.createElement('div');
    aboutDiv.className = 'col-12 my-2';
    aboutDiv.innerHTML = aboutText;

    container.appendChild(aboutDiv);

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'block';
    backButton.onclick = () => {
        loadMainConditions();
        updateHeaderTitle('CanPsyGuide');
    };

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
                button.className = 'btn btn-primary subclass-button my-2 w-100';
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
    container.style.display = 'none';

    const accordionContainer = document.getElementById('accordion-container');
    accordionContainer.style.display = 'block';
    accordionContainer.innerHTML = '';

    const backButton = document.getElementById('back-button');
    backButton.style.display = 'block';
    backButton.onclick = () => {
        loadMainConditions();
        updateHeaderTitle('CanPsyGuide');
        accordionContainer.style.display = 'none';
        container.style.display = 'block';
    };

    const backToSubclassesButton = document.getElementById('back-to-subclasses-button');
    backToSubclassesButton.style.display = 'block';
    backToSubclassesButton.onclick = () => {
        loadSubclasses(condition);
        updateHeaderTitle(condition.charAt(0).toUpperCase() + condition.slice(1));
        accordionContainer.style.display = 'none';
        container.style.display = 'block';
    };

    guidelines.forEach((guide, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        cardHeader.id = `heading-${index}`;
        cardHeader.setAttribute('data-toggle', 'collapse');
        cardHeader.setAttribute('data-target', `#collapse-${index}`);
        cardHeader.setAttribute('aria-expanded', 'true');
        cardHeader.setAttribute('aria-controls', `collapse-${index}`);

        const h5 = document.createElement('h5');
        h5.className = 'mb-0';

        const button = document.createElement('button');
        button.className = 'btn btn-link';
        button.type = 'button';
        button.innerText = guide.level;
        button.style.pointerEvents = 'none'; // Prevent pointer events on button itself

        h5.appendChild(button);
        cardHeader.appendChild(h5);
        card.appendChild(cardHeader);

        const collapseDiv = document.createElement('div');
        collapseDiv.id = `collapse-${index}`;
        collapseDiv.className = 'collapse';
        collapseDiv.setAttribute('aria-labelledby', `heading-${index}`);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        guide.drugs.forEach(drug => {
            const drugLink = document.createElement('div');
            drugLink.className = 'drug-menu-item my-1';
            drugLink.innerText = drug.name;
            drugLink.onclick = (event) => toggleDrugDetails(drug, drugLink, event);
            cardBody.appendChild(drugLink);
        });

        collapseDiv.appendChild(cardBody);
        card.appendChild(collapseDiv);
        accordionContainer.appendChild(card);
    });
}

function toggleDrugDetails(drug, drugLink, event) {
    if (event.type === 'click' && !event.target.closest('.drug-details')) {
        let existingDetails = drugLink.nextElementSibling;
        if (existingDetails && existingDetails.classList.contains('drug-details')) {
            existingDetails.style.maxHeight = '0px';
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

        const panel = drugLink.nextElementSibling;
        if (panel && panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else if (panel) {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}


function adjustHeight(drugLink) {
    const parentPanel = drugLink.closest('.panel');
    if (parentPanel) {
        parentPanel.style.maxHeight = parentPanel.scrollHeight + "px";
    }
}



function getPriority(key) {
    if (['LOE', 'Sleep', 'Pain', 'Fatigue', 'Cognitive Dysfunction', 'Acute Mania', 'PreventAME', 'Prevent Mania', 'Prevent Depression', 'Acute Depression'].includes(key)) {
        return 1; // Circles/Pies
    } else if (['Efficacy', 'Acceptability', 'Drug Interactions', 'Discontinuation Syndrome', 'Sedation', 'Weight Gain', 'Sexual Dysfunction', 'Other Tolerability', 'Acute Safety'].includes(key)) {
        return 2; // Thumbs
    } else if (/^\++$/.test(key) || /^\-+$/.test(key)) {
        return 3; // ++/--
    } else {
        return 4; // Everything else
    }
}

const sectionMapping = {
    '': ['Drug Class', 'Dose', 'LOE'],
    'Treatment Considerations': ['Sleep', 'Pain', 'Fatigue', 'Cognitive Dysfunction', 'Maintenance Safety'],
    'Advantages': [],
    'Disadvantages': [],
    'Notes': ['Notes']
};

const advantagesConditions = {
    'Efficacy': 'up',
    'Acceptability': 'up',
    'Other Tolerability': 'up'
};

const disadvantagesConditions = {
    'Drug Interactions': 'down',
    'Discontinuation Syndrome': 'down',
    'Sedation': 'down',
    'Weight Gain': 'down',
    'Sexual Dysfunction': 'down'
};

function createElementForKeyAndValue(key, value, isNotes = false) {
    const element = document.createElement('div');
    element.className = 'drug-attribute';
    element.setAttribute('data-key', key);

    if (!isNotes) {
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}`;
        element.appendChild(title);
    }

    const valueSpan = document.createElement('div');
    valueSpan.className = 'value';

    if (['Drug Class', 'Dose', 'LOE'].includes(key)) {
        element.classList.add('first-section-attribute'); // Add specific class for first section attributes
    }

    if (['LOE', 'Sleep', 'Pain', 'Fatigue', 'Cognitive Dysfunction', 'Acute Mania', 'PreventAME', 'Prevent Mania', 'Prevent Depression', 'Acute Depression'].includes(key)) {
        const pieChart = document.createElement('div');
        pieChart.className = 'pie-chart';
        const pieChartCanvas = document.createElement('canvas');
        pieChartCanvas.width = 60;
        pieChartCanvas.height = 60;
        pieChart.appendChild(pieChartCanvas);
        valueSpan.appendChild(pieChart);
        drawChart(pieChartCanvas, value);
    } else if (advantagesConditions[key] || disadvantagesConditions[key]) {
        const icon = document.createElement('span');
        if (value > 0) {
            icon.className = 'fa fa-arrow-up arrow-up';
            if (advantagesConditions[key] === 'up') {
                element.setAttribute('data-category', 'Advantages');
                icon.classList.add('arrow-advantage');
            } else if (disadvantagesConditions[key] === 'down') {
                element.setAttribute('data-category', 'Disadvantages');
                icon.classList.add('arrow-disadvantage');
            }
        } else if (value < 0) {
            icon.className = 'fa fa-arrow-down arrow-down';
            if (disadvantagesConditions[key] === 'down') {
                element.setAttribute('data-category', 'Advantages');
                icon.classList.add('arrow-advantage');
            } else if (advantagesConditions[key] === 'up') {
                element.setAttribute('data-category', 'Disadvantages');
                icon.classList.add('arrow-disadvantage');
            }
        }
        valueSpan.appendChild(icon);
    } else if (/^\++$/.test(value) || /^\-+$/.test(value)) {
        element.classList.add('plus-minus-attribute'); // Add specific class for ++/---
        const colorClass = getSymbolColorClass(value);
        const symbols = value.split('').map(char => {
            const span = document.createElement('span');
            span.className = colorClass;
            span.textContent = char;
            return span;
        });
        symbols.forEach(span => valueSpan.appendChild(span));
    } else {
        valueSpan.textContent = value;
    }

    element.appendChild(valueSpan);
    return element;
}

function renderDrugDetails(drug) {
    let sections = {};
    for (const sectionName in sectionMapping) {
        sections[sectionName] = [];
    }

    for (const [key, value] of Object.entries(drug)) {
        if (key !== 'name' && key !== 'url') {
            const isNotes = sectionMapping['Notes'] && sectionMapping['Notes'].includes(key);
            const element = createElementForKeyAndValue(key, value, isNotes);
            const category = element.getAttribute('data-category') || '';
            if (category) {
                sections[category].push(element);
            } else {
                let found = false;
                for (const sectionName in sectionMapping) {
                    if (sectionMapping[sectionName].includes(key)) {
                        sections[sectionName].push(element);
                        if (sectionName === Object.keys(sectionMapping)[0]) {
                            element.classList.add('first-section-attribute'); // Add specific class
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sections['Treatment Considerations'].push(element);
                }
            }
        }
    }

    const container = document.createElement('div');
    container.className = 'drug-details drug-details-container card my-2';

    const drugHeader = document.createElement('h2');
    drugHeader.className = 'drug-header card-header text-center';

    if (drug.url) {
        const link = document.createElement('a');
        link.href = drug.url;
        link.target = '_blank';
        link.textContent = drug.name;
        link.title = 'Click for more information'; // Tooltip text
        drugHeader.appendChild(link);
    } else {
        drugHeader.textContent = drug.name;
    }

    container.appendChild(drugHeader);

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const createSection = (title, elementsArray, isFirstSection = false, isNotes = false) => {
        if (elementsArray.length === 0) return null;

        const section = document.createElement('div');
        section.className = 'section' + (isFirstSection ? ' first-section' : '') + (isNotes ? ' notes-section' : '');

        const header = document.createElement('h3');
        header.className = 'section-header';
        header.textContent = title;
        section.appendChild(header);

        const gridRow = document.createElement('div');
        gridRow.className = isFirstSection ? 'first-section-container' : 'row';

        elementsArray.forEach(element => {
            const colDiv = document.createElement('div');
            colDiv.className = isFirstSection ? 'col-4 first-section-item' : (isNotes ? 'col-12' : 'col-6 col-md-4 col-lg-2');
            colDiv.appendChild(element);
            gridRow.appendChild(colDiv);
        });

        section.appendChild(gridRow);
        return section;
    };

    let isFirstSection = true;
    for (const sectionName in sections) {
        const isNotes = sectionName.toLowerCase().includes('notes');
        const section = createSection(sectionName, sections[sectionName], isFirstSection, isNotes);
        if (section) cardBody.appendChild(section);
        isFirstSection = false; 
    }

    container.appendChild(cardBody);

    return container;
}

function getSymbolColorClass(value) {
    if (/^\++$/.test(value)) {
        return 'positive-symbol';
    } else if (/^\-+$/.test(value)) {
        return 'negative-symbol';
    }
    return '';
}




function toggleDrugDetails(drug, drugLink, event) {
    if (event.type === 'click' && !event.target.closest('.drug-details')) {
        let existingDetails = drugLink.nextElementSibling;
        if (existingDetails && existingDetails.classList.contains('drug-details')) {
            existingDetails.style.maxHeight = '0px';
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

        const panel = drugLink.nextElementSibling;
        if (panel && panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else if (panel) {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function adjustHeight(drugLink) {
    const parentPanel = drugLink.closest('.panel');
    if (parentPanel) {
        parentPanel.style.maxHeight = parentPanel.scrollHeight + "px";
    }
}





// Helper function to get the appropriate color class based on the symbol
function getSymbolColorClass(symbol) {
    switch (symbol) {
        case '+':
            return 'text-success'; // Green
        case '++':
            return 'text-warning'; // Yellow
        case '+++':
            return 'text-danger'; // Red
        case '-':
            return 'text-success'; // Green
        case '--':
            return 'text-warning'; // Yellow
        case '---':
            return 'text-danger'; // Red
        default:
            return '';
    }
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
                header.className = 'header-title'; // Use the shared class for section headers
                section.appendChild(header);
            }
            section.appendChild(attributesContainer);
            container.appendChild(section);
        }
    }

    // Append any remaining elements
    Object.values(elements).forEach(element => container.appendChild(element));
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
