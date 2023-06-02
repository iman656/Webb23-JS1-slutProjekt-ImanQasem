

const form = document.querySelector('form');
const errorH3 = document.querySelector('#error');
const img = document.querySelector('.weather-icon');
let info ;
var hours ;

//....

// to listen the interd CITY and Hours 
form.addEventListener('submit', function(event){
    event.preventDefault();
    
    errorH3.innerText = '';
    img.src = '' ;

    var apikey = '5662a8d3a597efd166ca0ed5853477fb';
    const input = document.querySelector('.inputCity');
    var hoursInput = document.querySelector('.hoursInput');
    const cityName = input.value;
    hours = hoursInput.value;
    form.reset();

    const countryUrl =`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apikey}`;
    console.log(countryUrl);

   
    fetch(countryUrl)
    .then( response1 =>{ 
        // console.log( response1 );
        if(response1.ok){
          
            return response1.json();
         
        }
        else if (response1.status >= 400 && response1.status < 500){ 
            throw new Error('Smething went wrong');
        }
        else {
         throw new Error(response1.statusText);
        }
    })
    .then( cityData ) 
    .then( data1 => {

        const api2Promise = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data1[0]}&lon=${data1[1]}&appid=${apikey}&units=metric`);
        
        // console.log(data1[2]);
        
        return api2Promise;
    })
    .then( Response2 => {
        console.log(Response2);
        
        if(Response2.ok){
            
       
        return Response2.json();
    }
       else{ throw new Error('Cannot find the City name');}
    })
    .then( displayCityweather)

    .then(info =>{
        const apiHoursWeather = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${info[0]}&lon=${info[1]}&appid=${apikey}&units=metric`);
        console.log(apiHoursWeather);
        return apiHoursWeather;
    })
    .then(promiseInfo => {
        if(promiseInfo.ok){
            console.log(promiseInfo);
        return promiseInfo.json();
        }else {throw new Error('Hours tempritures are not found')}
    })
    .then(data => {
        var forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < hours; i++) {
            var forecast = data.list[i];
            var forecastElement = document.createElement('div');
            var date = new Date(forecast.dt_txt);
            var forecastHours = date.getHours();
            var minutes = date.getMinutes();
            var formattedTime = forecastHours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
            forecastElement.innerHTML = `
            <div class="casting">
                <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" class="forcastImg">
                <div class="forcastTemp">${forecast.main.temp} °C</div>
                <div class="forecastTime">${formattedTime}</div>
            </div>`;
            forecastContainer.appendChild(forecastElement);
        }
    })
   
    .catch( handleError );

});

//...


function cityData(value) {      //value=  array , length 1 , (object) 
    // console.log(value);             

     //if response1.json() has information about the city then return an array [ lat,lon,name] otherwise is an error
    if (value.length === 1){        
    const data1 = [value[0].lat, value[0].lon , value[0].name];
    info = data1; 
     
    return data1;
}
else {
    throw new Error('Not found City- Inter correct City !');
}

}

const searchResultDiv = document.querySelector('.weather');
const h1Temp = document.querySelector('.temp');
const h2 = document.querySelector('.city');
const pIconDescription = document.querySelector('.weather-iconDescription')
const pSpeed = document.querySelector('.wind');
const pHumidity = document.querySelector('.humidity');
const pDiscription = document.querySelector('.temp-disc');
//... 


function displayCityweather(value2){
   
    const dataIcon = [value2.weather[0].icon, value2.weather[0].id];
    console.log(dataIcon);
    console.log(`info är ${info}`); 
   
    h1Temp.innerText = `${value2.main.temp} °C`;
    img.src =  `https://openweathermap.org/img/wn/${value2.weather[0].icon}.png`;
    pIconDescription.innerText = `${value2.weather[0].description}`;
    pDiscription.innerText = `feels-like:${value2.main.feels_like}°C \n Min:  ${value2.main.temp_min}°C \     Max:  ${value2.main.temp_max}°C`;
    h2.innerText = `${value2.name}`;
    pHumidity.innerText = `${value2.main.humidity}%`;
    pSpeed.innerText = `${value2.wind.speed} km/h`;

    return info;
    }

    function displayHoursTemp(value3){
        console.log(value3.list[0].main.temp);
        console.log(value3.list[2].weather[0].icon)
       
        var forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < hours; i++) {
            console.log(data.list[i]);
            var forecast = data.list[i];
            var forecastElement = document.createElement('div');
            var date = new Date(forecast.dt_txt);
            var forecastHours = date.getHours();
            var minutes = date.getMinutes();
            var formattedTime = forecastHours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
            forecastElement.innerHTML = `
                <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png">
                <div>${forecast.main.temp} °C</div>
                <div class="forecastTime">${formattedTime}</div>`;
            forecastContainer.appendChild(forecastElement);
        }
    }



function handleError(error){
    h1Temp.innerText = '';
    pSpeed.innerText = '';
    pHumidity.innerText = '';
    h2.innerText ='';
    pIconDescription.innerText = '';
    pDiscription.innerText = '';
    img.src = '' ;
    errorH3.innerText = error.message;
    console.log(error);

}
