
// To do list app
const itemContainer = document.getElementById('items');
const itemTemplate = document.getElementById('item-template');
const addButton = document.getElementById('add');
const resetButton = document.getElementById('reset-all');

let items = getItems();

function getItems() {
    const value = localStorage.getItem('todo') || '[]';

    return JSON.parse(value);
};

function setItems(items) {
    const itemsJson = JSON.stringify(items);

    localStorage.setItem('todo', itemsJson);
}

function updateItem(item, key, value) {
    item[key] = value;
    setItems(items);
    refreshList();
}

function addItem() {
    items.unshift({
        description: "",
        completed: false
    });

    setItems(items);
    refreshList();
}

function refreshList() {

    items.sort((a, b) => {
        if (a.completed) {
            return 1;
        }

        if (b.completed) {
            return -1;
        }

        return a.description < b.description ? -1 : 1;
    })
    itemContainer.innerHTML = "";
    for (const item of items) {
        const itemElement = itemTemplate.content.cloneNode(true);
        const descriptionInput = itemElement.querySelector(".item-description");
        const completedInput = itemElement.querySelector(".item-completed");

        descriptionInput.value = item.description;
        completedInput.checked = item.completed;

        descriptionInput.addEventListener("change", () => {
            updateItem(item, "description", descriptionInput.value)
        })

        completedInput.addEventListener("change", () => {
            updateItem(item, "completed", completedInput.checked)
        })
        
        itemContainer.append(itemElement);
    }
}


addButton.addEventListener("click", () => {
    addItem();
});

function resetItems() {
    items = [];

    setItems(items);
    refreshList();
};

resetButton.addEventListener("click", resetItems);

window.onload = function() {
    const savedItems = getItems();

    refreshList(savedItems);
};

// Check geolocation 

if ('geolocation' in navigator) {
    console.log('Geolocation is available.'); 
} else {
    console.log('Geolocation is not available.');
}

navigator.geolocation.getCurrentPosition(
    (position) => {
        const {latitude, longitude} = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }, 

    (error) => {
        console.error(`Error getting location: ${error.message}`);
    }
);

//Weather App



if ('geolocation' in navigator) {
    console.log('Geolocation is available.');
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const {latitude, longitude} = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            const apiKey = '97e064ab2ad23ecc888c6e78c7f41f3f'; 
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            fetch(apiUrl) 
            .then(response => response.json())
            .then(data => {
        
                const temperature = data.main.temp;
                const tempFeels = data.main.feels_like;
                const city = data.name;
                const country = data.sys.country;
        
                const tempCelsius = Math.floor(temperature - 273.15);
                const tempFahrenheit = Math.floor((tempCelsius * 9/5) + 32);

                const tempFeelsCelsius = Math.floor(tempFeels - 273.15);
                const tempFeelsFahrenheit = Math.floor((tempFeelsCelsius * 9/5) + 32);

               

                const tempCelsiusElement = document.getElementById('temp-celsius');
                const tempFahElement = document.getElementById('temp-fahrenheit');
                const tempFeelsCelsiusElement = document.getElementById('feels-celsius');
                const tempFeelsFahElement = document.getElementById('feels-fahrenheit');
                const locCity = document.getElementById('city');
                const locCountry = document.getElementById('country')

                tempCelsiusElement.innerHTML = `${tempCelsius}°C`;
                tempFahElement.innerHTML =  `${tempFahrenheit}°F`;
                tempFeelsCelsiusElement.innerHTML = `${tempFeelsCelsius}°C`;
                tempFeelsFahElement.innerHTML = `${tempFeelsFahrenheit}°F`;
                locCity.innerHTML = city;
                locCountry.innerHTML = country;


            })
        
            .catch(error => {
                console.error('Error fetching weather data:', error);
            
            });
            
        },

        (error) => {
            console.error(`Error getting location: ${error.message}`)
        }


    );
} else {
    console.log('Geolocation is not available.')
};



// See exact geolocation 



// Clock 

function displayTime() {
    const now = new Date();

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const options = {
        timeZone: userTimezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    };

    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(now);

    document.getElementById('clock').textContent = formattedTime;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = now.getDay();
    document.getElementById('current-day').textContent = `Today is ${daysOfWeek[currentDay]}`;
}




const currentDateElement =   document.getElementById('current-date');

const currentDate = new Date();

const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();

const dateString = `${month}/${day}/${year}`

currentDateElement.innerHTML = `${dateString}`;


setInterval(displayTime, 1000);

displayTime();

// sticky note 

const notesContainer = document.getElementById('sticky-notes');
const addNoteButton = document.getElementById('add-note');

getNotes().forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content);
    notesContainer.appendChild(noteElement);
});

addNoteButton.addEventListener('click', () => addNote());

function getNotes() {
    return JSON.parse(localStorage.getItem('sticky-notes') || '[]');

}


function saveNotes(notes) {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));

}

function createNoteElement(id, content) {
    const element = document.createElement('textarea');

    element.classList.add('note');
     element.style.display = 'block';
    element.value = content;
    element.placeholder = 'Empty sticky note / Double click to delete a note';

    element.addEventListener('input', ()=> {
        updateNote(id, element.value);
    });

    element.addEventListener('dblclick', () => {
        const confirmDelete = confirm('Are you sure you want to delete the note?');

        if (confirmDelete) {
            deleteNote(id, element)
        }
    })

    return element;
}

function addNote() {
    const notes = getNotes();
    const noteObject = {
        id: Math.floor(Math.random() * 100000),
        content: ''
    };

    const noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.appendChild(noteElement);
    //addNoteButton.innerHTML = 'Add another note here..';

    notes.push(noteObject);
    saveNotes(notes);

}

function updateNote(id, newContent) {
    const notes = getNotes();
    const targetNote = notes.filter((note) => note.id == id)[0];
    
    targetNote.content = newContent;
    saveNotes(notes);

    console.log('Updating note..');
    console.log(id, newContent);
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id != id);

    saveNotes(notes);
    notesContainer.removeChild(element);
    console.log('Deleting note...')

    
}


console.log(notesContainer);
console.log(addNoteButton);

// Dark mode feature 


const buttonStatus = document.getElementById('dark-mode');
  

function toggleDarkMode() {
    const body = document.body;
    const spans = document.getElementsByClassName('info');


    body.classList.toggle('dark-mode');

    for (const span of spans) {
        span.classList.toggle('info-dark-mode');
    }

    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode); 

    if (isDarkMode) {
        buttonStatus.innerHTML = '🟢 Dark Mode: On';
    
    } else {
        buttonStatus.innerHTML = '🔴 Dark Mode: Off'; 
        //buttonStatus.style.color = 'rgb(255, 255, 255)'
    }
};



document.addEventListener('DOMContentLoaded', function() {
    const isDarkMode = JSON.parse(localStorage.getItem('darkMode'));

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const spans = document.getElementsByClassName('info');

        for (const span of spans) {
            span.classList.add('info-dark-mode');
        }
    }

    if (isDarkMode) {
        buttonStatus.innerHTML = '🟢 Dark Mode: On';
    } else {
        buttonStatus.innerHTML = '🔴 Dark Mode: Off'; 
    }

   
});

const darkModeOn = document.getElementById('dark-mode');
darkModeOn.addEventListener('click',toggleDarkMode);
