import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {Responsable} from '../../models/responsable/responsable';
import {ResponsableService} from '../../../services/responsable.service';


@Component({
  selector: 'app-slide2',
  templateUrl: './slide2.component.html',
  styleUrls: ['./slide2.component.scss']
})
export class Slide2Component implements OnInit {
  @Output() eventItem = new EventEmitter<Responsable>();
  listeResponsables!: Responsable[];
  responsableSubscription!: Subscription;
  responsableForm!: FormGroup;
  responsableNom: string = '';
  tempResponsable: Responsable | undefined = undefined;
  selectedResponsable: Responsable | undefined = undefined;

  constructor(private responsableService: ResponsableService) {

    this.responsableForm = new FormGroup({
        nom: new FormControl(),
        prenom: new FormControl(),
        mail: new FormControl(),
      });
    this.responsableSubscription = this.responsableService.responsablesSubject.subscribe((responsables: Responsable[]) =>
    {
      console.log("je recupere");
      this.listeResponsables = responsables;
    });
  }
  updateResponsable(responsable: Responsable){
    this.responsableForm.patchValue({
      mail: responsable.mail,
      nom: responsable.nom,
      prenom: responsable.prenom,
    });
    this.selectedResponsable = responsable;
  }
  ngOnInit(): void {
    this.responsableService.emitResponsablesSubject();
    console.log("updateResponsable ");
  }
  applyResponsable(){
    // tslint:disable-next-line:no-non-null-assertion
    this.updateResponsable(this.tempResponsable!);
    // this.tempResponsable = undefined;
  }
  sendResponsable(){
    console.log("je passe meme pas laaa");
    const responsable = new Responsable(this.selectedResponsable ? this.selectedResponsable.idResponsable : '', this.responsableForm.get('nom')?.value, this.responsableForm.get('prenom')?.value, this.responsableForm.get('mail')?.value,'');




    // resetForm(this.responsableForm);
    console.log("je suis dans le fils j'envoie ",responsable,"au pere");
    this.eventItem.emit(responsable);
  }
  searchTerm(){
    this.selectedResponsable = undefined;
    this.tempResponsable = this.listeResponsables.find(r => this.responsableNom.length > 1 && r.nom.toLowerCase().includes(this.responsableNom.toLowerCase()));
    console.log(this.tempResponsable);
  }
}
