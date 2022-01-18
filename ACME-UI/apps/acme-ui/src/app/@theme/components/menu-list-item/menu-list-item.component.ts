import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { appConstants } from '@shared/constants';
import { NavItem } from '@shared/constants/routes.constants';
import { RoleType } from '@shared/enums';

import { AuthService } from '../../../auth/auth.service';

import { showHideMenuText } from './menu-list.animations';

@Component({
  selector: 'fm-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('500ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
    showHideMenuText,
  ],
})
export class MenuListItemComponent implements OnInit {
  @Input() public depth = 0;
  public expanded = false;
  @Input() public item: NavItem = <NavItem>{};
  @Input() public showNavItemTitle = appConstants.sideNav.showSideNavTitleInitialState;
  roleTypes = RoleType;

  constructor(public router: Router, private _authService: AuthService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }
  ngOnInit() {
    console.log('TODO');
  }

  public onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    } else if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
}
