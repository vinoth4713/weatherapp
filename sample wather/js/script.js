const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const weatherOutput = document.querySelector(".weatherOutput"); // Target the output container
const apikey = "8e644712eab74673fde379b617d9bc51";

weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError("Could not fetch weather data.");
        } finally {
            cityInput.value = ""; // Clear input
        }
    } else {
        displayError("Please enter a city.");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data.");
    }

    return await response.json();
}

function displayWeatherInfo(data) {
    const { name: cityName, main: { temp, humidity }, weather: [{ description, id }] } = data;

    // Clear previous content
    clearWeatherDisplay();

    // Create and display individual boxes for each detail
    createAndAppendBox("City", cityName, "cityDisplay");
    createAndAppendBox("Temperature", `${(temp - 273.15).toFixed(1)}\u00B0C`, "tempDisplay");
    createAndAppendBox("Humidity", `${humidity}%`, "humidityDisplay");
    createAndAppendBox("Description", `${getWeatherEmoji(id)} ${description}`, "descDisplay");
}


function createAndAppendBox(label, value, className) {
    const box = document.createElement("div");
    box.className = className;

    const labelElement = document.createElement("h3");
    labelElement.textContent = `${label}:`;

    const valueElement = document.createElement("p");
    valueElement.textContent = value;

    box.appendChild(labelElement);
    box.appendChild(valueElement);

    weatherOutput.appendChild(box); // Append to the weather output container
}

function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId >= 200 && weatherId < 300:
            return "⛈️";
        case weatherId >= 300 && weatherId < 400:
            return "🌧️";
        case weatherId >= 500 && weatherId < 600:
            return "🌧️";
        case weatherId >= 600 && weatherId < 700:
            return "❄️";
        case weatherId >= 700 && weatherId < 800:
            return "🌫️";
        case weatherId === 800:
            return "☀️";
        case weatherId >= 801 && weatherId < 810:
            return "☁️";
        default:
            return "?";
    }
}

function displayError(message) {
    clearWeatherDisplay();

    const errorBox = document.createElement("div");
    errorBox.className = "errorDisplay";
    errorBox.textContent = message;

    weatherOutput.appendChild(errorBox); // Append to the weather output container
}

function clearWeatherDisplay() {
    // Remove all dynamically added weather boxes
    weatherOutput.innerHTML = ""; // Clear previous outputs
}


