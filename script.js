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
            drugLink.onclick = () => toggleDrugDetails(drug, drugLink);
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
                panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function toggleDrugDetails(drug, drugLink) {
    let existingDetails = drugLink.nextElementSibling;
    if (existingDetails && existingDetails.classList.contains('drug-details')) {
        existingDetails.remove();
        return;
    }

    const drugDetailsContainer = document.createElement('div');
    drugDetailsContainer.className = 'drug-details';

    const drugAttributes = document.createElement('div');
    drugAttributes.className = 'drug-attributes';

    for (const [key, value] of Object.entries(drug)) {
        if (key !== 'name') {
            const detailItem = document.createElement('p');
            detailItem.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
            drugAttributes.appendChild(detailItem);
        }
    }

    const pieChart = document.createElement('div');
    pieChart.className = 'pie-chart';
    pieChart.textContent = 'Effectiveness:';
    const pieChartCanvas = document.createElement('canvas');
    pieChartCanvas.width = 100;
    pieChartCanvas.height = 100;
    pieChart.appendChild(pieChartCanvas);
    drugAttributes.appendChild(pieChart);

    drugDetailsContainer.appendChild(drugAttributes);
    drugLink.after(drugDetailsContainer);

    drawPieChart(pieChartCanvas, 75);

    addSwipeListeners(drugDetailsContainer);

    drugDetailsContainer.style.maxHeight = drugDetailsContainer.scrollHeight + "px";
    adjustHeight(drugLink);
}

function drawPieChart(canvas, percentage) {
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const x = radius;
    const y = radius;
    const endAngle = (percentage / 100) * 2 * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ddd';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, 0, endAngle);
    ctx.lineTo(x, y);
    ctx.fillStyle = percentage >= 50 ? '#00aa03' : '#ff0000';
    ctx.fill();
}

function addSwipeListeners(element) {
    let touchstartX = 0;
    let touchendX = 0;

    element.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    element.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchendX < touchstartX || touchendX > touchstartX) {
            element.remove();
        }
    }
}

function adjustHeight(drugLink) {
    const parentPanel = drugLink.closest('.panel');
    const guidelineButton = parentPanel.previousElementSibling;
    parentPanel.style.maxHeight = parentPanel.scrollHeight + "px";
    guidelineButton.classList.add('active');
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
