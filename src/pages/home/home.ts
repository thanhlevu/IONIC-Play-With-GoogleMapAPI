import { Component } from "@angular/core";
import { Modal, ModalController, ModalOptions } from "ionic-angular";
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(private modal: ModalController) {}

  openModal() {
    // open Modal, transfer and receive data
    /* const myModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: false
      // enterAnimation?: string;
      // leaveAnimation?: string;
      // cssClass?: string;
    };
    const myData = {
      name: "Paul Halliday",
      occupation: "Developer"
    };
    const settingMapModal: Modal = this.modal.create(
      "SettingMapPage",
      {
        data: myData
      },
      myModalOptions
    );
    settingMapModal.present();

    settingMapModal.onDidDismiss(data => {
      console.log("i have dismissed");
      console.log(data);
    });

    settingMapModal.onWillDismiss(data => {
      console.log("i am about to dismiss");
      console.log(data);
    }); */
  }
}
