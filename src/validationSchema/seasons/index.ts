import * as yup from 'yup';

export const seasonValidationSchema = yup.object().shape({
  season_number: yup.number().integer().required(),
  series_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
