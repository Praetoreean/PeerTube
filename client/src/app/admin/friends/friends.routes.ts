import { Routes } from '@angular/router';

import { FriendsComponent } from './friends.component';
import { FriendAddComponent } from './friend-add';
import { FriendListComponent } from './friend-list';

export const FriendsRoutes: Routes = [
  {
      path: 'friends',
      component: FriendsComponent,
      children: [
        {
          path: '',
          redirectTo: 'list',
          pathMatch: 'full'
        },
        {
          path: 'list',
          component: FriendListComponent
        },
        {
          path: 'add',
          component: FriendAddComponent
        }
      ]
    }
];
