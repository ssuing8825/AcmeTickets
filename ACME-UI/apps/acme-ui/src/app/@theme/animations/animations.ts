import { animate, state, style, transition, trigger } from '@angular/animations';

import { appConstants } from '@shared/constants/app.constant';

const sideNav = appConstants.sideNav;
const delay = appConstants.sideNav.animationDelay;
const sideNavCloseToOpenState = `${sideNav.closeAnimation} => ${sideNav.openAnimation}`;
const sideNavOpenToCloseState = `${sideNav.openAnimation} => ${sideNav.closeAnimation}`;
export const onSideNavChange = trigger('onSideNavChange', [
  state(
    'close',
    style({
      'min-width': '50px',
    })
  ),
  state(
    'open',
    style({
      'min-width': '200px',
    })
  ),
  transition(sideNavCloseToOpenState, animate(`${delay}ms ease-in`)),
  transition(sideNavOpenToCloseState, animate(`${delay}ms ease-in`)),
]);

export const onMainContentChange = trigger('onMainContentChange', [
  state(
    'close',
    style({
      'padding-left': '0px',
    })
  ),
  state(
    'open',
    style({
      'padding-left': '138px',
    })
  ),
  transition(sideNavCloseToOpenState, animate(`${delay}ms ease-in`)),
  transition(sideNavOpenToCloseState, animate(`${delay}ms ease-in`)),
]);

export const animateText = trigger('animateText', [
  state(
    'hide',
    style({
      display: 'none',
      opacity: 0,
    })
  ),
  state(
    'show',
    style({
      display: 'block',
      opacity: 1,
    })
  ),
  transition(sideNavCloseToOpenState, animate(`${sideNav.textOpenAnimationDelay}ms ease-out`)),
  transition(sideNavCloseToOpenState, animate(`${sideNav.textCloseAnimationDelay}ms ease-out`)),
]);

export const resizeAvatarOnSideNavCollapseExpand = trigger('resizeAvatarOnSideNavCollapseExpand', [
  state(
    'small',
    style({
      width: '30px',
      height: '30px',
    })
  ),
  state(
    'big',
    style({
      width: '50px',
      height: '50px',
    })
  ),
  transition('big => small', animate(`${sideNav.textOpenAnimationDelay}ms ease-out`)),
  transition('small => big', animate(`${sideNav.textCloseAnimationDelay}ms ease-out`)),
]);
