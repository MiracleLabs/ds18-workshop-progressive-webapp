# DS18 Workshop | Getting Hands On with Progressive Web Applications

The below file consists of commands and code snippets that will help you complete and understand the lab - Getting Hands On with Progressive Web Applications
## Commands
To install Angular 6 with npm,
```shell
	npm install -g @angular/cli@6.0.8
```
To check installed Angular version,
```shell
	ng -v
```

To run Angular application locally,
```shell
	ng serve
```

To install Firebase tools,
```shell
	npm install -g firebase-tools@5.1.1
```

To login to Firebase account through command prompt,
```shell
	firebase login
```
To initilize Firebase configuration inside the application,
```shell
	firebase init
```

To build Angular application,
```shell
	ng build --prod
```

To deploy Angular application into Firebase,
```shell
	firebase deploy
```

To convert an Angular application into PWA,
```shell
	ng add @angular/pwa
```
## Code Snippets

### app.module.ts

```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

```

### app.component.html

```html
<div style="text-align:center;font-family:sans-serif;" class="main-class">
  <header class ="header">
    <table style="width:100%;">
      <tr>
        <td style="text-align:left;" >
          <img src="/assets/images/Mi Logo White.png" style="max-width: 80px;max-height: 50px;">
        </td>
        <td style="text-align: center;color:white;font-size:20px;">
          Weather Forecast
        </td>
        <td style="text-align:right;">
          <img src="/assets/images/Ds-white 18.png" style="max-width: 50px;max-height: 50px;">
        </td>
      </tr>
    </table>
  </header>
  <form [formGroup]="angForm" (submit)="searchCity(cityAddress.value)">
    <div class="form-group">
      <input type="text" placeholder="Search by city.." formControlName="cityAddress" #cityAddress/>
    </div>
  </form>
  <div align="center">
    <div style="font-size:20px;font-weight:700;padding-bottom:10px;">{{weatherResponse.display_location.full}}</div>
    <img src="/assets/images/nt_mostlycloudy.gif" style="max-width: 100px;max-height: 100px;padding-bottom:10px;">
    <div style="font-size:40px;font-weight:700;padding-bottom:10px;">{{weatherResponse.feelslike_string}}
    </div>
    <div style="font-size:20px;font-weight:700;padding-bottom:10px;">{{weatherResponse.weather}}</div>
    <div style="font-size:15px;font-weight:700;padding-bottom:5px;">Last updated</div>
    <div style="font-size:18px;font-weight:700;">
      {{weatherResponse.observation_time_rfc822}}
    </div>
  </div>
  <br>
  <table align="center" style="font-size:20px;font-weight:700;width:100%;">
    <tr>
      <!-- <td><div>Temp</div><div> 280.20</div></td> -->
      <td class="dataTd">
        <div>Pressure</div>
      </td>
      <td class="dataTd">
        <div> {{weatherResponse.pressure_in}}</div>
      </td>
    </tr>
    <tr>
      <td class="dataTd">
        <div>Humidity</div>
      </td>
      <td class="dataTd">
        <div> {{weatherResponse.relative_humidity}}</div>
      </td>
    </tr>
    <tr>
      <td class="dataTd">
        <div>Wind Speed(KPH)</div>
      </td>
      <td class="dataTd">
        <div> {{weatherResponse.wind_kph}}</div>
      </td>
    </tr>
    <tr>
      <td class="dataTd">
        <div>Visibility</div>
      </td>
      <td class="dataTd">
        <div> {{weatherResponse.visibility_km}}</div>
      </td>
    </tr>

  </table>
  <div *ngIf="networkAvailability" class ="network-availability">
    No internet connection
  </div>
  <br>
  <div class="footer">
        @ Built by Miracle Innovation Labs
  </div>
</div>
```

### app.component.scss

```css
.network-availability{
    position: fixed;
    width:95%;
    text-align: center;
    border-radius: 10px;
    padding:10px 0px 10px 0px;
    background-color:rgb(252, 63, 63);
    color:black;
    font-weight: bold;
    font-size: 15px;
  }
  .header{
    width:100%;
    text-align: center;
    background-color:rgb(32, 32, 32);
    color:white;
    font-weight: bold;
    font-size: 15px;
    margin-left: -8px;
    margin-top:-7px;
    padding-right: 15px;
  }
  .footer{
    width:100%;
    text-align: center;
    padding:10px 20px 15px 0px;
    margin-top: 0px;
    margin-left:-10px;
    margin-right: -20px;
    background-color:rgb(32, 32, 32);
    color:white;
    font-weight: bold;
    font-size: 15px;
  }
  .dataTd {
    text-align: left;
    padding: 10px;
    color: white;
  }
  .headerTd{
    text-align: left;
    color: white;    
  }
  div{
    color:white;
  }
  input[type=text] {
    background-image: url('assets/images/searchicon.png');
    background-size: 20px 20px;
    margin: 20px 0px 20px 0px;
    width: 100%;
    box-sizing: border-box;
    border: 0px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
    color: black;
    background-color: white;
    background-position: 10px 10px;
    background-repeat: no-repeat;
    padding: 12px 20px 12px 40px;
    margin-bottom: 20px;
  }
```

