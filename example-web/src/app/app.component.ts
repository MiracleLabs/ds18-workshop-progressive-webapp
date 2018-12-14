import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  weatherResponse;
  weatherAddress=['Visakhapatnam','India'];
  angForm: FormGroup;
  networkAvailability=false;

  ngOnInit(){
    this.networkAvailability = !navigator.onLine;
    this.weatherReport();
    this.createForm();
  }

  constructor(private http: HttpClient,
    private fb: FormBuilder
  ){
    self.addEventListener('offline', () => {
      this.networkAvailability = true;
    })
    self.addEventListener('online', () => {
      this.networkAvailability = false;
    })

  }

  createForm() {
    this.angForm = this.fb.group({
      cityAddress: ['']});
  }

searchCity = function(city){
  console.log(city);
  this.http.get('https://weatherappserverfords18.herokuapp.com/address?address='+city).subscribe(res => {
    console.log(this.weatherAddress);
    if(res.results.length>0){
      this.weatherAddress[0]=res.results[0].address_components[0].long_name;
      this.weatherAddress[1]=res.results[0].address_components[res.results[0].address_components.length-1].long_name;
      this.weatherReport();
    }else{
      alert('Enter correct city');
    }
    // this.weatherAddress = res;
    // console.log(this.weatherResponse);
  })
}

weatherReport = function(){

  this.http.get('https://weatherappserverfords18.herokuapp.com/weather?city='+this.weatherAddress[0]+'&country='+this.weatherAddress[1]).subscribe(res => {
    console.log(this.weatherResponse);
    if(!res.response.error && res.current_observation){
      this.weatherResponse = res.current_observation;
    }else{
      alert('Enter correct city');
    }
  })
}

}
