import { Component, OnInit, Renderer, ElementRef } from '@angular/core';

@Component({
  selector: 'nordson-email-link',
  templateUrl: './email-link.component.html',
  styleUrls: ['./email-link.component.css']
})
export class EmailLinkComponent implements OnInit {
  constructor(private renderer: Renderer) {}

  ngOnInit() {}
}
