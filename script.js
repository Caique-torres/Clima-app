const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");

const temperature = document.getElementById("temperature");
const cityName = document.getElementById("city");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const errorMessage = document.getElementById("error");

searchButton.addEventListener("click", searchWeather);

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});

async function searchWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        errorMessage.textContent = "Digite uma cidade.";
        return;
    }

    errorMessage.textContent = "";

    try {
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            errorMessage.textContent = "Cidade não encontrada.";
            return;
        }

        const location = locationData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Mudar fundo entre dia e noite
        if (current.is_day === 1) {
            document.body.classList.remove("night");
            document.body.classList.add("day");
        } else {
            document.body.classList.remove("day");
            document.body.classList.add("night");
        }

        // Mostrar informações
        cityName.textContent = location.name;

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        feelsLike.textContent =
            `${Math.round(current.apparent_temperature)}°C`;

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        wind.textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;

        description.textContent =
            getWeatherDescription(current.weather_code);

    } catch (error) {
        errorMessage.textContent =
            "Não foi possível buscar o clima.";

        console.error(error);
    }
}

function getWeatherDescription(code) {
    if (code === 0) {
        return "Céu limpo ☀️";
    }

    if (code >= 1 && code <= 3) {
        return "Parcialmente nublado ⛅";
    }

    if (code >= 45 && code <= 48) {
        return "Neblina 🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "Chuva 🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "Neve ❄️";
    }

    if (code >= 80 && code <= 82) {
        return "Pancadas de chuva 🌦️";
    }

    if (code >= 95) {
        return "Tempestade ⛈️";
    }

    return "Clima desconhecido";
}