### app.component.ts

```javascript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwUpdate, SwPush } from "@angular/service-worker";
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  weatherResponse;
  weatherAddress = ['Visakhapatnam', 'India'];
  angForm: FormGroup;
  networkAvailability = false;
  ngOnInit() {
    this.networkAvailability = !navigator.onLine;
    this.weatherReport();
    this.createForm();
    this.subscribeNotifications();
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm("New version available. Load New Version?")) {
          window.location.reload();
        }
      });
    }
  }
  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private swPush: SwPush,
    private swUpdate: SwUpdate
  ) {
    self.addEventListener('offline', () => {
      this.networkAvailability = true;
    })
    self.addEventListener('online', () => {
      this.networkAvailability = false;
    })
  }
  createForm() {
    this.angForm = this.fb.group({
      cityAddress: ['']
    });
  }
  searchCity = function (city) {
    console.log(city);
    if (this.networkAvailability) {
      alert("Please check the internet connection and try again!")
    } else {
      this.http.get('https://weatherappserverfords18.herokuapp.com/address?address=' + city).subscribe(res => {
        console.log(this.weatherAddress);
        if (res.results.length > 0) {
          this.weatherAddress[0] = res.results[0].address_components[0].long_name;
          this.weatherAddress[1] = res.results[0].address_components[res.results[0].address_components.length - 1].long_name;
          this.weatherReport();
        } else {
          alert('Enter correct city');
        }
      })
    }
  }
  weatherReport = function () {
    this.http.get('https://weatherappserverfords18.herokuapp.com/weather?city=' + this.weatherAddress[0] + '&country=' + this.weatherAddress[1]).subscribe(res => {
      console.log(this.weatherResponse);
      if (!res.response.error && res.current_observation) {
        this.weatherResponse = res.current_observation;
      } else {
        alert('Enter correct city');
      }
    })
  }
  //subscribe notifications
  subscribeNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: "BMW3STH0ODuNdhFVAZIy8FUDEwt2f8LLpWBiBnz8WE0_558rZc4aLbZUD9y-HxMlfCtyE5OD0mk3xa2oFJZu5n0"
    })
      .then(sub => {
        console.log("Notification Subscription:");
        this
          .http
          .post('https://weatherappserverfords18.herokuapp.com/subscribeNotifications', sub).subscribe(
          () => {
            console.log('Sent push subscription object to server.');
          },
          err => console.log('Could not send subscription object to server, reason: ')
          );
      })
      .catch(err => console.error("Could not subscribe to notifications"));
  }
  unsubscribeNotifications() {
    this.swPush.subscription.pipe(take(1)).subscribe(subscriptionValue => {
      console.log('this is un subscription', subscriptionValue);
      this
        .http
        .post('https://weatherappserverfords18.herokuapp.com/unsubscribeNotifications', subscriptionValue).subscribe(
        res => {
          console.log('App Delete subscriber request answer')
          subscriptionValue.unsubscribe()
            .then(success => {
              console.log('App Unsubscription successful')
            })
            .catch(err => {
              console.log('App Unsubscription failed')
            })
        },
        err => {
          console.log('App Delete subscription request failed')
        }
        );
    });
  }
}
```

### ngsw-worker.js

```javascript
this.scope.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click Received. event', event);
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

### ngsw-config.json

```json
{
  "index": "/index.html",  
  "dataGroups": [
    {
      "name": "api-data",
      "urls": [
        "https://weatherappserverfords18.herokuapp.com/weather",
        "http://icons.wxug.com/i/c/k/*"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 1000,
        "maxAge": "30d"
      }
    }
  ],
  "assetGroups": [{
    "name": "app",
    "installMode": "prefetch",
    "resources": {
      "files": [
        "/favicon.ico",
        "/index.html",
        "/*.css",
        "/*.js"
      ]
    }
  }, {
    "name": "assets",
    "installMode": "lazy",
    "updateMode": "prefetch",
    "resources": {
      "files": [
        "/assets/**"
      ]
    }
  }]
}
```