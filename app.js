let isFahrenheit = false;

function getUserLocation() {
    const isLocationAvailable = Math.random() > 0.2;
    if (!isLocationAvailable) throw new Error("Failed to detect location. Geolocation data is unavailable.");
    return { latitude: 40.7128, longitude: -74.0060 };
}

function getWeatherIcon(condition) {
    switch (condition) {
        case "Sunny": return "☀️";
        case "Cloudy": return "☁️";
        case "Rainy": return "🌧️";
        case "Snowy": return "❄️";
        case "Stormy": return "⛈️";
        case "Foggy": return "🌫️";
        case "Mist": return "🌫️";
        default: return "❓";
    }
}

function convertTemperature(tempC) {
    return isFahrenheit ? (tempC * 9/5 + 32).toFixed(1) + "°F" : tempC + "°C";
}

function generateWeatherForecast(city, latitude, longitude) {
    if (typeof city !== "string" || city.trim() === "") throw new Error("Invalid city name.");

    const weatherConditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Stormy", "Foggy"];
    const forecast = [];
    const currentDate = new Date();

    for (let i = 0; i < 3; i++) {
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const temperature = Math.floor(Math.random() * 45 - 10);
        const humidity = Math.floor(Math.random() * 100);
        const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

        forecast.push({
            date: `${month}/${day}/${year}`,
            temperature,
            condition,
            icon: getWeatherIcon(condition),
            humidity: `${humidity}%`,
            latitude,
            longitude
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return forecast;
}

function displayForecastOnPage(forecastArray, containerId, city) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<h2>3-Day Forecast for ${city}</h2>`;
    forecastArray.forEach(day => {
        const dayDiv = document.createElement("div");
        dayDiv.innerHTML = `
            <strong>Date:</strong> ${day.date}<br>
            <strong>Temp:</strong> ${convertTemperature(day.temperature)}<br>
            <strong>Condition:</strong> ${day.condition} ${day.icon}<br>
            <strong>Humidity:</strong> ${day.humidity}<br>
            <strong>Latitude:</strong> ${day.latitude}, <strong>Longitude:</strong> ${day.longitude}<br>
            <hr>
        `;
        container.appendChild(dayDiv);
    });
}

async function fetchCurrentWeather(city) {
    const apiKey = 'da346c967f9c37b0efa0e1087d4ffedb';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("City not found in OpenWeatherMap API");
        const data = await response.json();

        document.getElementById("city-name").textContent = "City: " + data.name;
        document.getElementById("temperature").textContent = "Temperature: " + convertTemperature(data.main.temp);
        document.getElementById("weather-description").textContent = "Condition: " + data.weather[0].description + " " + getWeatherIcon(data.weather[0].main);

    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
}

function refreshForecast(city) {
    try {
        const location = getUserLocation();
        const forecastData = generateWeatherForecast(city, location.latitude, location.longitude);
        displayForecastOnPage(forecastData, "forecast-user", city);
    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search-btn").addEventListener("click", function () {
        const city = document.getElementById("city-input").value;
        refreshForecast(city);
        fetchCurrentWeather(city);
    });

    document.getElementById("toggle-btn").addEventListener("click", function () {
        isFahrenheit = !isFahrenheit;
        const city = document.getElementById("city-input").value || "New York";
        refreshForecast(city);
        fetchCurrentWeather(city);
    });

    document.getElementById("refresh-btn").addEventListener("click", function () {
        const city = document.getElementById("city-input").value || "New York";
        refreshForecast(city);
        fetchCurrentWeather(city);
    });
});
