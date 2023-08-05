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
import { getActivityLogById, updateActivityLogById } from 'apiSdk/activity-logs';
import { activityLogValidationSchema } from 'validationSchema/activity-logs';
import { ActivityLogInterface } from 'interfaces/activity-log';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function ActivityLogEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<ActivityLogInterface>(
    () => (id ? `/activity-logs/${id}` : null),
    () => getActivityLogById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ActivityLogInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateActivityLogById(id, values);
      mutate(updated);
      resetForm();
      router.push('/activity-logs');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ActivityLogInterface>({
    initialValues: data,
    validationSchema: activityLogValidationSchema,
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
              label: 'Activity Logs',
              link: '/activity-logs',
            },
            {
              label: 'Update Activity Log',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Activity Log
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="timestamp" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Timestamp
            </FormLabel>
            <DatePicker
              selected={formik.values?.timestamp ? new Date(formik.values?.timestamp) : null}
              onChange={(value: Date) => formik.setFieldValue('timestamp', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.action}
            label={'Action'}
            props={{
              name: 'action',
              placeholder: 'Action',
              value: formik.values?.action,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.resource}
            label={'Resource'}
            props={{
              name: 'resource',
              placeholder: 'Resource',
              value: formik.values?.resource,
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
              onClick={() => router.push('/activity-logs')}
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
    entity: 'activity_log',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ActivityLogEditPage);
