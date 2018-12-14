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