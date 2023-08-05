import * as yup from 'yup';

export const movieValidationSchema = yup.object().shape({
  title: yup.string().required(),
  genre: yup.string().required(),
  release_year: yup.number().integer().required(),
  director: yup.string().required(),
  duration: yup.number().integer().required(),
  description: yup.string().required(),
  user_id: yup.string().nullable(),
});
