import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrl: './parent.component.css'
})
export class ParentComponent {

  messageFromParent = "Hello My Child";
  messageFromChild = "";

  myChildSayHello(message: string) {
    this.messageFromChild = message;

    console.log(message);
  }
}