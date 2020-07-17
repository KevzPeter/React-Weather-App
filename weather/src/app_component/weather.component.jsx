import React from 'react';
//import './weather.style.css'
//{(typeof Weather.celsius!="undefined") ? ((Weather.celsius>16) ? 'container':'container cool'):'container '}
const Weather = (props)=>{
    return (
        <div className="container">
       <div className="cards pt-4">
           <h1>{props.city}</h1>
           <h5 className="py-4">
               <i className={`wi ${props.weathericon} display-1`}></i>
           </h5>
            {props.celsius?(<h1 className="py-2">{props.celsius}&deg;</h1>):null}
           {minmax(props.temp_min,props.temp_max)}
           <h4 className="py-3">{props.desc}</h4>
       </div>
       </div>
    );
}

function minmax(min,max){
        if(min&&max){
            return(
                <h3>
                    <span className="px-4">{min}&deg;</span>
                    <span className="px-4">{max}&deg;</span>
                </h3>
            );
        }
   
}

export default Weather;