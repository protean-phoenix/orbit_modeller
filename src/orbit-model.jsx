import React from "react";
import Credentials from "./credentials";

export default class OrbitModel extends React.Component{
  constructor(props){
    super(props);
    this.credentials = new Credentials();
    this.state = {orbit: null};
  }
  modelOrbit(data){
    if(data){
      let rotateX;
      let rotateY;
      let semiMajorAxis = Math.round(data.semi_major_axis*100);
      let semiMinorAxis = Math.round(Math.sqrt((data.eccentricity-1)*(semiMajorAxis*semiMajorAxis)*(-1)));
      let orbitStyle = {
        transform: "rotateX("+Math.round(data.ascending_node_longitude)+"deg) rotateY("+Math.round(data.inclination)+"deg)",
        position: "absolute",
        display: "inline-block",
        width: (semiMinorAxis*2)+"px",
        height: (semiMajorAxis*2)+"px",
        borderColor: "orange",
        borderStyle: "solid",
        borderWidth: "2px",
        borderRadius: "50%",
        boxSizing: "border-box",
        top: (50-Math.round(data.aphelion_distance*100))+"px"
      };
      console.log(data);
      console.log(semiMinorAxis);
      return <div style={orbitStyle}></div>;
    }
    this.getOrbitalData();
    console.log("nothing yet.")
    return <div></div>;
  }
  getOrbitalData(){
    let asteroidId;
    const startDate = "1996-08-29";
    fetch("https://api.nasa.gov/neo/rest/v1/feed?start_date="+startDate+"&api_key="+this.credentials.apiKey)
      .then(response=>response.json())
      .then(json=>{
        asteroidId = json.near_earth_objects[startDate][0].id;
        fetch("https://api.nasa.gov/neo/rest/v1/neo/"+asteroidId+"?api_key="+this.credentials.apiKey)
          .then(response=>response.json())
          .then(json=>{
            this.setState({orbit: json.orbital_data});
          });
      });
  }
  render(){
    return (<div id="solar-system">
    <div id="sun"><h2 id="sun-label">Sun</h2>{this.modelOrbit(this.state.orbit)}</div>
  </div>);
  }
}
