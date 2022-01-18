export enum Theme {
  Light = 'light',
  Dark = 'Dark',
}

export interface IColorPallet {
  primary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
}

export interface ITheme {
  light: IColorPallet;
  dark: IColorPallet;
}

export const themeColorPallet: ITheme = {
  light: {
    primary: '#3f51b5',
    accent: '#ff4081',
    success: '#5aa454',
    warning: '#ffc116',
    danger: '#c00000',
  },
  dark: {
    primary: '#3f51b5',
    accent: '#ffd740',
    success: '#5aa454',
    warning: '#ffc116',
    danger: '#c00000',
  },
};
