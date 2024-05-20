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

document.addEventListener('DOMContentLoaded', loadMainConditions);

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

function toggleDrugDetails(drug, drugLink, event) {
    if (event.type === 'click' && !event.target.closest('.drug-details')) {  // Ensure click is not from inside the details
        let existingDetails = drugLink.nextElementSibling;
        if (existingDetails && existingDetails.classList.contains('drug-details')) {
            existingDetails.style.maxHeight = 0; // Start the transition
            existingDetails.style.padding = '0 20px'; // Adjust padding for transition
            existingDetails.addEventListener('transitionend', function handleTransitionEnd() {
                existingDetails.remove();
                existingDetails.removeEventListener('transitionend', handleTransitionEnd);
            });
            return;
        }

        const drugDetailsContainer = document.createElement('div');
        drugDetailsContainer.className = 'drug-details';
        drugDetailsContainer.style.maxHeight = 0; // Start with zero height for animation
        drugDetailsContainer.style.padding = '0 20px'; // Adjust padding for transition

        const drugAttributes = document.createElement('div');
        drugAttributes.className = 'drug-attributes';

        for (const [key, value] of Object.entries(drug)) {
            if (key !== 'name' && key !== 'LOE') {
                const title = document.createElement('h4');
                title.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}`;
                const detailItem = document.createElement('p');
                detailItem.textContent = value;
                drugAttributes.appendChild(title);
                drugAttributes.appendChild(detailItem);
            }
        }

        const loeTitle = document.createElement('h4');
        loeTitle.textContent = 'Level of Evidence';
        const pieChart = document.createElement('div');
        pieChart.className = 'pie-chart';
        const pieChartCanvas = document.createElement('canvas');
        pieChartCanvas.width = 50;
        pieChartCanvas.height = 50;
        pieChart.appendChild(pieChartCanvas);
        drugAttributes.appendChild(loeTitle);
        drugAttributes.appendChild(pieChart);

        drugDetailsContainer.appendChild(drugAttributes);
        drugLink.after(drugDetailsContainer);

        drawChart(pieChartCanvas, drug.LOE);

        setTimeout(() => {
            drugDetailsContainer.style.maxHeight = "300px"; // Set max height
            drugDetailsContainer.style.padding = '20px'; // Adjust padding for transition
            adjustHeight(drugLink);
        }, 10); // Allow a brief pause to apply the maxHeight

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
    const guidelineButton = parentPanel.previousElementSibling;
    parentPanel.style.maxHeight = parentPanel.scrollHeight + "px";
    guidelineButton.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drug-menu-item').forEach(item => {
        item.addEventListener('click', function(event) {
            toggleDrugDetails(drug, this, event);
        });
    });
});


function drawChart(canvas, loe) {
    canvas.width = 60;  // Increased size to allow for padding
    canvas.height = 60; // Increased size to allow for padding

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 2; // Adjust radius to allow for padding
    const centerX = width / 2;
    const centerY = height / 2;

    // Convert LOE to a number
    const loeValue = parseInt(loe, 10);

    ctx.clearRect(0, 0, width, height);

    if (loeValue > 0) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);

        switch (loeValue) {
            case 1:
                // Full circle
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                break;
            case 2:
                // Three-quarters circle (leave out top right quadrant)
                ctx.arc(centerX, centerY, radius, 0, 1.5 * Math.PI);
                break;
            case 3:
                // Half circle (leave out right half)
                ctx.arc(centerX, centerY, radius, 0.5 * Math.PI, 1.5 * Math.PI);
                break;
            case 4:
                // Quarter circle (leave out top right and bottom right quadrants, fill top left)
                ctx.arc(centerX, centerY, radius, 0.5 * Math.PI, -0.5 * Math.PI);
                break;
        }

        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = '#00aa03';
        ctx.fill();

        // Draw the outline
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00aa03';
        ctx.stroke();
    } else {
        ctx.beginPath();
        switch (loeValue) {
            case -1:
                // Full square
                ctx.rect(0, 0, width, height);
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                break;
            case -2:
                // Exclude the bottom right quadrant
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
                // Exclude the bottom half
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
                // Only the top left quadrant
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX, 0);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, centerY);
                ctx.closePath();
                ctx.fillStyle = '#ff0000';
                ctx.fill();
                break;
        }
        // Draw the outline
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }
}

function updateHeaderTitle(title) {
    const header = document.querySelector('header h1');
    if (title.length > 25) { 
        header.textContent = title.slice(0, 25) + '...'; 
    } else {
        header.textContent = title;
    }
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
            element.style.maxHeight = 0; // Start the transition
            element.style.padding = '0 20px'; // Adjust padding for transition
            element.addEventListener('transitionend', function handleTransitionEnd() {
                element.remove();
                element.removeEventListener('transitionend', handleTransitionEnd);
            });
        }
    }
}

function adjustHeight(drugLink) {
    const parentPanel = drugLink.closest('.panel');
    const guidelineButton = parentPanel.previousElementSibling;
    parentPanel.style.maxHeight = parentPanel.scrollHeight + "px";
    guidelineButton.classList.add('active');
}
