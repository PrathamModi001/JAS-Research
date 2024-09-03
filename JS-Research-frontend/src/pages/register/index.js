// ** React Imports
import { useFormik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import { LoadingButton } from '@mui/lab'
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Icons Imports
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import logo from 'public/images/logos/image-3.svg'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { FormHelperText } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useSignup, useVerifyEmail } from 'src/shared/utility/services/hooks/register'
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

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  // ** States
  const inputRefs = useRef([])
  const [showPassword, setShowPassword] = useState(false)
  const [viewMode, setViewMode] = useState('signup') // ['signup','otp'
  const { enqueueSnackbar } = useSnackbar()
  const [otp, setOtp] = useState('')
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ** Hook
  const theme = useTheme()

  // navigate
  const router = useRouter()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const {
    data: signupData,
    isLoading: signupLoading,
    isError: signupIsError,
    error: signupError,
    mutate: signup
  } = useSignup()

  useEffect(() => {
    try {
      if (signupData && !signupLoading) {
        enqueueSnackbar(signupData?.message, { variant: 'success' })
        setViewMode('otp')
      }
      if (signupIsError) {
        enqueueSnackbar(signupError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signupData, signupLoading, signupIsError])

  const {
    data: verifyEmailData,
    isLoading: verifyEmailLoading,
    isError: verifyEmailIsError,
    error: verifyEmailError,
    mutate: verifyEmail
  } = useVerifyEmail()

  useEffect(() => {
    try {
      if (verifyEmailData && !verifyEmailLoading) {
        enqueueSnackbar(verifyEmailData?.message, { variant: 'success' })
        router.push('/')
      }
      if (verifyEmailIsError) {
        enqueueSnackbar(verifyEmailError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifyEmailData, verifyEmailLoading, verifyEmailIsError])

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'User',
      password: '',
      confirm_password: ''
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .matches(/^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/, 'Invalid first name')
        .required('First Name Required'),
      lastName: Yup.string()
        .matches(/^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/, 'Invalid last name')
        .required('Last Name Required'),
      email: Yup.string()
        .matches(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Invalid email'
        )
        .required('Required'),
      password: Yup.string()
        .required('Password is required')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+|~\-={}\\[\]:;"'<>,.?/]).{8,}$/,
          'Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character'
        )
        .test('no-spaces', 'Password cannot contain spaces', value => !/\s/.test(value)),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password')
    }),
    onSubmit: values => {
      signup(values)
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
    const otpString = otpArray.join('')
    setOtp(otpString)
  }

  const handleSubmitOtp = () => {
    // Handle OTP submission
    if (otp.length === 6) {
      // Proceed to the next step (change password)
      verifyEmail({
        email: formik.values.email,
        otp: parseInt(otp)
      })
    }
  }

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
              color={theme.palette.mode === 'light' ? theme.palette.primary.main : 'rgba(231, 227, 252)'}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Create an Account 🚀
            </Typography>
            <Typography variant='body2'>Exchange of ideas related to Jain Philosophy</Typography>
          </Box>
          {viewMode === 'signup' && (
            <form autoComplete='off' onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                sx={{ marginBottom: 4 }}
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
              <TextField
                fullWidth
                sx={{ marginBottom: 4 }}
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

              <TextField
                fullWidth
                sx={{ marginBottom: 4 }}
                type='email'
                label='Email'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                helperText={formik.touched.email && formik.errors.email && formik.errors.email}
                error={formik.touched.email && formik.errors.email}
              />
              <FormControl fullWidth sx={{ marginBottom: 4 }}>
                <InputLabel htmlFor='auth-register-password'>Password</InputLabel>
                <OutlinedInput
                  label='Password'
                  id='auth-register-password'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formik.values.password.trim()}
                  onChange={formik.handleChange}
                  error={formik.touched.password && formik.errors.password}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {showPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText error id='accountId-error'>
                    {formik.errors.password}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth sx={{ marginBottom: 4 }}>
                <InputLabel htmlFor='auth-register-confirm_password'>Confirm Password</InputLabel>
                <OutlinedInput
                  label='Confirm Password'
                  id='auth-register-confirm_password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirm_password'
                  value={formik.values.confirm_password}
                  onChange={formik.handleChange}
                  error={formik.touched.confirm_password && formik.errors.confirm_password}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        aria-label='toggle password visibility'
                      >
                        {showConfirmPassword ? <EyeOutline fontSize='small' /> : <EyeOffOutline fontSize='small' />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {formik.touched.confirm_password && formik.errors.confirm_password && (
                  <FormHelperText error id='accountId-error'>
                    {formik.errors.confirm_password}
                  </FormHelperText>
                )}
              </FormControl>
              <LoadingButton
                fullWidth
                size='large'
                type='submit'
                variant='contained'
                sx={{ marginBottom: 7 }}
                loading={signupLoading}
              >
                Sign up
              </LoadingButton>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ marginRight: 2 }}>
                  Already have an account?
                </Typography>
                <Typography variant='body2'>
                  <Link passHref href='/'>
                    <LinkStyled>Sign in instead</LinkStyled>
                  </Link>
                </Typography>
              </Box>
            </form>
          )}
          {viewMode === 'otp' && (
            <form autoComplete='off'>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 4,
                  gap: 2
                }}
              >
                {Array.from({ length: 6 }, (_, index) => (
                  <TextField
                    key={index}
                    inputRef={el => (inputRefs.current[index] = el)}
                    type='text'
                    variant='outlined'
                    value={otp[index] || ''}
                    onChange={handleOtpInputChange(index)}
                    onPaste={handlePaste}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center'
                      }
                    }}
                    sx={{ flex: 1 }}
                  />
                ))}
              </Box>

              <LoadingButton
                fullWidth
                size='large'
                onClick={handleSubmitOtp}
                variant='contained'
                sx={{ marginBottom: 7 }}
                loading={verifyEmailLoading}
              >
                Verify Email
              </LoadingButton>
            </form>
          )}
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
