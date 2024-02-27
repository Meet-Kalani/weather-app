// DOM elements - static
const utilityElements = {
  userInput: document.querySelector(".location-input"),
  viewBtn: document.querySelector(".view-btn"),
  locationWarning: document.querySelector(".location-warning"),
  preloader: document.querySelector(".preloader"),
  errorMsgContainer: document.querySelector(".error-msg-container"),
  closeBtn: document.querySelector(".close-btn"),
  backdrop: document.querySelector(".backdrop"),
};

// DOM elements - Dynamic
const locationElements = {
  name: document.querySelector(".location-name"),
  state: document.querySelector(".location-state"),
  country: document.querySelector(".location-country"),
};

const temperatureElements = {
  celsius: document.querySelector(".temperature-celsius"),
  fahrenheit: document.querySelector(".temperature-fahrenheit"),
  feel: document.querySelector(".temperature-feel"),
};

const weatherInfoElements = {
  icon: document.querySelector(".weather-icon"),
  description: document.querySelector(".weather-description"),
  time: document.querySelector(".current-time"),
  secondary: {
    wind: document.querySelector(".wind-speed"),
    humidity: document.querySelector(".humidity-level"),
  },
  windDirection: document.querySelector(".wind-direction"),
  uv: document.querySelector(".uv"),
  pressure: document.querySelector(".pressure"),
};

// Event listeners
utilityElements.viewBtn.addEventListener("click", () => {
  const userInputData = utilityElements.userInput.value.trim();
  getData(userInputData);
});

document.addEventListener("DOMContentLoaded", () => {
  getData("ahmedabad");
});

utilityElements.userInput.addEventListener("keypress", (event) => {
  const pressedKey = event.key;

  if (pressedKey === "Enter") {
    const userInputData = utilityElements.userInput.value.trim();
    getData(userInputData);
  }
});

utilityElements.closeBtn.addEventListener("click", () => {
  utilityElements.backdrop.classList.add("d-none");
  utilityElements.errorMsgContainer.classList.add("d-none");
});

// Function to fetch data
async function getData(location) {
  if (!location) {
    toggleWarning(true);
    return;
  }
  toggleWarning(false);

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=cf8f0b2edfe540168fe84553241602&q=${location}`
    );

    if (!response.ok) {
      handleErrorResponse(response);
    }

    const data = await response.json();

    if (data.location) {
      updateUI(data);
    }
  } catch (error) {
    handleErrorResponse(error);
  } finally {
    utilityElements.preloader.style.display = "none";
  }
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
      humidity,
      pressure_mb,
      uv,
      wind_dir,
    },
    location: { name, region, country, localtime },
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
  weatherInfoElements.pressure.textContent = `Pressure: ${pressure_mb}mb`;
  weatherInfoElements.uv.textContent = `UV index: ${uv}`;
  weatherInfoElements.windDirection.textContent = `Wind Direction: ${wind_dir}`;

  const dateObject = new Date(localtime);
  const timeString = dateObject.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  weatherInfoElements.time.textContent = timeString;

  // Empty user input field after fetching data
  utilityElements.userInput.value = "";
}

// Function to handle errors in the response
function handleErrorResponse(data) {
  // Handle specific error scenarios
  const displayError = utilityElements.errorMsgContainer.children[0];
  utilityElements.backdrop.classList.remove("d-none");
  utilityElements.errorMsgContainer.classList.remove("d-none");
  utilityElements.userInput.value = "";

  if (data.status === 400) {
    displayError.textContent =
      "The location you entered could not be found. Please try again!";
  } else if (data.status > 400 && data.status < 500) {
    displayError.textContent =
      "Sorry, we encountered an error processing your request. Please try again later.";
  } else {
    displayError.textContent = "Server Error: Please try again later.";
  }
}

// Function to update the visibility of the warning element
function toggleWarning(showWarning) {
  utilityElements.locationWarning.style.visibility = showWarning
    ? "visible"
    : "hidden";
}
