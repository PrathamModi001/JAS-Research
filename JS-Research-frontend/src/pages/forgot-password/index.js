// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** form validation import
import { useFormik } from 'formik'
import * as Yup from 'yup'

// ** MUI Components
import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import { useUserForgotPassword, useUserUpdateForgotPassword } from 'src/shared/utility/services/hooks/register'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Icons Imports
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import logo from 'public/images/logos/image-3.svg'

// ** Demo Imports
import { useSnackbar } from 'notistack'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import Image from 'next/image'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.mode === 'light' ? theme.palette.primary.main : `rgba(231, 227, 252, 0.87)`
}))

const ForgotPasswordPage = () => {
  const { enqueueSnackbar } = useSnackbar()

  // ** State
  const [viewMode, setViewMode] = useState('email')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const {
    data: setUserForgotPasswordData,
    isLoading: setUserForgotPasswordLoading,
    isError: setUserForgotPasswordIsError,
    error: setUserForgotPasswordError,
    mutate: setUserForgotPassword
  } = useUserForgotPassword()

  const {
    data: setUserUpdateForgotPasswordData,
    isLoading: setUserUpdateForgotPasswordLoading,
    isError: setUserUpdateForgotPasswordIsError,
    error: setUserUpdateForgotPasswordError,
    mutate: setUserUpdateForgotPassword
  } = useUserUpdateForgotPassword()

  ///////// Formik Validation ////////
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .matches(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Invalid email'
        )
        .required('Required')
    }),
    onSubmit: values => {
      // Handle email submission
      setUserForgotPassword(values)
    }
  })

  const formikPassword = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required('Password is required')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~\-={}\\[\]:;"'<>,.?/]).{8,}$/,
          'Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character'
        )
        .test('no-spaces', 'Password cannot contain spaces', value => !/\s/.test(value)),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    }),
    onSubmit: values => {
      // Remove confirmPassword field from values
      const { confirmPassword, ...formValues } = values
      setUserUpdateForgotPassword({
        email: formik.values.email,
        newPassword: formValues.password
      })
    }
  })

  //////// Handle OTP ////////

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // Handle Confirm New Password
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  useEffect(() => {
    try {
      if (setUserForgotPasswordData && !setUserForgotPasswordLoading) {
        enqueueSnackbar(setUserForgotPasswordData?.message, { variant: 'success' })
        setViewMode('updatepassword')
      }
      if (setUserForgotPasswordIsError) {
        enqueueSnackbar(setUserForgotPasswordError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [setUserForgotPasswordData, setUserForgotPasswordLoading, setUserForgotPasswordIsError])

  useEffect(() => {
    try {
      if (setUserUpdateForgotPasswordData && !setUserUpdateForgotPasswordLoading) {
        enqueueSnackbar(setUserUpdateForgotPasswordData?.message, { variant: 'success' })
        router.push('/login')
      }
      if (setUserUpdateForgotPasswordIsError) {
        enqueueSnackbar(setUserUpdateForgotPasswordError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [setUserUpdateForgotPasswordData, setUserUpdateForgotPasswordLoading, setUserUpdateForgotPasswordIsError])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={logo} alt='logo' width={65} height={65} />

            <Typography
              variant='h5'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600
              }}
              color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          {viewMode === 'email' && (
            <>
              {/* Email Section */}
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  Forgot your password?
                </Typography>
              </Box>
              <form noValidate onSubmit={formik.handleSubmit}>
                <TextField
                  autoFocus
                  fullWidth
                  id='email'
                  name='email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  label='Email'
                  helperText={formik.touched.email && formik.errors.email}
                  error={formik.touched.email && formik.errors.email}
                  sx={{ marginBottom: 4 }}
                />

                <Button loading={setUserForgotPasswordLoading} fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} type='submit'>
                  Submit
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    New on our platform?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/register'>
                      <LinkStyled>Create an account</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
              </form>
            </>
          )}

          {viewMode === 'updatepassword' && (
            <>
              {/* OTP Section */}
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  {`Check your email ${formik.values.email} to update your password`}
                </Typography>
              </Box>
            </>
          )}

          {viewMode === 'changePassword' && (
            <>
              {/* Change Password Section */}
              <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                  Change your password
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={formikPassword.handleSubmit}>
                <Grid item xs={12} sx={{ marginTop: 6, marginBottom: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='account-settings-new-password'>Password</InputLabel>
                    <OutlinedInput
                      label='Password'
                      name='password'
                      value={formikPassword.values.password}
                      id='account-settings-new-password'
                      onChange={formikPassword.handleChange}
                      type={showPassword ? 'text' : 'password'}
                      error={formikPassword.touched.password && formikPassword.errors.password}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            aria-label='toggle password visibility'
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {formikPassword.touched.password && formikPassword.errors.password && (
                      <FormHelperText error id='accountId-error'>
                        {formikPassword.errors.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ marginBottom: 7 }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='account-settings-confirm-new-password'>Confirm Password</InputLabel>
                    <OutlinedInput
                      label='Confirm Password'
                      name='confirmPassword'
                      value={formikPassword.values.confirmPassword}
                      id='account-settings-confirm-new-password'
                      type={showConfirmPassword ? 'text' : 'password'}
                      onChange={formikPassword.handleChange}
                      error={formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            aria-label='toggle password visibility'
                            onClick={handleClickShowConfirmPassword}
                          >
                            {showConfirmPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {formikPassword.touched.confirmPassword && formikPassword.errors.confirmPassword && (
                      <FormHelperText error id='accountId-error'>
                        {formikPassword.errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} type='submit'>
                  Submit
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    New on our platform?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/register'>
                      <LinkStyled>Create an account</LinkStyled>
                    </Link>
                  </Typography>
                </Box>
              </form>
            </>
          )}
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
ForgotPasswordPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ForgotPasswordPage
