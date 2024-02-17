const userInput = document.querySelector('.user-input');
const viewBtn = document.querySelector('.view-btn');
const locationContainer = document.querySelector('.location-container');
const weatherContainer = document.querySelector('.weather-data-container');
const locationElement = document.querySelector('.location')
const stateElement = document.querySelector('.state');
const countryElement = document.querySelector('.country');
const temperatureCelsiusElement = document.querySelector('.temperature-celsius');
const temperatureFahrenheitElement = document.querySelector('.temperature-fahrenheit');
const temperatureFeelElement = document.querySelector('.temperature-feel');
const windElement = document.querySelector('.wind');
const humidityElement = document.querySelector('.humidity');
const iconElement = document.querySelector('.icon');
const weatherTypeElement = document.querySelector('.weather-type');
const warningElement = document.querySelector('.warning-location');
const timeElement = document.querySelector('.time');

viewBtn.addEventListener('click', () => {
    getData(userInput.value);
});

document.addEventListener('DOMContentLoaded', () => {
    getData('ahmedabad')
})

function getData(location) {
    try {
        let userInputData = location.trim();
        if (userInputData === "") {
            warningElement.style.visibility = "visible";
        } else {
            warningElement.style.visibility = "hidden";
        }

        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://api.weatherapi.com/v1/current.json?key=cf8f0b2edfe540168fe84553241602&q=' + userInputData);

        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

        xhr.responseType = 'json';

        xhr.onload = () => {
            if (xhr.status > 300) {
                // location not found
                if (xhr.response.error.code === 1006) {
                    userInput.value = "";
                    alert('The location you entered could not be found. Please try again.');
                }
            }

            iconElement.src = xhr.response.current.condition.icon;
            weatherTypeElement.textContent = xhr.response.current.condition.text;
            locationElement.textContent = xhr.response.location.name;
            stateElement.textContent = xhr.response.location.region + ",";
            countryElement.textContent = xhr.response.location.country;
            temperatureCelsiusElement.textContent = xhr.response.current.temp_c + "°C/ ";
            temperatureFahrenheitElement.textContent = xhr.response.current.temp_f + "°F";
            temperatureFeelElement.textContent = "Feels Like: " + xhr.response.current.feelslike_c + "°C";
            windElement.textContent = "Wind: " + xhr.response.current.wind_kph + " KMPH";
            humidityElement.textContent = "Humidity: " + xhr.response.current.humidity;

            const dateObject = new Date(xhr.response.location.localtime);
            const timeString = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12:true });

            timeElement.textContent = timeString;

            userInput.value = "";

        }

        xhr.onerror = (err) => {
            console.error(err);
            alert('Oops! Something unexpected happened. Please try again later or contact support for assistance.')
        }

        xhr.send();
    } catch (err) {
        console.log(err);
        alert('Oops! Something unexpected happened. Please try again later or contact support for assistance.');
    }
}

