const userInput = document.querySelector('.location-input');
const viewBtn = document.querySelector('.view-btn');
const locationContainer = document.querySelector('.location-container');
const weatherInfoContainer = document.querySelector('.weather-info-container');
const locationNameElement = document.querySelector('.location-name')
const locationStateElement = document.querySelector('.location-state');
const locationCountryElement = document.querySelector('.location-country');
const temperatureCelsiusElement = document.querySelector('.temperature-celsius');
const temperatureFahrenheitElement = document.querySelector('.temperature-fahrenheit');
const temperatureFeelElement = document.querySelector('.temperature-feel');
const windElement = document.querySelector('.wind-speed');
const humidityElement = document.querySelector('.humidity-level');
const weatherIconElement = document.querySelector('.weather-icon');
const weatherTypeElement = document.querySelector('.weather-description');
const warningElement = document.querySelector('.location-warning');
const currentTimeElement = document.querySelector('.current-time');

viewBtn.addEventListener('click', () => {
    getData(userInput.value);
});

document.addEventListener('DOMContentLoaded', () => {
    getData('ahmedabad')
})

function getData(location) {
    try {
        let userInputData = location.trim();
        warningElement.style.visibility = (!userInputData) ? "visible" : "hidden";
        if(!userInputData) return;

        let xhr = new XMLHttpRequest();

        xhr.open('GET', `http://api.weatherapi.com/v1/current.json?key=cf8f0b2edfe540168fe84553241602&q=${userInputData}`); 

        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

        xhr.responseType = 'json';

        xhr.onload = () => {
            console.log(xhr.response)
            if (xhr.status > 300) {
                // location not found
                if (xhr.response.error.code === 1006) {
                    userInput.value = "";
                    alert('The location you entered could not be found. Please try again.');
                }
                return;
            }

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
            } = xhr.response;

            weatherIconElement.src = icon;
            weatherTypeElement.textContent = text;
            locationNameElement.textContent = name;
            locationStateElement.textContent = `${region},`;
            locationCountryElement.textContent = country;
            temperatureCelsiusElement.textContent = `${temp_c}°C/`;
            temperatureFahrenheitElement.textContent = `${temp_f}°F`;
            temperatureFeelElement.textContent = `Feels Like: ${feelslike_c}°C`;
            windElement.textContent = `Wind: ${wind_kph} KMPH`;
            humidityElement.textContent = `Humidity: ${humidity}`;

            const dateObject = new Date(localtime);
            const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            currentTimeElement.textContent = timeString;
            userInput.value = "";
        }

        xhr.onerror = (err) => {
            console.error(err);
            alert('Oops! Something unexpected happened. Please try again later or contact support for assistance.')
        }
        xhr.send();
    } catch (err) {
        console.error(err);
        alert('Oops! Something unexpected happened. Please try again later or contact support for assistance.');
    }
}

