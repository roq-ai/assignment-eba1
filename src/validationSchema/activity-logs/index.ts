import * as yup from 'yup';

export const activityLogValidationSchema = yup.object().shape({
  timestamp: yup.date().required(),
  action: yup.string().required(),
  resource: yup.string().required(),
  user_id: yup.string().nullable(),
});
