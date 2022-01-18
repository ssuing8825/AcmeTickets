export const appConstants = {
  loginRoute: 'auth/login',
  unknownLoginErrorMsg: 'Login failed! Please try again.',
  unknownError: {
    error: 'Oops Something Went Wrong!',
    message: 'Please try to reload browser and if problem persists then please contact us.',
  },
  defaultServerError: {
    error: 'Server Error!',
    message: 'Unknown error occurred! Please try again.',
  },
  defaultNetworkError: {
    error: 'Network Error!',
    message: 'Please check your internet connection and try again.',
  },
  defaultJavaScriptError: {
    error: 'App crashed!',
    message: 'Looks like app is not working as it should be. Please retry or try to reload browser.',
  },
  sideNav: {
    maxSideNavContentLeftMargin: 63,
    animationDelay: 250,
    textCloseAnimationDelay: 1000,
    textOpenAnimationDelay: 1000,
    openAnimation: 'open',
    closeAnimation: 'close',
    isSideNavInitialExpandedState: true,
    showSideNavTitleInitialState: true,
    shouldOpenSideNavInitialState: true,
  },
  estimateRequestsAutoRefreshTime: 60000,
  numberOfBeforeDaysForPlanRenew: 10,
};
