import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommandeInsert} from '../../models/commande/CommandeInsert';
import {FormControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {resetForm} from '../../../../environments/environment';
import {Projet} from '../../models/projet/Projet';
import {Utilisateur} from '../../../Modeles/utilisateur';
import {Subscription} from 'rxjs';
import {UserService} from '../../../services/user.service';
import {Realisation} from '../../models/realisation/Realisation';
import {CommandeHttpDatabase} from '../../../configuration-http/CommandeHttpDatabase';
import {HttpClient} from '@angular/common/http';
import {RealisationPost} from '../../models/realisation/RealisationPost';

@Component({
  selector: 'app-add-user-com',
  templateUrl: './add-user-com.component.html',
  styleUrls: ['./add-user-com.component.scss']
})
export class AddUserComComponent implements OnInit, OnChanges {
  @Output() listeUsersCom = new EventEmitter<Map<string, Utilisateur[]>>();
  @Output() eventBack = new EventEmitter();
  @Input() listeCommandes!: CommandeInsert[];
  @Input() isUpdate!: boolean;
  utilisateurs!: FormGroup;
  listeUsersSubscription!: Subscription;
  listeAllUsers!: Utilisateur[];
  listeUsersAdd= new Map<string, Utilisateur[]>();
  selectedCom!:CommandeInsert;
  realisationSubject!: Subscription;
  constructor(private userService: UserService, private httpClient: HttpClient) {

    this.listeUsersSubscription = this.userService.usersSubject.subscribe(
      (users: Utilisateur[]) => {
        this.listeUsersAdd= new Map<string, Utilisateur[]>();
        this.listeAllUsers = users;
        for(let u of users){
          const commandeHttp = new CommandeHttpDatabase(this.httpClient);
          const response = commandeHttp.getAllCommandsUser(u.id);
          response.subscribe(reponse => {
            if(reponse.status == 'OK'){
              if (reponse.realisations)
                for(let real of reponse.realisations){
                  let commande = this.listeCommandes.find(c => c.id == real.id)
                  if (commande){
                    if(this.listeUsersAdd.get(commande.num_com)) {
                      this.listeUsersAdd.get(commande.num_com)!.push(u);
                    }
                    else{
                      this.listeUsersAdd.set(commande.num_com, [u]);
                    }
                  }
                }
            }
            else{
              console.log("Erreur : getAllCommandsUser");
            }
          });
        }

      });

    this.utilisateurs = new FormGroup({
      idUser: new FormControl(),
      commande: new FormControl()
    });
  }

  /**
   * clear un utilisateur du formulaire
   * @param formDirective
   */
  clearUser(formDirective: FormGroupDirective){
    this.utilisateurs.get('idUser')?.reset();
    // formDirective.form.get('idUser')?.reset();
    this.utilisateurs.get('idUser')?.setValue('');
    this.utilisateurs.get('idUser')?.setErrors(null);
  }
  ngOnInit(): void {

  }
  /**
   * Ajoute une commande a un utilisateur et gère l'affichage
   */
  addUsersList(formDirective: FormGroupDirective){
    const user = this.userService.findUserById(this.utilisateurs.get('idUser')?.value); //mis en brut
    if (user){
    if (this.isUpdate){
      this.addRealisation(user,this.selectedCom );
    }
    else{
      if(this.listeUsersAdd.get(this.utilisateurs.get('commande')?.value)){
        this.listeUsersAdd.get(this.utilisateurs.get('commande')?.value)?.push(user);
      }
      else{
        this.listeUsersAdd.set(this.utilisateurs.get('commande')?.value, [user]);
      }
    }
    }
    this.clearUser(formDirective);
  }
  /**
   * Ajoute une commande à un utilisateur à l'aide du formulaire
   */
  addRealisation(user: Utilisateur, commande: CommandeInsert){
      let realisation = new RealisationPost(user.id, commande.id,  `${sessionStorage.getItem('id')}`);
      const commandeHttp = new CommandeHttpDatabase(this.httpClient);
      const response = commandeHttp.addCommandeUser(realisation);
      response.subscribe(reponse => {
        if(reponse.status == 'OK'){
          if(this.listeUsersAdd.get(this.utilisateurs.get('commande')?.value)){
            this.listeUsersAdd.get(this.utilisateurs.get('commande')?.value)?.push(user);
          }
          else{
            this.listeUsersAdd.set(this.utilisateurs.get('commande')?.value, [user]);
          }
          }
          this.userService.refreshRealisationsUser();
      });
    }

  /**
   * supprime une réalisation d'un utilisateur
   * @param user
   * @param commande
   */
  deleteRealisation(user: Utilisateur, commande: CommandeInsert){
    let realisation = new RealisationPost(user.id, commande.id,  `${sessionStorage.getItem('id')}`);
    const commandeHttp = new CommandeHttpDatabase(this.httpClient);
    const response = commandeHttp.deleteCommandeUser(realisation);
    response.subscribe(reponse => {
      if(reponse.status == 'OK'){
        const index = this.listeUsersAdd.get(this.selectedCom.num_com)?.indexOf(user, 0);
        this.listeUsersAdd.get(this.selectedCom.num_com)?.splice(index!, 1);
      }
    });

    // this.commandeUtilisateur.reset();
  }
  getAvailableUsers(){
    let res = [];
    if (this.selectedCom){
      for (const u of this.listeAllUsers ){
        if (this.listeUsersAdd.get(this.selectedCom.num_com)){
          if (!this.listeUsersAdd.get(this.selectedCom.num_com)!.find(user=>user.id == u.id)){
            res.push(u);
          }
        }
        else{
          res.push(u);
        }

      }
    }
    return res;
  }
  addUtilisateurs(){
  this.listeUsersCom.emit(this.listeUsersAdd);
  }
  retirerUser(user:Utilisateur){
    const u = this.listeUsersAdd.get(this.selectedCom.num_com)?.find(
      (u) => u.id === user.id);
    if (u){

      if(this.isUpdate)
          this.deleteRealisation(u, this.selectedCom);
      else{
        const index = this.listeUsersAdd.get(this.selectedCom.num_com)?.indexOf(u, 0);
        this.listeUsersAdd.get(this.selectedCom.num_com)?.splice(index!, 1);
      }
    }
  }
  public get width() {
    return window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.userService.emitUsersSubject();
  }


}
