import './style.css';

const apiKey = '2990c27b5e7589f1dfc4e868f54f6b17';
const url = 'http://api.openweathermap.org/'
const weatherEndPoint = 'data/2.5/weather?';
const geocodeEndPoint = 'geo/1.0/direct?q=';
const content = document.querySelector('#main-content');
const searchBtn = content.querySelector('#search-btn');

searchBtn.addEventListener('click', searchLocation);

async function searchLocation (){
    const search = content.querySelector('#search');
    const weatherDiv = content.querySelector('#weather');
    const image = content.querySelector('#icon');
    let latLon = await getLocation(search.value);

    let requestURI = `${url}${weatherEndPoint}lat=${latLon.lat}&lon=${latLon.lon}&appid=${apiKey}`;
    try{
      let result = await fetch (requestURI);
      let resultData = await result.json();
      let locationName = weatherDiv.querySelector('h2');
      locationName.textContent = await resultData.name + ', ' + await resultData.sys.country;
      // show weather box
      weatherDiv.classList.add('show');
      weatherDiv.classList.remove('hidden');
      updateIcon(await resultData.weather[0].icon);
  
      let temp = tempInCelsius(await resultData.main.temp);
      let tempDisplay = weatherDiv.querySelector('#temp');
      tempDisplay.textContent = temp;
      let description = weatherDiv.querySelector('#description');
      description.textContent = await resultData.weather[0].main;
  
    }
    catch(error){
      weatherDiv.classList.add('hidden');
      weatherDiv.classList.remove('show');
      console.log(error);
    }
   
    async function updateIcon(icon){
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      image.src = imageURL;

    }
    function tempInCelsius(k){
      const diffC = 273.15;
      return Math.ceil(k - diffC) + "℃";

    }
    // function to get lat and lon values for city
    async function getLocation (city){
      try{
        let request = `${url}${geocodeEndPoint}${city}&limit=1&appid=${apiKey}`;
        let result = await fetch (request)
        let locationData = await result.json();
        let latLon = {'lat' : await locationData[0].lat, 'lon' : await locationData[0].lon };
        return latLon;
      }
      catch(error) {
        weatherDiv.classList.add('hidden');
        weatherDiv.classList.remove('show');
        console.error('Error:', error);
      };

    }
}