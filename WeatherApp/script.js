const apiKey = '98620d71b64349f3956b193f0dce679e';
const cityName = document.querySelector('.city-name');
const searchBtn = document.querySelector('.search-btn');
const notFound = document.querySelector('.notfound-city');
const cityFound = document.querySelector('.search-city');
const weatherDisplay = document.querySelector('.weather-display');
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity');
const wspeed = document.querySelector('.wspeed');
const weatherImg = document.querySelector('.weather-sum-img');
const dateTxt = document.querySelector('.date-txt');

const forecastCont = document.querySelector('.forecast-items-container');

//https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}


searchBtn.addEventListener('click', () => {
    if(cityName.value.trim() != ''){
        updateWeather(cityName.value);
        cityName.value = ''
        cityName.blur();
    }
});

cityName.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && cityName.value.trim() != ''){
        updateWeather(cityName.value);
        cityName.value = ''
        cityName.blur();
    }
});

function getWeatherIcon(id) {
    console.log(id)
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'tornado.svg'
    if(id == 800) return 'clear.svg'
    else return 'clouds.svg'
};

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
};

async function updateWeather(city) {
    const weather = await getFetch('weather', city);
    if(weather.cod != 200){
        displaySection(notFound);
        return
    }
    console.log(weather);

    const{
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: { speed }
    } = weather

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp)+' °C'
    humidityTxt.textContent = humidity+'%'
    wspeed.textContent = speed+' M/s'
    conditionTxt.textContent = main

    dateTxt.textContent = getCurrentDate();
    weatherImg.src = `${getWeatherIcon(id)}`

    await updateForecastInfo(city);

    displaySection(weatherDisplay)
};

async function updateForecastInfo(city){
    const forecastData = await getFetch('forecast', city)

    const timeTaken = '12:00:00'
    const dateTaken = new Date().toISOString().split('T')[0]

    forecastCont.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(dateTaken)){
            updateForecastItems(forecastWeather)
        }
    })
};

function updateForecastItems(forecast){
    console.log(forecast)
    const{
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    }  = forecast

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast-item">
            <h5>${dateResult}</h5>
            <img src="${getWeatherIcon(id)}" alt="" class="forecast-item-img">
            <h5>${Math.round(temp)} °C</h5>
        </div>
    `

    forecastCont.insertAdjacentHTML('beforeend', forecastItem)
};

async function getFetch(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json()
};

function displaySection(section){
    [weatherDisplay, cityFound, notFound]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
};