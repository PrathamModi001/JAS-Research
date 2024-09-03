// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** form validation import
import { useFormik } from 'formik'
import * as Yup from 'yup'

// ** MUI Imports
import { LoadingButton } from '@mui/lab'
import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

// ** Demo Imports
import { useSnackbar } from 'notistack'
import { useUserUpdatePassword } from 'src/shared/utility/services/hooks/register'

// ** Icons Imports
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import { selectUser } from 'src/redux/reducers/authSlice'
import { useSelector } from 'react-redux'
import { userRole } from 'src/shared/utility/helpers'

const TabSecurity = () => {
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const user = useSelector(selectUser)

  // ** States
  const [values, setValues] = useState({
    newPassword: '',
    currentPassword: '',
    showNewPassword: false,
    confirmNewPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })

  const {
    data: setUserUpdatePasswordData,
    isLoading: setUserUpdatePasswordLoading,
    isError: setUserUpdatePasswordIsError,
    error: setUserUpdatePasswordError,
    mutate: setUserUpdatePassword
  } = useUserUpdatePassword()

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      oldPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string().required('Current Password is required'),
      newPassword: Yup.string()
        .notOneOf([Yup.ref('oldPassword'), null], 'New Password must be different from Current Password')
        .required('New Password is required')
        .matches(/^[^\s]+$/, 'Password must not contain whitespace') // Add this rule to disallow whitespace
        .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
        .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
        .matches(/^(?=.*\d)/, 'Password must contain at least one number')
        .matches(/^(?=.*[@$!%*?&])/, 'Password must contain at least one special character')
        .min(8, 'Password must be at least 8 characters long'),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm New Password is required')
    }),
    onSubmit: values => {
      // Remove confirmNewPassword field from values
      const { confirmNewPassword, ...formValues } = values
      setUserUpdatePassword(formValues)
    }
  })

  // Handle Current Password
  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleMouseDownCurrentPassword = event => {
    event.preventDefault()
  }

  // Handle New Password
  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleMouseDownNewPassword = event => {
    event.preventDefault()
  }

  // Handle Confirm New Password
  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleMouseDownConfirmNewPassword = event => {
    event.preventDefault()
  }

  const handlePaste = e => {
    e.preventDefault()
    const clipboardData = e.clipboardData.getData('text/plain').trim()
    formik.setFieldValue('confirmNewPassword', clipboardData)
  }

  useEffect(() => {
    try {
      if (setUserUpdatePasswordData && !setUserUpdatePasswordLoading) {
        enqueueSnackbar(setUserUpdatePasswordData?.message, { variant: 'success' })

        user.role === userRole.Admin ? router.push('/users') : router.push('/research-paper')
      }
      if (setUserUpdatePasswordIsError) {
        enqueueSnackbar(setUserUpdatePasswordError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [setUserUpdatePasswordData, setUserUpdatePasswordLoading, setUserUpdatePasswordIsError])

  return (
    <CardContent sx={{ paddingBottom: 0 }}>
      <form autoComplete='off' onSubmit={formik.handleSubmit}>
        <Typography sx={{ mb: 4 }} variant='h5'>
          Change Password
        </Typography>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={5}>
              <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-current-password'>Current Password</InputLabel>
                  <OutlinedInput
                    label='Current Password'
                    name='oldPassword'
                    value={formik.values.oldPassword}
                    id='account-settings-current-password'
                    type={values.showCurrentPassword ? 'text' : 'password'}
                    onChange={formik.handleChange}
                    error={formik.touched.oldPassword && formik.errors.oldPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={handleMouseDownCurrentPassword}
                        >
                          {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.oldPassword && formik.errors.oldPassword && (
                    <FormHelperText error id='accountId-error'>
                      {formik.errors.oldPassword}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ marginTop: 6 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-new-password'>New Password</InputLabel>
                  <OutlinedInput
                    label='New Password'
                    name='newPassword'
                    value={formik.values.newPassword}
                    onChange={event => {
                      const trimmedValue = event.target.value.trim()
                      formik.setFieldValue('newPassword', trimmedValue)
                    }}
                    id='account-settings-new-password'
                    type={values.showNewPassword ? 'text' : 'password'}
                    error={formik.touched.newPassword && formik.errors.newPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowNewPassword}
                          aria-label='toggle password visibility'
                          onMouseDown={handleMouseDownNewPassword}
                        >
                          {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <FormHelperText error id='accountId-error'>
                      {formik.errors.newPassword}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='account-settings-confirm-new-password'>Confirm New Password</InputLabel>
                  <OutlinedInput
                    label='Confirm New Password'
                    name='confirmNewPassword'
                    onChange={event => {
                      const trimmedValue = event.target.value.trim()
                      formik.setFieldValue('confirmNewPassword', trimmedValue)
                    }}
                    value={formik.values.confirmNewPassword}
                    id='account-settings-confirm-new-password'
                    type={values.showConfirmNewPassword ? 'text' : 'password'}
                    onPaste={handlePaste}
                    error={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          aria-label='toggle password visibility'
                          onClick={handleClickShowConfirmNewPassword}
                          onMouseDown={handleMouseDownConfirmNewPassword}
                        >
                          {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                    <FormHelperText error id='accountId-error'>
                      {formik.errors.confirmNewPassword}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{ display: 'flex', marginTop: [7.5, 2.5], alignItems: 'center', justifyContent: 'center' }}
          >
            <img width={183} alt='avatar' height={256} src='/images/pages/pose-m-1.png' />
          </Grid>
        </Grid>
        <Box sx={{ mt: 11 }}>
          <LoadingButton
            type='submit'
            variant='contained'
            disabled={setUserUpdatePasswordData?.status === true ? true : false}
            loading={setUserUpdatePasswordLoading}
          >
            Save Changes
          </LoadingButton>
        </Box>
      </form>
    </CardContent>
  )
}

export default TabSecurity
