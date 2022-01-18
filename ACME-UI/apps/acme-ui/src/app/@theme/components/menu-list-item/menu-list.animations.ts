import { animate, state, style, transition, trigger } from '@angular/animations';

export const showHideMenuText = trigger('showHideMenuText', [
  state(
    'show',
    style({
      opacity: 1,
      display: 'block',
    })
  ),
  state(
    'hide',
    style({
      opacity: 0,
      display: 'none',
    })
  ),
  transition('show => hide', [animate('0.3s ease-in')]),
  transition('hide => show', [animate('0.3s ease-in')]),
]);
