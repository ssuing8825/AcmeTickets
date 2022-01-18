export const validatorsConfig = {
  required: { msg: 'This field is required' },
  min: { msg: 'Must be positive number' },
  minLength: {
    msg: (requiredLength: string | number, actualLength: string | number) => `Expect ${requiredLength} but got ${actualLength}`,
  },
  maxLength: {
    msg: (requiredLength: string | number, actualLength: string | number) => `Expect maximum ${requiredLength} but got ${actualLength}`,
  },
  email: {
    msg: `Invalid email`,
    regEx: `^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$`,
  },
  canadaZipCode: {
    msg: `Invalid zip Code`,
    regEx: `^[ABCEGHJKLMNPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z][ ]?\\d[ABCEGHJ-NPRSTV-Z]\\d$`,
  },
  usZipCode: {
    msg: `Invalid zip Code`,
    regEx: `^\\d{5}([ \\-]\\d{4})?$`,
  },
  phoneNumber: {
    msg: `Invalid phone number`,
    regEx: '^(\\([0-9]{3}\\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$',
  },
  address: {
    msg: `Address isn't valid`,
    regEx: '',
  },
  number: {
    msg: `Must contains only number`,
    regEx: '^\\d+$',
  },
  password: {
    msg: `Must contain 8 characters having atleast 1 uppercase,1 lowercase,1 number and 1 special character`,
    regEx: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  },
};

export const errorTailerConfig = {
  errors: {
    useValue: {
      required: 'This field is required',
      email: validatorsConfig.email.msg,
      min: validatorsConfig.min.msg,
      minlength: (error: { requiredLength: string | number; actualLength: string | number }) =>
        validatorsConfig.minLength.msg(error.requiredLength, error.actualLength),
      maxlength: (error: { requiredLength: string | number; actualLength: string | number }) =>
        validatorsConfig.maxLength.msg(error.requiredLength, error.actualLength),
      invalidAddress: () => validatorsConfig.address.msg,
      pattern: (error: { requiredPattern: string; actualValue: string }) => {
        switch (error.requiredPattern) {
          case validatorsConfig.email.regEx:
            return validatorsConfig.email.msg;
          case validatorsConfig.number.regEx:
            return validatorsConfig.number.msg;
          case validatorsConfig.canadaZipCode.regEx:
            return validatorsConfig.canadaZipCode.msg;
          case validatorsConfig.usZipCode.regEx:
            return validatorsConfig.usZipCode.msg;
          case validatorsConfig.phoneNumber.regEx:
            return validatorsConfig.phoneNumber.msg;
          case validatorsConfig.password.regEx:
            return validatorsConfig.password.msg;
          default:
            return 'Invalid Field';
        }
      },
    },
  },
};
