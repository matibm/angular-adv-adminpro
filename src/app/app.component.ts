import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Event as NavigationEvent } from "@angular/router";
import { NavigationStart } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'adminpro';
  constructor(router: Router){
    router.events
    .pipe(
      filter(
        ( event: NavigationEvent ) => {

          return( event instanceof NavigationStart );

        }
      )
    )
    .subscribe(
      ( event: NavigationStart ) => {

        // NOTE: I am not sure what triggers the "hashchange" type.
        console.log( "trigger:", event.navigationTrigger );

        // This "restoredState" property is defined when the navigation
        // event is triggered by a "popstate" event (ex, back / forward
        // buttons). It will contain the ID of the earlier navigation event
        // to which the browser is returning.
        // --
        // CAUTION: This ID may not be part of the current page rendering.
        // This value is pulled out of the browser; and, may exist across
        // page refreshes.
        if ( event.restoredState ) {

          console.warn(
            "restoring navigation id:",
            event.restoredState.navigationId
          );

        }

        console.groupEnd();

      }
    )
  ;
  }
}
