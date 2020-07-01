import { AfterViewInit, Component, ContentChildren, Directive, ElementRef, Input, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, Output, EventEmitter } from '@angular/core';
import { CarouselItemDirective } from './reports-carousel-directive';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { addMonths } from '@progress/kendo-date-math';

@Directive({
  selector: '.carousel-item'
})
export class CarouselItemElement {
}

@Component({
  selector: 'carousel',
  exportAs: 'carousel',
  template: `
  <div class="row" *ngIf="showControls" [ngStyle]="{'visibility': (currentGraph==1) ? 'hidden' : 'visible'}" style="text-align:center;">
              <div class="col s12 m12 l12 xl12 dateslider">
              <span class="leftbtn"><i class="fa fa-arrow-left carousel-arrow" aria-hidden="true" (click)="prev()"></i></span>
              <span class="selectdate padding-left-right-16"><strong> {{currentGraph}}</strong></span>
                  <i class="fa fa-arrow-right carousel-arrow" aria-hidden="true" (click)="next()"></i>
                  <span class="rightbtn"></span>
              </div>
              <div class="row pb-10" *ngIf="displayTargets">
                <div class="col s12 m3 l3 xl3 t-left">
                  <div class="title-color pb">Target Add-on</div>
                  <div><strong> {{addon}}gm</strong></div>
                </div>
                <div class="col s12 m3 l3 xl3 t-left">
                <div class="title-color pb">Average per Product</div>
                <div><strong> {{perProduct}}gm</strong></div>
                </div>
                <div class="col s12 m3 l3 xl3 t-left">
                <div class="title-color pb">Total no. of Products</div>
                <div><strong> {{totalProducts}}</strong></div>
                </div>
                <div class="col s12 m3 l3 xl3 t-left">
                <div class="title-color pb">Products out of Limit</div>
                <div><strong> {{outOfLimit}}</strong></div>
                </div>
              </div>
            </div>
    <section class="carousel-wrapper pb-10" [ngStyle]="carouselWrapperStyle">
      <ul class="carousel-inner" #carousel>
        <li *ngFor="let item of items;" class="carousel-item">
          <ng-container [ngTemplateOutlet]="item.tpl"></ng-container>
        </li>
      </ul>
    </section>
    <div class="display-flex-align-justify-center pb-35" *ngIf="isSystemStatus">
      <span class="square run">
      </span>
      <span class="pad-color-labels">
      Run
      </span>
      <span class="square idle">
      </span>
      <span class="pad-color-labels">
      Idle
      </span><span class="square alert">
      </span>
      <span class="pad-color-labels">
      Alert
      </span><span class="square fault-stop">
      </span>
      <span class="pad-color-labels">
      Fault/Stop
      </span><span class="square offline">
      </span>
      <span class="pad-color-labels">
      Offline
      </span>
    </div>


  `,
  styleUrls: ['./reports.component.css']
})
export class CarouselComponent implements AfterViewInit {
  @ContentChildren(CarouselItemDirective) items : QueryList<CarouselItemDirective>;
  @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements : QueryList<ElementRef>;
  @ViewChild('carousel') private carousel : ElementRef;
  @Input() timing = '250ms ease-in';
  @Input() showControls = true;
  private player : AnimationPlayer;
  private itemWidth : number;
  private currentSlide = 0;
  carouselWrapperStyle = {}
  @Output() nextEvent = new EventEmitter<any>();
  @Output() prevEvent = new EventEmitter<any>();
  @Input() currentGraph;
  @Input() graphType;
  @Input() addon;
  @Input() perProduct;
  @Input() totalProducts;
  @Input() outOfLimit;
  @Input() displayTargets;
  @Input() isSystemStatus = false;
  next() {
    if( this.currentSlide + 1 === this.items.length ) return;
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation : AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.nextEvent.emit(this.currentSlide)
  }

  private buildAnimation( offset ) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

  prev() {
    if( this.currentSlide === 0 ) return;

    this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
    const offset = this.currentSlide * this.itemWidth;

    const myAnimation : AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
    this.prevEvent.emit(this.currentSlide)
  }

  constructor( private builder : AnimationBuilder ) {
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.
    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
      this.carouselWrapperStyle = {
        width: `${this.itemWidth}px`
      }
    });
  }
}
