async function fetchCurrentWeather(city) {
    const apiKey = 'da346c967f9c37b0efa0e1087d4ffedb';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("City not found in OpenWeatherMap API");
        const data = await response.json();

        const cityEl = document.getElementById("city-name");
        const tempEl = document.getElementById("temperature");
        const descEl = document.getElementById("weather-description");

        if (cityEl) cityEl.textContent = "City: " + data.name;
        if (tempEl) tempEl.textContent = "Temperature: " + data.main.temp + "°C";
        if (descEl) descEl.textContent = "Condition: " + data.weather[0].description + " " + getWeatherIcon(data.weather[0].main);

    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        alert(error.message);
    }
}

function getUserLocation() {
    const isLocationAvailable = Math.random() > 0.2;
    if (!isLocationAvailable) {
        throw new Error("Failed to detect location. Geolocation data is unavailable.");
    }
    return { latitude: 40.7128, longitude: -74.0060 };
}

function generateWeatherForecast(city, latitude, longitude) {
    if (typeof city !== "string" || city.trim() === "") {
        throw new Error("Invalid city name. Please provide a valid city.");
    }

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
            temperature: `${temperature}°C`,
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

function getWeatherIcon(condition) {
    switch (condition) {
        case "Sunny":
            return "☀️";
        case "Cloudy":
            return "☁️";
        case "Rainy":
            return "🌧️";
        case "Snowy":
            return "❄️";
        case "Stormy":
            return "⛈️";
        case "Foggy":
            return "🌫️";
        case "Mist":
            return "🌫️";
        default:
            return "❓";
    }
}

function displayForecastOnPage(forecastArray, containerId, title) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<h3>${title}</h3>`;
    forecastArray.forEach(day => {
        const dayDiv = document.createElement("div");
        dayDiv.innerHTML = `
            <strong>Date:</strong> ${day.date}<br>
            <strong>Temp:</strong> ${day.temperature}<br>
            <strong>Condition:</strong> ${day.condition} ${day.icon}<br>
            <strong>Humidity:</strong> ${day.humidity}<br>
            <strong>Latitude:</strong> ${day.latitude}, <strong>Longitude:</strong> ${day.longitude}<br>
            <hr>
        `;
        container.appendChild(dayDiv);
    });
}

document.getElementById("search-btn").addEventListener("click", function () {
    const city = document.getElementById("city-input").value;

    try {
        const userLocation = getUserLocation();
        const forecastData = generateWeatherForecast(city, userLocation.latitude, userLocation.longitude);
        console.log("Simulated 3-Day Forecast with User Location:", forecastData);
        displayForecastOnPage(forecastData, "forecast-user", `Simulated 3-Day Forecast for ${city}`);

        fetchCurrentWeather(city);

    } catch (error) {
        console.error(error.message);
        alert(error.message);
    }
});

try {
    const testLocation = getUserLocation();
    const testForecast = generateWeatherForecast("Patna", testLocation.latitude, testLocation.longitude);
    console.log("Test Simulated 3-Day Forecast:", testForecast);
} catch (error) {
    console.error(error.message);
}
