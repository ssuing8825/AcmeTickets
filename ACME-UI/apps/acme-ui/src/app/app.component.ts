import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'fm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  URL: any;

  constructor(private cookieService: CookieService) {}
  // eslint-disable-next-line max-lines-per-function
  ngOnInit() {
    console.log('TODO');
  }
}
