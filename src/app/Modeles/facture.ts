export class Facture {
  idFacture!: string;
  montantTTC!: string;
  montantHT!: string;
  tva!: string;
  pourcentageTVA!: string;
  categorie!: string;
  sousCategorie!: string;
  dateFacture!: string;
  commentaire!: string;

  constructor(montant_ttc:string, categorie: string , sscategorie:string , date: string , commentaire: string) {
    this.montantTTC = montant_ttc;
    this.categorie = categorie;
    this.sousCategorie = sscategorie;
    this.dateFacture = date;
    this.commentaire = commentaire;
  }

}
