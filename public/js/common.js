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
            console.log(data);
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
            console.log(data);
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
                console.log(data);
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
