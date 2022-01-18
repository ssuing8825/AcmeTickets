import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fm-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent {}
