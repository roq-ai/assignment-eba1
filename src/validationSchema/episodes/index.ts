import * as yup from 'yup';

export const episodeValidationSchema = yup.object().shape({
  episode_number: yup.number().integer().required(),
  title: yup.string().required(),
  duration: yup.number().integer().required(),
  season_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
