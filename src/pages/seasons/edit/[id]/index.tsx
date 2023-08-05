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
  Center,
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
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getSeasonById, updateSeasonById } from 'apiSdk/seasons';
import { seasonValidationSchema } from 'validationSchema/seasons';
import { SeasonInterface } from 'interfaces/season';
import { SeriesInterface } from 'interfaces/series';
import { UserInterface } from 'interfaces/user';
import { getSeries } from 'apiSdk/series';
import { getUsers } from 'apiSdk/users';

function SeasonEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<SeasonInterface>(
    () => (id ? `/seasons/${id}` : null),
    () => getSeasonById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SeasonInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSeasonById(id, values);
      mutate(updated);
      resetForm();
      router.push('/seasons');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SeasonInterface>({
    initialValues: data,
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
              label: 'Update Season',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Season
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(SeasonEditPage);
