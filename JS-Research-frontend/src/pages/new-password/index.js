// ** React Imports
import { useEffect, useRef, useState } from 'react'

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
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import {
  useUserForgotPassword,
  useUserUpdateForgotPassword,
  useUserVerifyOtp
} from 'src/shared/utility/services/hooks/register'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Icons Imports
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import { useDispatch } from 'react-redux'
import logo from 'public/images/logos/image-3.svg'
import { useSelector } from 'react-redux'

// ** Demo Imports
import { useSnackbar } from 'notistack'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { setAuthToken } from 'src/redux/reducers/authSlice'
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

const NewPassword = () => {
  const inputRefs = useRef([])
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const selctor = useSelector(state => state)

  // ** State
  const [viewMode, setViewMode] = useState('email')
  const [otp, setOtp] = useState('')
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
    data: setUserVerifyOtpData,
    isLoading: setUserVerifyOtpLoading,
    isError: setUserVerifyOtpIsError,
    error: setUserVerifyOtpError,
    mutate: setUserVerifyOtp
  } = useUserVerifyOtp()

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
      email: '' // Add email field
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Email is required')
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
        ),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
    }),
    onSubmit: values => {
      // Remove confirmPassword field from values
      const { confirmPassword, ...formValues } = values
      setUserUpdateForgotPassword({
        password: formValues.password
      })
    }
  })

  //////// Handle OTP ////////
  const handleOtpInputChange = index => e => {
    const value = e.target.value

    // Allow only numbers
    if (!/^[0-9]*$/.test(value)) return

    // Handle backspace key press
    if (e.nativeEvent.inputType === 'deleteContentBackward' && index > 0 && !value) {
      // Focus the previous input field
      inputRefs.current[index - 1].focus()

      return
    }

    setOtp(prevOtp => {
      const newOtp = [...prevOtp]
      newOtp[index] = value

      return newOtp.join('') // Join the array elements into a single string
    })

    if (value && index < inputRefs.current.length - 1) {
      // Focus the next input field
      inputRefs.current[index + 1].focus()
    }
  }

  const handlePaste = e => {
    e.preventDefault()
    const clipboardData = e.clipboardData.getData('text/plain').trim()
    const otpArray = clipboardData.split('').slice(0, 6)
    setOtp(otpArray)
  }

  const handleSubmitOtp = () => {
    // Handle OTP submission
    if (otp.length === 6) {
      // Proceed to the next step (change password)
      setUserVerifyOtp({
        email: formik.values.email,
        otp: parseInt(otp.join(''))
      })
    }
  }

  // Handle New Password
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
        setViewMode('otp')
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
      if (setUserVerifyOtpData && !setUserVerifyOtpLoading) {
        enqueueSnackbar(setUserVerifyOtpData?.message, { variant: 'success' })
        setViewMode('changePassword')
      }
      if (setUserVerifyOtpIsError) {
        enqueueSnackbar(setUserVerifyOtpError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [setUserVerifyOtpData, setUserVerifyOtpLoading, setUserVerifyOtpIsError])

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

  useEffect(() => {
    try {
      const url = window.location.href
      const parts = url.split('?')[1]
      const token = parts?.split('=')[0]

      if (token) {
        dispatch(setAuthToken(token))
      }
    } catch (err) {
      err
    }
  }, [])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={logo} alt='logo' width={65} height={65} />
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
              color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>

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
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
NewPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default NewPassword
