// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** Form validation import
import { useFormik } from 'formik'
import * as Yup from 'yup'

// ** MUI Components
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
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
import HelpIcon from '@mui/icons-material/Help'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, setAuthToken } from 'src/redux/reducers/authSlice'
import { userRole } from 'src/shared/utility/helpers'
import styles from '../../../styles/signIn.module.css'

// ** Demo Imports
import { LoadingButton } from '@mui/lab'
import { Button, FormHelperText, Tooltip } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useLogin, useUserMe } from 'src/shared/utility/services/hooks/register'
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
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : `rgba(231, 227, 252, 0.87)`
  }
}))

const LoginPage = () => {
  // ** State
  const [showPassword, setShowPassword] = useState(false)
  const [checkRememberMe, setCheckRememberMe] = useState(localStorage.getItem('checked') || false)
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)

  // ** Hook
  const theme = useTheme()
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  const rememberMe = () => {
    setCheckRememberMe(!checkRememberMe)
  }

  const setRemember = () => {
    if (checkRememberMe) {
      localStorage.setItem('email', formik?.values?.email)
      localStorage.setItem('password', formik?.values?.password)
      localStorage.setItem('checked', true)
    } else {
      localStorage.removeItem('email')
      localStorage.removeItem('password')
      localStorage.removeItem('checked')
    }
  }

  const formik = useFormik({
    initialValues: {
      email: localStorage.getItem('email') || '',
      password: localStorage.getItem('password') || ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Invalid email'
        )
        .required('Required'),
      password: Yup.string().required('Password is required')
    }),
    onSubmit: values => {
      setRemember()
      login(values)
    }
  })

  const {
    data: userMeData,
    isLoading: userMeLoading,
    isError: userMeIsError,
    error: userMeError,
    mutate: userMe
  } = useUserMe()

  useEffect(() => {
    localStorage.getItem('email')
  }, [])

  useEffect(() => {
    if (userMeData && !userMeLoading) {
      user.role === userRole.Admin ? router.push('/users') : router.push('/create-paper')
    }
    if (userMeIsError) {
      enqueueSnackbar(userMeError?.response?.data?.message ?? "Something went wrong", { variant: 'error' })
    }
  }, [userMeData, userMeLoading, userMeIsError])

  const {
    data: loginData,
    isLoading: loginLoading,
    isError: loginIsError,
    error: loginError,
    mutate: login
  } = useLogin()

  useEffect(() => {
    if (loginData && !loginLoading) {
      userMe()
      dispatch(setAuthToken(loginData?.data?.token))
      enqueueSnackbar(loginData?.message, { variant: 'success' })
    }
    if (loginIsError) {
      enqueueSnackbar(loginError?.response?.data?.message ?? 'Something went wrong', { variant: 'error' })
    }
  }, [loginData, loginLoading, loginIsError])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box className={styles.container}>
        <Box className={styles.containerCommonBlock}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                mb: 6,
                width: '100%',
                margin: '0px',
                display: 'flex',
                justifyContent: 'center',

                flexDirection: 'column'
              }}
            >
              <Card sx={{ zIndex: 1, display: 'contents', margin: '0xp' }}>
                <CardContent
                  direction='row'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '0xp',
                    width: '100%'
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      margin: '0px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      padding: '20px'
                    }}
                  >
                    <Image src={logo} alt='logo' width={75} height={75} />
                  </Box>
                  <Box>
                    <Typography
                      variant='h6'
                      sx={{
                        mb: 1.5,
                        fontWeight: 600,
                        fontSize: '1.625rem !important',
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center'
                      }}
                      color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
                    >
                      Welcome to JAS Research Portal
                    </Typography>
                    <Typography
                      variant='h8'
                      sx={{
                        fontWeight: 600,
                        marginBottom: 1.5,
                        display: 'flex',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '20px'
                      }}
                      color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
                    >
                      This Research Publications Portal, created by Jain Academy of Scholars, is to make available
                      recent research papers by scholars all over the world on selected topics on foundations of Jain
                      philosophy and to give visibility to research and study carried out by JAS Fellows. To start with,
                      papers published in National and International journals since the year 2000 and some important
                      earlier papers, synopsis of thesis, and preface of books on 20 topics (listed in the portal),
                      published by authors all over the world will be uploaded. Magazine articles and Newspaper clips
                      will not be included at present. Scholars are requested to submit pdf files which will be uploaded
                      after reviewing their relevance to JAS activities.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box gap={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box gap={5} sx={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
                <Card
                  sx={{
                    width: 'auto !important',
                    zIndex: 1,
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    margin: '0xp',
                    padding: '30px'
                  }}
                >
                  <CardContent
                    sx={{
                      padding: { md: theme => `${theme.spacing(12, 9, 7)} !important`, xs: '1rem' },
                      flexBasis: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      borderRight: { md: '1px solid', xs: 'none' },
                      borderBottom: { md: 'none', xs: '1px solid' }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        rowGap: '10px'
                      }}
                    >
                      <Typography variant='h6' sx={{ mr: 2, textAlign: 'center' }}>
                        As an external contributor, you can directly submit your publications here.
                        <Tooltip title='Published/Unpublished Research Paper, Thesis and Books are accepted'>
                          <HelpIcon fontSize='small' color='primary' sx={{ cursor: 'pointer' }} />
                        </Tooltip>
                      </Typography>
                      <Box>
                        <Button component={Link} href='/create-paper' variant='contained'>
                          Submit
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardContent sx={{ padding: '5% 10% !important', flexBasis: '50%' }}>
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                      <Typography
                        variant='h5'
                        sx={{ fontWeight: 600, marginBottom: 1.5 }}
                        color={theme.palette.mode === 'dark' ? `rgba(231, 227, 252, 0.87)` : theme.palette.primary.main}
                      >
                        Welcome to {themeConfig.templateName}👋🏻
                      </Typography>
                      <Typography variant='body2'>Please sign-in to your account</Typography>
                    </Box>
                    <form autoComplete='off' onSubmit={formik.handleSubmit}>
                      <TextField
                        fullWidth
                        sx={{ marginBottom: 4 }}
                        type='text'
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
                          value={formik.values.password}
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
                      <Box
                        sx={{
                          mb: 4,
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between'
                        }}
                      >
                        <FormControlLabel
                          checked={checkRememberMe}
                          control={<Checkbox />}
                          label='Remember Me'
                          onClick={() => rememberMe()}
                        />
                        <Link passHref href='/forgot-password'>
                          <LinkStyled>Forgot Password?</LinkStyled>
                        </Link>
                      </Box>
                      <LoadingButton
                        fullWidth
                        size='large'
                        type='submit'
                        variant='contained'
                        sx={{ marginBottom: 7 }}
                        loading={loginLoading}
                      >
                        Login
                      </LoadingButton>

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
                  </CardContent>
                </Card>
              </Box>
            </Box>

            <FooterIllustrationsV1 />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
