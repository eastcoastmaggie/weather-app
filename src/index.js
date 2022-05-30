import './style.css';

//*********************************** 
// Weather App
// May, 2022
// EastcoastMaggie
//*********************************** 

// import all images
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

// API call
const apiKey = '2990c27b5e7589f1dfc4e868f54f6b17';
const url = 'https://api.openweathermap.org/';
const geocodeEndPoint = 'geo/1.0/direct?q=';
const weatherEndPoint = 'data/2.5/onecall?';

const body = document.querySelector('body');
const content = document.querySelector('#main-content');
const searchBtn = content.querySelector('#search-btn');
body.style.backgroundImage = `url(${images['ben-owen-VHuNLO5IaHU-unsplash.jpg']})`;
searchBtn.addEventListener('click', searchLocation);

async function searchLocation (){

  const search = content.querySelector('#search');
  const weatherDiv = content.querySelector('#weather');
  const image = content.querySelector('#icon');
  let latLon = await getLocation(search.value);

  //let requestURI = `${url}${weatherEndPoint}lat=${latLon.lat}&lon=${latLon.lon}&appid=${apiKey}`;
  let requestURI = `${url}${weatherEndPoint}lat=${latLon.lat}&lon=${latLon.lon}&appid=${apiKey}`;
  try{
    
    let result = await fetch (requestURI);
    let resultData = await result.json();
    let locationName = weatherDiv.querySelector('h2');
    locationName.textContent = await latLon.city + ', ' + await latLon.country;
    // show weather box
    weatherDiv.classList.add('show');
    weatherDiv.classList.remove('hidden');
    updateIcon(await resultData.current.weather[0].icon);
    setBackground(await resultData.current.weather[0].icon);

    let tempDisplay = weatherDiv.querySelector('#temp');
    while (tempDisplay.firstChild != null){
      tempDisplay.removeChild(tempDisplay.firstChild);
    }
    tempDisplay.insertAdjacentHTML('beforeend', 
        `<p><span class='temp-high'>${tempInCelsius(await resultData.current.temp)}</span> 
        ${tempInCelsius(await resultData.daily[0].temp.min)}</p> 
        <p>Feels like: ${ tempInCelsius(await resultData.current.feels_like)}</p>
        <p>Wind: ${resultData.current.wind_speed}km</p>`);

    let description = weatherDiv.querySelector('#description');
    description.textContent = await resultData.current.weather[0].description;
    populateDaily(resultData);


  }
  catch(error){
    weatherDiv.classList.add('hidden');
    weatherDiv.classList.remove('show');
    console.log(error);
  }
  
  async function getIconURL(icon){
    return `${url}img/wn/${icon}@2x.png`;
  }
  async function updateIcon(icon){
    image.src = await getIconURL(icon);
  }
  // set background based on icon
  function setBackground(icon){
    const iconImgMap = {
      '01d' : 'kristijan-arsov-FpmcLSEmSjs-unsplash.jpg',  //day-sun
      '02d' : 'chuttersnap-9AqIdzEc9pY-unsplash.jpg', //day-cloud
      '03d' : 'chuttersnap-9AqIdzEc9pY-unsplash.jpg', //day-cloud
      '04d' : 'chuttersnap-9AqIdzEc9pY-unsplash.jpg',  //day-cloud
      '09d' : 'pete-nowicki-_87lZuOyg64-unsplash.jpg', //day-rain
      '10d' : 'pete-nowicki-_87lZuOyg64-unsplash.jpg', //day-rain
      '11d' : 'ben-owen-VHuNLO5IaHU-unsplash.jpg', //day-thunder
      '13d' : 'kaleb-becker-IeyIdQQ7zZE-unsplash.jpg', //day-snow
      '50d' : 'quentin-rogeret-U4o9fUXReqA-unsplash.jpg', //day-mist
      '01n' : 'zetong-li-7pUHeP1GRC4-unsplash.jpg',  //night-sun
      '02n' : 'guillaume-bleyer-4E9OzGnxv-w-unsplash.jpg', //night-cloud
      '03n' : 'guillaume-bleyer-4E9OzGnxv-w-unsplash.jpg', //night-cloud
      '04n' : 'guillaume-bleyer-4E9OzGnxv-w-unsplash.jpg',  //night-cloud
      '09n' : 'pete-nowicki-_87lZuOyg64-unsplash.jpg', //night-rain
      '10n' : 'pete-nowicki-_87lZuOyg64-unsplash.jpg', //night-rain
      '11n' : 'ben-owen-VHuNLO5IaHU-unsplash.jpg', //night-thunder
      '13n' : 'kaleb-becker-IeyIdQQ7zZE-unsplash.jpg', //night-snow
      '50n' : 'quentin-rogeret-U4o9fUXReqA-unsplash.jpg', //night-mist
    };
    body.style.backgroundImage = `url(${images[iconImgMap[icon]]}`;
  }
  
  // function to get lat and lon values for city
  async function getLocation (city){
    try{
      const request = `${url}${geocodeEndPoint}${city}&limit=1&appid=${apiKey}`;
      const result = await fetch (request)
      const locationData = await result.json();
      const latLon = {'city' : locationData[0].name, 'country' : locationData[0].country, 'state' : locationData[0].state, 'lat' : await locationData[0].lat, 'lon' : await locationData[0].lon };
      return latLon;
    }
    catch(error) {
      weatherDiv.classList.add('hidden');
      weatherDiv.classList.remove('show');
      console.error('Error:', error);
    };

  }
  // display next 7 day forecast

  async function populateDaily(data){
    const weekDiv = content.querySelector('#week');
    removeChildren(weekDiv);
    for(let item in data.daily){
      
      const div = document.createElement('div');
      const displayName = document.createElement('h3');
      const icon = document.createElement('img');
      const temp = document.createElement('span');

      const options = { weekday: 'long'};
      const day = timestampToDate(await data.daily[item].dt)
      
      displayName.textContent = new Intl.DateTimeFormat('en-US', options).format(day);
      const iconURL = await getIconURL(data.daily[item].weather[0].icon);
      icon.src = iconURL;


      let temperature = tempInCelsius(await data.daily[item].temp.max);
      console.log(temperature)
      temp.textContent = temperature;

      div.appendChild(displayName);
      div.appendChild(icon);
      div.appendChild(temp);

      weekDiv.appendChild(div, weekDiv.firstChild);
    }
  }
}
function timestampToDate(timestamp){
  const milliseconds = timestamp * 1000;
  return new Date(milliseconds);
}
function tempInCelsius(k){
  const diffC = 273.15;
  return Math.ceil(k - diffC) + "℃";
}
function removeChildren(el){
  while(el.firstChild != null){
    el.removeChild(el.lastChild);
  }
}