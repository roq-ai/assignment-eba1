import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createEpisode } from 'apiSdk/episodes';
import { episodeValidationSchema } from 'validationSchema/episodes';
import { SeasonInterface } from 'interfaces/season';
import { UserInterface } from 'interfaces/user';
import { getSeasons } from 'apiSdk/seasons';
import { getUsers } from 'apiSdk/users';
import { EpisodeInterface } from 'interfaces/episode';

function EpisodeCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EpisodeInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEpisode(values);
      resetForm();
      router.push('/episodes');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EpisodeInterface>({
    initialValues: {
      episode_number: 0,
      title: '',
      duration: 0,
      season_id: (router.query.season_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: episodeValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Episodes',
              link: '/episodes',
            },
            {
              label: 'Create Episode',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Episode
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Episode Number"
            formControlProps={{
              id: 'episode_number',
              isInvalid: !!formik.errors?.episode_number,
            }}
            name="episode_number"
            error={formik.errors?.episode_number}
            value={formik.values?.episode_number}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('episode_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.title}
            label={'Title'}
            props={{
              name: 'title',
              placeholder: 'Title',
              value: formik.values?.title,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Duration"
            formControlProps={{
              id: 'duration',
              isInvalid: !!formik.errors?.duration,
            }}
            name="duration"
            error={formik.errors?.duration}
            value={formik.values?.duration}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('duration', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<SeasonInterface>
            formik={formik}
            name={'season_id'}
            label={'Select Season'}
            placeholder={'Select Season'}
            fetcher={getSeasons}
            labelField={'season_number'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/episodes')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'episode',
    operation: AccessOperationEnum.CREATE,
  }),
)(EpisodeCreatePage);
