// ** React Imports
import { useEffect, useState } from 'react'

import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import { LoadingButton } from '@mui/lab'
import { CustomModal } from 'src/@core/components/modal'
import { useUpdateUser, useUserMe, useChangeEmail } from 'src/shared/utility/services/hooks/register'

// ** form validation import
import { Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { setUser } from 'src/redux/reducers/authSlice'
import { useRouter } from 'next/router'

const TabAccount = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClose = () => {
    setOpen(false)
  }

  const {
    data: userMeData,
    isLoading: userMeLoading,
    isError: userMeIsError,
    error: userMeError,
    mutate: userMe
  } = useUserMe()

  useEffect(() => {
    try {
      if (userMeData && !userMeLoading) {
        formik.setFieldValue('firstName', userMeData?.data?.user?.firstName)
        formik.setFieldValue('lastName', userMeData?.data?.user?.lastName)
        setEmail(userMeData?.data?.user?.email)
      }
      if (userMeIsError) {
        enqueueSnackbar(userMeError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [userMeData, userMeLoading, userMeIsError])

  useEffect(() => {
    userMe()
  }, [])

  const {
    data: updateUserData,
    isLoading: updateUserLoading,
    isError: updateUserIsError,
    error: updateUserError,
    mutate: updateUser
  } = useUpdateUser()

  useEffect(() => {
    try {
      if (updateUserData && !updateUserLoading) {
        enqueueSnackbar(updateUserData?.message, { variant: 'success' })
        userMe()
      }
      if (updateUserIsError) {
        enqueueSnackbar(updateUserError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [updateUserData, updateUserLoading, updateUserIsError])

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(/^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/, 'Invalid first name')
        .required('First Name Required'),
      lastName: Yup.string()
        .matches(/^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/, 'Invalid last name')
        .required('Last Name Required')
    }),
    onSubmit: values => {
      updateUser(values)
    }
  })

  const {
    data: changeEmailData,
    isLoading: changeEmailLoading,
    isError: changeEmailIsError,
    error: changeEmailError,
    mutate: changeEmail
  } = useChangeEmail()

  const formikChangeEmail = useFormik({
    initialValues: {
      newEmail: ''
    },
    validationSchema: Yup.object({
      newEmail: Yup.string()
        .matches(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Invalid email'
        )
        .required('Required')
    }),
    onSubmit: values => {
      changeEmail({
        newEmail: values?.newEmail
      })
    }
  })

  useEffect(() => {
    try {
      if (changeEmailData && !changeEmailLoading) {
        enqueueSnackbar(changeEmailData?.message + ' You have to login again', { variant: 'success' })
        dispatch(setUser(null))
        router.push('/login')
      }

      if (changeEmailIsError) {
        enqueueSnackbar(changeEmailError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [changeEmailData, changeEmailLoading, changeEmailIsError])

  return <>
    <CardContent>
      <form autoComplete='off' onSubmit={formik.handleSubmit}>
        <Typography sx={{ fontWeight: 500 }} variant='h5'>
          Update Your Profile
        </Typography>
        <Grid container sx={{ display: 'flex', marginBottom: 3 }}>
          <Grid container sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Grid item xs={12} sm={12} md={12} sx={{ marginTop: 4.8 }}>
              <TextField
                fullWidth
                sx={{}}
                type='text'
                label='First Name'
                name='firstName'
                value={formik.values.firstName}
                onChange={event => {
                  const trimmedValue = event.target.value.replace(/\s+/g, ' ')
                  formik.setFieldValue('firstName', trimmedValue)
                }}
                helperText={formik.touched.firstName && formik.errors.firstName && formik.errors.firstName}
                error={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ marginTop: 4.8 }}>
              <TextField
                fullWidth
                sx={{}}
                type='text'
                label='Last Name'
                name='lastName'
                value={formik.values.lastName}
                onChange={event => {
                  const trimmedValue = event.target.value.replace(/\s+/g, ' ')
                  formik.setFieldValue('lastName', trimmedValue)
                }}
                helperText={formik.touched.lastName && formik.errors.lastName && formik.errors.lastName}
                error={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>

            <Grid
              item
              xs={12}
              display={'flex'}
              justifyContent={'space-between'}
              sm={12}
              md={12}
              sx={{ marginTop: 4.8 }}
            >
              <TextField
                fullWidth
                sx={{ marginBottom: 4, marginRight: 2 }}
                type='text'
                label='Email'
                name='email'
                value={email}
                InputProps={{
                  readOnly: true
                }}
              />
              <div style={{}}>
                <LoadingButton
                  size='large'
                  variant='contained'
                  style={{ height: '78%' }}
                  sx={{}}
                  onClick={e => {
                    setOpen(true)
                  }}
                >
                  Change
                </LoadingButton>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <div style={{ display: 'flex', gap: 10 }}>
          <LoadingButton
            size='large'
            type='submit'
            variant='contained'
            sx={{ marginBottom: 7 }}
            loading={updateUserLoading}
          >
            Update
          </LoadingButton>
        </div>
      </form>
    </CardContent>
    <CustomModal open={open} onClose={handleClose} header='Email'>
      <div style={{ mb: 6 }}>
        <Typography variant='h4' sx={{ fontWeight: 600, padding: '2rem 1rem', textAlign: 'center' }}>
          Change Email
        </Typography>
      </div>
      <form autoComplete='off' onSubmit={formikChangeEmail.handleSubmit}>
        <TextField
          fullWidth
          sx={{ marginBottom: 4 }}
          type='email'
          label='Email'
          name='newEmail'
          value={formikChangeEmail.values.newEmail}
          onChange={event => {
            const trimmedValue = event.target.value.trimStart()
            formikChangeEmail.setFieldValue('newEmail', trimmedValue)
          }}
          helperText={
            formikChangeEmail.touched.newEmail &&
            formikChangeEmail.errors.newEmail &&
            formikChangeEmail.errors.newEmail
          }
          error={formikChangeEmail.touched.newEmail && formikChangeEmail.errors.newEmail}
        />
        <Typography sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }} variant='body2'>
          Note:- After updating your email, you will be automatically logged out and required to log in again using
          your new email address after completing the verification process.
        </Typography>
        <div style={{ display: 'flex', gap: 10, marginTop: '10px', justifyContent: 'center' }}>
          <LoadingButton
            size='large'
            type='submit'
            variant='contained'
            sx={{ marginBottom: 7 }}
            loading={changeEmailLoading}
          >
            Submit
          </LoadingButton>
          <LoadingButton size='large' onClick={handleClose} variant='outlined' sx={{ marginBottom: 7 }}>
            Cancel
          </LoadingButton>
        </div>
      </form>
    </CustomModal>
  </>;
}

export default TabAccount
