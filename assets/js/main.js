// DOM elements
const userInput = document.querySelector('.location-input');
const viewBtn = document.querySelector('.view-btn');
const warningElement = document.querySelector('.location-warning');
const preloader = document.querySelector('.preloader');

// UI-related elements
const locationElements = {
    name: document.querySelector('.location-name'),
    state: document.querySelector('.location-state'),
    country: document.querySelector('.location-country')
};

const temperatureElements = {
    celsius: document.querySelector('.temperature-celsius'),
    fahrenheit: document.querySelector('.temperature-fahrenheit'),
    feel: document.querySelector('.temperature-feel')
};

const weatherInfoElements = {
    icon: document.querySelector('.weather-icon'),
    description: document.querySelector('.weather-description'),
    time: document.querySelector('.current-time'),
    secondary: {
        wind: document.querySelector('.wind-speed'),
        humidity: document.querySelector('.humidity-level')
    }
};

// Event listeners
viewBtn.addEventListener('click', () => {
    const userInputData = userInput.value.trim();
    getData(userInputData);
});

document.addEventListener('DOMContentLoaded', () => {
    getData('ahmedabad');
});

// Function to fetch data
function getData(location) {
    const userInputData = location.trim();
    updateWarningVisibility(!userInputData);

    if (!userInputData) return;

    // Create XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.weatherapi.com/v1/current.json?key=cf8f0b2edfe540168fe84553241602&q=${userInputData}`);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.responseType = 'json';

    // Event handler when the request is completed
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            updateUI(xhr.response);
        } else {
            handleErrorResponse(xhr.response);
        }
        preloader.style.display = 'none';
    };

    // Event handler for errors
    xhr.onerror = function (err) {
        console.error(err);
        alert('Oops! Something unexpected happened. Please try again later or contact support for assistance.');
        preloader.style.display = 'none';
    };

    // Send the request
    xhr.send();
}

// Function to update UI with fetched data
function updateUI(data) {
    const {
        current: {
            condition: { icon, text },
            temp_c,
            temp_f,
            feelslike_c,
            wind_kph,
            humidity
        },
        location: { name, region, country, localtime }
    } = data;

    weatherInfoElements.icon.src = icon;
    weatherInfoElements.description.textContent = text;
    locationElements.name.textContent = name;
    locationElements.state.textContent = `${region},`;
    locationElements.country.textContent = country;
    temperatureElements.celsius.textContent = `${temp_c}°C/`;
    temperatureElements.fahrenheit.textContent = `${temp_f}°F`;
    temperatureElements.feel.textContent = `Feels Like: ${feelslike_c}°C`;
    weatherInfoElements.secondary.wind.textContent = `Wind: ${wind_kph} KMPH`;
    weatherInfoElements.secondary.humidity.textContent = `Humidity: ${humidity}`;

    const dateObject = new Date(localtime);
    const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    weatherInfoElements.time.textContent = timeString;
}

// Function to handle errors in the response
function handleErrorResponse(data) {
    // Handle specific error scenarios
    if (data.error && data.error.code === 1006) {
        userInput.value = '';
        alert('The location you entered could not be found. Please try again.');
    } else {
        console.error(data);
        alert('Oops! Something unexpected happened. Please try again later or contact support for assistance.');
    }
}

// Function to update the visibility of the warning element
function updateWarningVisibility(showWarning) {
    warningElement.style.visibility = showWarning ? 'visible' : 'hidden';
}
