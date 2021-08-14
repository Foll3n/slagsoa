import {Component, EventEmitter, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {NgbCarousel, NgbCarouselConfig, NgbSlideEvent} from '@ng-bootstrap/ng-bootstrap';
import {Client} from '../models/client/Client';
import {Event} from '@angular/router';

@Component({
  selector: 'app-aide-ajout-projet',
  templateUrl: './aide-ajout-projet.component.html',
  styleUrls: ['./aide-ajout-projet.component.scss'],
   styles: [`
    /deep/ .carousel-item.active {
        border: none;
    }`, `
    /deep/ .carousel {
        outline: none;
     }`
  ]
})
export class AideAjoutProjetComponent implements OnInit, OnChanges{
  @ViewChild('caroussel') myCarousel: NgbCarousel | undefined;

  numeroPage=0;
  client!: Client;

  constructor(config: NgbCarouselConfig) {

    config.interval = 0;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
    config.animation = true;
  }
  ngOnInit(): void {
  }
  setClient(event: Client){
    console.log(event,"èèèèèèèèèèèèèèèèèèèèè");
    const c = event as Client;
    this.client = new Client(c.idClient,c.nomSociete,c.adresse,c.mail,c.siret);
    console.log("client dans le pere:", this.client);
    this.myCarousel?.next();
  }
  public get width() {
    return window.innerWidth;
  }
  onSlide($event: NgbSlideEvent) {

    let res = ($event.current.split("-").pop());
    if (res)
      this.numeroPage = +res;
    // this.update();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("on changes de aide ajout projet");
  }
}
