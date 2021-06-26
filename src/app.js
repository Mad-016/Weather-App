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

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = "";
  let days = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];
  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="card mb-2" style="max-width: 540px">
  <div class="row g-0">
                  <div class="col-8">
                    <div class="card-body">
                      <p class="card-text">${day}</p>
                      <p class="card-text">
                        <span class="weather-forecast-temp-min">13</span>º |
                        <span class="weather-forecast-temp-max">25</span>º
                      </p>
                    </div>
                  </div>
                  <div class="col-4">
                    <img
                      src="https://ssl.gstatic.com/onebox/weather/64/cloudy.png"
                      class="img-fluid rounded-start"
                      alt="..."
                      width="50"
                    />
                  </div>
                </div>
                </div>`;
  });
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "82f33736fe5d08022fb7076137f7ac18";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
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

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  minElement.innerHTML = Math.round(celsiusTemperatureMin);
  maxElement.innerHTML = Math.round(celsiusTemperatureMax);
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(3.6 * response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "82f33736fe5d08022fb7076137f7ac18";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#todays-temp");
  let temperatureElementMin = document.querySelector("#min-temp");
  let temperatureElementMax = document.querySelector("#max-temp");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let fahrenheitTemperatureMin = (celsiusTemperatureMin * 9) / 5 + 32;
  let fahrenheitTemperatureMax = (celsiusTemperatureMax * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  temperatureElementMin.innerHTML = Math.round(fahrenheitTemperatureMin);
  temperatureElementMax.innerHTML = Math.round(fahrenheitTemperatureMax);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#todays-temp");
  let temperatureElementMin = document.querySelector("#min-temp");
  let temperatureElementMax = document.querySelector("#max-temp");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  temperatureElementMin.innerHTML = Math.round(celsiusTemperatureMin);
  temperatureElementMax.innerHTML = Math.round(celsiusTemperatureMax);
}

let celsiusTemperature = null;
let celsiusTemperatureMin = null;
let celsiusTemperatureMax = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Brisbane");
