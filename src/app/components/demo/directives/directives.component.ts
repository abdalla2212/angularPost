import { Component } from '@angular/core';

@Component({
  selector: 'app-directives',
  templateUrl: './directives.component.html',
  styleUrl: './directives.component.css',
})
export class DirectivesComponent {
  isActive = true;

  userPosts = [
    {
      userName: 'abdullah',
      userImage:
        'https://media.cntraveler.com/photos/6480f7ef80f906257d9d0eac/16:9/w_8656,h_4869,c_limit/Best%20snorkeling%20in%20the%20world_%20San%20Crist%C3%B3bal,%20Gal%C3%A1pagos%20GettyImages-1482774223.jpg',

      postDescription:
        'Discover an unforgettable snorkeling experience in the crystal-clear waters of San Cristóbal, Galápagos, where vibrant marine life meets breathtaking natural beauty — one of the world’s top snorkeling destinations.',
      postImage:
        'https://media.cntraveler.com/photos/6480f7ef80f906257d9d0eac/16:9/w_8656,h_4869,c_limit/Best%20snorkeling%20in%20the%20world_%20San%20Crist%C3%B3bal,%20Gal%C3%A1pagos%20GettyImages-1482774223.jpg',
    },
    'Post 2',
    'Post 3',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
    'Post 4',
  ];
}
