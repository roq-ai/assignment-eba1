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
import { getSeriesById, updateSeriesById } from 'apiSdk/series';
import { seriesValidationSchema } from 'validationSchema/series';
import { SeriesInterface } from 'interfaces/series';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function SeriesEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<SeriesInterface>(
    () => (id ? `/series/${id}` : null),
    () => getSeriesById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SeriesInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSeriesById(id, values);
      mutate(updated);
      resetForm();
      router.push('/series');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SeriesInterface>({
    initialValues: data,
    validationSchema: seriesValidationSchema,
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
              label: 'Series',
              link: '/series',
            },
            {
              label: 'Update Series',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Series
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
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

          <TextInput
            error={formik.errors.genre}
            label={'Genre'}
            props={{
              name: 'genre',
              placeholder: 'Genre',
              value: formik.values?.genre,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Release Year"
            formControlProps={{
              id: 'release_year',
              isInvalid: !!formik.errors?.release_year,
            }}
            name="release_year"
            error={formik.errors?.release_year}
            value={formik.values?.release_year}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('release_year', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.director}
            label={'Director'}
            props={{
              name: 'director',
              placeholder: 'Director',
              value: formik.values?.director,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.description}
            label={'Description'}
            props={{
              name: 'description',
              placeholder: 'Description',
              value: formik.values?.description,
              onChange: formik.handleChange,
            }}
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
              onClick={() => router.push('/series')}
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
    entity: 'series',
    operation: AccessOperationEnum.UPDATE,
  }),
)(SeriesEditPage);
