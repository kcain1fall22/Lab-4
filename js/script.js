const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api ='GET',  'https://weatherdbi.herokuapp.com/data/weather/{location}';
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = 'GET',  'https://weatherdbi.herokuapp.com/data/weather/{lat,long}';
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});
let weather={
    fetchweather: function(city){
      fetch("https://weatherdbi.herokuapp.com/data/weather/"+city)
      .then((response)=>{
        
        if (!response.ok) {
          document.querySelector(".error").innerText="Please check the city name for getting weather details...";
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        
        return response.json();
        
      })
      .then((data)=>this.displayWeather(data)); 
     },
  
     displayWeather: function(data){
      if(data.code==0)
      {
        document.querySelector(".error").innerText="The specified locatin does not exist. Please check the city name.";
       // alert(data.message); 
        //throw new Error("No weather found.");
      }
      if(data.code==1)
      {
        document.querySelector(".error").innerText="Please do not enter any special characters while fetching weather details";
        //alert(data.message); 
        //throw new Error("No weather found.");
      }
      if(data.code==2)
      {
        document.querySelector(".error").innerText="Search by coordinates not available due to excessive use of this feature. Try after sometime";
       // alert(data.message); 
        //throw new Error("No weather found.");
      }
    
      const { region }=data;
      const { dayhour }=data.currentConditions;
      //const { temp }=data.currentConditions;s
      const { c }=data.currentConditions.temp;
      const { precip }=data.currentConditions;
      const { humidity }=data.currentConditions;
      //const { wind }=data.currentConditions;
      const { km }=data.currentConditions.wind;
  
      const { comment }=data.currentConditions;
      const { iconURL }=data.currentConditions;
      console.log(region,dayhour,c,precip,humidity,km,comment,iconURL);
      document.querySelector(".error").innerText="";
      document.querySelector(".city").innerText="Weather in "+ region + " at "+dayhour;
      document.querySelector(".icon").src=iconURL;
      document.querySelector(".temp").innerText=c+"°C";
      document.querySelector(".description").innerText=comment;
      document.querySelector(".humidity").innerText="Humidity: "+humidity;
      document.querySelector(".wind").innerText="Wind Speed: "+km+" km/h";
      document.querySelector(".weather").classList.remove("loading");
  
      for(i=0;i<7;i++)
      { 
        //document.querySelector("day" + (i) + "max").innerText = "Max: " + data.next_days[0].max_temp+ "°C";
        document.querySelector(".weather_forecast_day"+(i+1)).innerText=data.next_days[i].day; 
        document.querySelector(".description"+(i+1)).innerText=data.next_days[i].comment;  
        document.querySelector(".day"+(i+1)+"max").innerText="Max: "+data.next_days[i].max_temp.c;  
        document.querySelector(".day"+(i+1)+"min").innerText="Min: "+data.next_days[i].min_temp.c;  
        document.querySelector(".weather_forecast_icon"+(i+1)).src=data.next_days[i].iconURL;  
  
      }
      function returnLocation(){
        let input = document.getElementById("loc_name").value;
      
        alert(input)
        
        var myRequest = new XMLHttpRequest();
        myRequest.onreadystatechange = function(){
        if (myRequest.readyState === 4) {
        if (myRequest.status === 200)
        var myArray = JSON.parse(myRequest.responseText);
        parseData(myArray);
        }
        }
        
        let site = myRequest.open('GET', 'https://weatherdbi.herokuapp.com/data/weather/' + input, true);
        
        let test1 = JSON.stringify(site);
        
        myRequest.send();
      
        function parseData(arr) {
      
        console.log(arr);
      
        usrRegion = arr.region;
        usrDayHr = arr.currentConditions.dayhour;
        usrTempCel = arr.currentConditions.temp.c;
        usrTempFah = arr.currentConditions.temp.f;
        usrPrecip = arr.currentConditions.precip;
        usrHumidity = arr.currentConditions.humidity;
        usrWindKM = arr.currentConditions.wind.km;
        usrWindMile = arr.currentConditions.wind.mile;
        usrComment = arr.currentConditions.comment;
        usrIcon = arr.currentConditions.iconURL;
      
        console.log(arr.region);
        console.log(arr.currentConditions);
        console.log(arr.currentConditions.dayhour);
        console.log(arr.currentConditions.temp);
        console.log(arr.currentConditions.precip);
        console.log(arr.currentConditions.humidity);
        console.log(arr.currentConditions.wind);
        console.log(arr.currentConditions.comment);
        const icon = document.querySelector("#weather-icon");

  document.getElementById('Region').innerHTML = 'Region: ' + usrRegion;
  document.getElementById('DayHour').innerHTML = 'Time: ' + usrDayHr;
  document.getElementById('Temp').innerHTML = 'Temperature: ' + usrTempCel + "\u2103/" + usrTempFah + 	"\u2109";
  document.getElementById('Precip').innerHTML = 'Precipitation: ' + usrPrecip;
  document.getElementById('Humidity').innerHTML = 'Humidity: ' + usrHumidity;
  document.getElementById('Wind').innerHTML = 'Wind: ' + usrWindKM + "km/" + usrWindMile + "mi";
  document.getElementById('Comment').innerHTML = 'Comment: ' + usrComment;
  icon.src = usrIcon;
        }
    }
}
}
