import React,{Component} from 'react';
import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css"
import {Form} from './app_component/form.component.js'
import {Weather} from './app_component/weather.component.js';
import {DayCard} from './app_component/Forecast'
import api_key from './apikey'
import {Footer} from'./app_component/Footer'

class App extends Component{
  constructor()
  {
    super();
    this.state={
      city:undefined,
      country:undefined,
      icon:undefined,
      main:undefined,
      celsius:undefined,
      temp_max:undefined,
      temp_min:undefined,
      desc:"",
      error:false,
      backgroundImage:"",
      dailyData:[],
      fclick:false
    };

    
    this.weathericon={
      Thunderstorm:"wi-thunderstorm",
      Drizzle:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Atmosphere:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog"
    }
  }
  get_WeatherIcon(icons, rangeId) {
    switch (true) {
      case rangeId >= 200 && rangeId < 232:
        this.setState({ icon:this.weathericon.Thunderstorm });
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({ icon:this.weathericon.Drizzle });
        break;
      case rangeId >= 500 && rangeId <= 521:
        this.setState({icon:this.weathericon.Rain });
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({ icon:this.weathericon.Snow });
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({ icon:this.weathericon.Atmosphere });
        break;
      case rangeId === 800:
        this.setState({ icon:this.weathericon.Clear });
        break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({ icon:this.weathericon.Clouds });
        break;
      default:
        this.setState({ icon:this.weathericon.Clouds });
    }
  }

  getWeather=async(e)=>{

    e.preventDefault();
    const city=e.target.elements.city.value;
    const country=e.target.elements.country.value;
    
    if(city && country){
      
    const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${api_key.api_key}`);
    const response = await api_call.json();
    const forecast_api = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${api_key.api_key}`);
    const forecast_res = await forecast_api.json()
    

    if(response.cod!==200)
    {
      this.setState({error:true})
    }
    else{
    this.setState(
      {
        city:`${response.name},${response.sys.country}`,
        celsius:this.calcCelsius(response.main.temp),
        temp_max:this.calcCelsius(response.main.temp_max),
        temp_min:this.calcCelsius(response.main.temp_min),
        desc:response.weather[0].description,
        error:false
      }
    )
    const dailyData = forecast_res.list.filter(reading => reading.dt_txt.includes("12:00:00"))
    this.setState({dailyData: dailyData})

      if(this.calcCelsius(response.main.temp)>16)
        this.setState({backgroundImage:"linear-gradient(to right, #fc4a1a, #f7b733)"})
      else
        this.setState({backgroundImage:"linear-gradient(to right, #B2FEFA, #0ED2F7)"})
    this.get_WeatherIcon(this.weathericon,response.weather[0].id);
    }
  }
    else{
      this.setState({error:true});
    }
  }

  Clicked=()=>{
    this.setState({fclick:!this.state.fclick})
  }
  formatDayCards=()=>{
    if(this.state.fclick==true)
    return this.state.dailyData.map((reading, index) => <DayCard reading={reading} key={index} />)

    }
  
   calcCelsius(temp) {
    temp=Math.floor(temp-273.15);
    return temp;
  }


  render(){
    return ( 
       <>
        <div className="App" style={{backgroundImage:this.state.backgroundImage}}>
        <Form loadweather={this.getWeather} clicked={this.Clicked}
        error={this.state.error} />
        <Weather city={this.state.city} 
        country={this.state.country}
        celsius={this.state.celsius}
        temp_max={this.state.temp_max}
        temp_min={this.state.temp_min}
        desc={this.state.desc}
        weathericon={this.state.icon}/>
        <div className="row justify-content-center">
        {this.formatDayCards()}
        </div>
     
        <Footer />
      
        </div>
       
      </>     
    );
  }
}

export default App;
