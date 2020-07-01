import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nordson-home',
  template: `<div class="home-page">
  <div class="container">
    <div class="row">
      <div class="col-8">
        <article>
          <header>
            <h1>
              Offline Utility Management BY Nordson!
            </h1>
            <p>
              Let's manange Nordson product with latest offline management
              utility tool.
            </p>
          </header>
        </article>
        <p>
          <a class="btn btn-primary my-2">Sign Up</a>
          <a class="btn btn-secondary my-2">Read More</a>
        </p>
      </div>
    </div>
    <div class="col-4"></div>
  </div>
</div>`
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
