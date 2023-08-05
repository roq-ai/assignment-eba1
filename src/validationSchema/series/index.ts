import * as yup from 'yup';

export const seriesValidationSchema = yup.object().shape({
  title: yup.string().required(),
  genre: yup.string().required(),
  release_year: yup.number().integer().required(),
  director: yup.string().required(),
  description: yup.string().required(),
  user_id: yup.string().nullable(),
});
