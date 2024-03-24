function adoptAnimal(id) {
    fetch(`/animals/adopt/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animalId: id }),
    })
        .then(response => response.json())
        .then(data => {
            window.location.reload();
        })
        .catch(error => console.error('Error adopting animal', error));
}

function deleteAnimal(id) {
    fetch(`/animals/cancelAdoption/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animalId: id }),
    })
        .then(response => response.json())
        .then(data => {
            window.location.reload();
        })
        .catch(error => console.error('Error cancelling adoption', error));
}

function updateSpecies(id) {
    let newSpecies = prompt("Update species name:");
    if (newSpecies) {
        fetch(`/species/update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Name: newSpecies }),

        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(error => console.error('Error updating specimen', error));
    }
}

function deleteSpecies(id) {
    fetch(`/species/delete/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ speciesId: id }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error cdeleting species', error));
}

function updateTemperament(id) {
    let newTemperament = prompt("Update temperament");
    if (newTemperament) {
        fetch(`/temperament/update/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: newTemperament }),
        })
            .then(response => response.json())
            .then(data => {
                window.location.reload()
            })
            .catch(error => console.error('Error updating temperament', error));
    }
}


function deleteTemperament(id) {
    fetch(`/temperament/delete/${id}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error deleting temperament:', error));
}


function fetchAnimals(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => displayAnimals(data))
        .catch(error => console.error('Error:', error));
}

function sqlQuery1() {
    fetchAnimals('/animals/popular');
}

function sqlQuery2() {
    fetchAnimals('/animals/adopted');
}

function sqlQuery3() {
    fetchAnimals('/animals/by-age');
}

function sqlQuery4() {
    const startDate = '2020-01-01'; // TODO NOT COMPLETED
    const endDate = '2022-02-02'; 
    fetchAnimals(`/animals/date-range?startDate=${startDate}&endDate=${endDate}`);
}

function sqlQuery5() {
    fetchAnimals('/animals/per-size');
}

function allAnimals() {
    window.location.href = '/animals/all'
}


function displayAnimals(data) {
    const animalsList = document.querySelector('#animalList');
    animalsList.innerHTML = '';

    if (data[0] && (data[0].count !== undefined)) {
        data.forEach(item => {
            const element = document.createElement('div');
            element.classList.add('row', 'px-3', 'py-1', 'w-100');
            if (item.Name && item.count) { 
                element.innerHTML = `<span class="col py-1 bg-light">Name: ${item.Name} - Count: ${item.count}</span>`;
            } else if (item.Size && item.count) { 
                element.innerHTML = `<span class="col py-1 bg-light">Size: ${item.Size.Name} - Count: ${item.count}</span>`;
            }
            animalsList.appendChild(element);
        });
    } else { 
        data.forEach(animal => {
            const animalElement = document.createElement('div');
            animalElement.classList.add('row', 'px-3', 'py-1', 'w-100');
            animalElement.innerHTML = `
            <span class="col py-1 bg-light ">${animal.id || 'N/A'}</span>
            <span class="col py-1 bg-light">${animal.Name || 'N/A'}</span>
            <span class="col py-1 bg-light">${animal.Species?.Name || 'N/A'}</span>
            <span class="col py-1 bg-light">${formatDate(animal.Birthday) || 'N/A'}</span>
            <span class="col py-1 bg-light">${animal.Temperaments?.map(t => t.Name).join(', ') || 'N/A'}</span>
            <span class="col py-1 bg-light">${animal.Size?.Name || 'N/A'}</span>
            <span class="col py-1 bg-light">${calculateAge(animal.Birthday)}</span>
            <span class="col py-1 bg-light">${animal.Adopted ? 'Yes' : 'No'}</span>
            <span class="col py-1 bg-light text-center">Options</span>`;
            animalsList.appendChild(animalElement);
        });
        animalsList.addEventListener('click', function (event) {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'button' && !target.disabled) {
                const action = target.dataset.action;
                const animalId = target.dataset.id;
                if (action === 'adopt') {
                    adoptAnimal(animalId);
                } else if (action === 'cancel') {
                    deleteAnimal(animalId);
                }
            }
        });
    }
}

function calculateAge(birthday) {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}