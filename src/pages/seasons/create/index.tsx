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

import { createSeason } from 'apiSdk/seasons';
import { seasonValidationSchema } from 'validationSchema/seasons';
import { SeriesInterface } from 'interfaces/series';
import { UserInterface } from 'interfaces/user';
import { getSeries } from 'apiSdk/series';
import { getUsers } from 'apiSdk/users';
import { SeasonInterface } from 'interfaces/season';

function SeasonCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SeasonInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSeason(values);
      resetForm();
      router.push('/seasons');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SeasonInterface>({
    initialValues: {
      season_number: 0,
      series_id: (router.query.series_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: seasonValidationSchema,
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
              label: 'Seasons',
              link: '/seasons',
            },
            {
              label: 'Create Season',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Season
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Season Number"
            formControlProps={{
              id: 'season_number',
              isInvalid: !!formik.errors?.season_number,
            }}
            name="season_number"
            error={formik.errors?.season_number}
            value={formik.values?.season_number}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('season_number', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<SeriesInterface>
            formik={formik}
            name={'series_id'}
            label={'Select Series'}
            placeholder={'Select Series'}
            fetcher={getSeries}
            labelField={'title'}
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
              onClick={() => router.push('/seasons')}
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
    entity: 'season',
    operation: AccessOperationEnum.CREATE,
  }),
)(SeasonCreatePage);
