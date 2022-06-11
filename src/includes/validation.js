import {
  Form as VForm,
  Field as VField,
  defineRule,
  ErrorMessage,
  configure,
} from 'vee-validate';
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minValue,
  max_value as maxValue,
  confirmed,
  not_one_of as excluded,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VForm', VForm);
    app.component('VField', VField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('password_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('country_excluded', excluded);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `This field ${ctx.field} is required.`,
          min: `This field ${ctx.field} is too short.`,
          max: `This field ${ctx.field} is too long.`,
          alpha_spaces: `This field ${ctx.field} may only contain alphabetical characters and spaces.`,
          email: `This field ${ctx.field} must be a valid email.`,
          min_value: `This field ${ctx.field} is too low.`,
          max_value: `This field ${ctx.field} is too high.`,
          password_mismatch: 'This passwords don\'t match.',
          excluded: `You are not allowed to use this value for the field ${ctx.field}.`,
          country_excluded: 'Due to restructions, we do not accpet users from this location.',
          tos: 'You must accept the Terms of Service.',
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `This field ${ctx.field} is invalid.`;

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
