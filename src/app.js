let apiKey = "82f33736fe5d08022fb7076137f7ac18";
let units = "metric";
let windUnits = document.querySelector("#wind-units");

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index >= 1 && index <= 5) {
      forecastHTML =
        forecastHTML +
        `<div class="card mb-2" style="max-width: 540px" id="forecast-card">
  <div class="row g-0">
                  <div class="col-8">
                    <div class="card-body">
                      <p class="card-text">${formatDay(forecastDay.dt)}</p>
                      <p class="card-text">
                        <span class="weather-forecast-temp-min">${Math.round(
                          forecastDay.temp.min
                        )}</span>º |
                        <span class="weather-forecast-temp-max">${Math.round(
                          forecastDay.temp.max
                        )}</span>º
                      </p>
                    </div>
                  </div>
                  <div class="col-4">
                    <img
                      src="images/${forecastDay.weather[0].icon}.png"
                      class="img-fluid rounded-start"
                      alt="..."
                      width="50"
                    />
                  </div>
                </div>
                </div>`;
    }
  });
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  currentCityName = response.data.name;
  let temperatureElement = document.querySelector("#todays-temp");
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let minElement = document.querySelector("#min-temp");
  let maxElement = document.querySelector("#max-temp");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;
  celsiusTemperatureMin = response.data.main.temp_min;
  celsiusTemperatureMax = response.data.main.temp_max;

  if (
    response.data.sys.sunrise <= response.data.dt &&
    response.data.sys.sunset >= response.data.dt
  ) {
    document.getElementById("icon").style.backgroundColor = "#c0d4e7";
    document.getElementById("weather-app").style.border = "2px solid #c0d4e7";
    document.getElementById("body").style.backgroundColor = "#beb2a6";
  } else {
    document.getElementById("icon").style.backgroundColor = "#858F86";
    document.getElementById("weather-app").style.border = "2px solid #858F86";
    document.getElementById("body").style.backgroundColor = "#b4a79a";
  }

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  minElement.innerHTML = Math.round(celsiusTemperatureMin);
  maxElement.innerHTML = Math.round(celsiusTemperatureMax);
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function retrievePosition(position) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  units = "imperial";
  windUnits.innerHTML = " mph";
  search(currentCityName);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  units = "metric";
  windUnits.innerHTML = " m/s";
  search(currentCityName);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let here = document.querySelector("#here");
here.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Brisbane");
