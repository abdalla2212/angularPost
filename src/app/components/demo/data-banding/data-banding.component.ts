import { Component } from '@angular/core';
import { Iuser } from '../../../models/useer.models';

@Component({
  selector: 'app-data-banding',
  templateUrl: './data-banding.component.html',
  styleUrl: './data-banding.component.css'
})
export class DataBindingComponent {
  user: Iuser = {
    userName: "Ahmed Kamal",
    userAge: 15,
    // userAddress: "Elzhour",
    userImage: 'https://cdn-icons-png.flaticon.com/512/10337/10337609.png',
    _userAddress: ""
  }

  message = "";

  sayHello(e: Event) {
    console.log(e)
    console.log('Hello ' + this.user.userName)
  }

  // onInput(e: Event) {
  //   this.message = (e.target as HTMLInputElement).value;
  // }
}

