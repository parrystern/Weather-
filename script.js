const apiKey = "57c5b539c3431560a9f20975fc9a4785";
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const localTimeEl = document.querySelector(".local-time");

async function checkWeather(city) {
  try {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);
    const data = await response.json();

    if (response.status === 404 || data.cod === "404") {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
      return;
    }

    document.querySelector(".error").style.display = "none";
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " km/h";

    const weatherCondition = data.weather[0].main;
    switch (weatherCondition) {
      case "Clouds": weatherIcon.src = "images/clouds.png"; break;
      case "Clear": weatherIcon.src = "images/clear.png"; break;
      case "Rain": weatherIcon.src = "images/rain.png"; break;
      case "Drizzle": weatherIcon.src = "images/drizzle.png"; break;
      case "Mist": weatherIcon.src = "images/mist.png"; break;
      default: weatherIcon.src = "images/clear.png";
    }

    document.querySelector(".weather").style.display = "block";

    // ✅ Get accurate real-time data using lat/lon
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    getRealTime(lat, lon);

  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

async function getRealTime(lat, lon) {
  try {
    const response = await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`);
    const timeData = await response.json();

    const { date, time, dayOfWeek } = timeData;

    // Example: Tuesday, 2025-08-26, 21:12:44
    localTimeEl.textContent = `Local Time: ${dayOfWeek}, ${date}, ${time}`;
  } catch (error) {
    console.error("Error fetching real-time data:", error);
    localTimeEl.textContent = "Local Time: N/A";
  }
}

searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city !== "") checkWeather(city);
});

searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
