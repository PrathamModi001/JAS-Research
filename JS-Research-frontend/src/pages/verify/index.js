// ** React Imports
import { useEffect, useRef, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** form validation import

// ** MUI Components
import Box from '@mui/material/Box'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icons Imports
import logo from 'public/images/logos/image-3.svg'
import CheckIcon from '@mui/icons-material/Check'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import { useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { useVerifyChangeEmail } from 'src/shared/utility/services/hooks/register'
import Image from 'next/image'
import { useDebouncedCallback } from 'use-debounce'
import { Fab } from '@mui/material'
import { green } from '@mui/material/colors'
import { setAuthToken } from 'src/redux/reducers/authSlice'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const VerifyPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const pathUrl = router.asPath
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const timer = useRef()
  const [authToken, setAuthTokens] = useState(useSelector(setAuthToken))
  const { enqueueSnackbar } = useSnackbar()

  // ** Cleanup timer

  useEffect(() => {
    if (pathUrl) {
      const splitUrl = pathUrl.split('?')
      if (splitUrl.length > 1) {
        dispatch(setAuthToken(splitUrl?.[1].slice(0, -1)))
      } else {
        enqueueSnackbar('No Token Found..!', { variant: 'error' })
        router.push('/login')
      }
    }
  }, [])

  // ** Debounced callback for redirection and success message
  const debouncedFetchData = useDebouncedCallback(value => {
    setSuccess(true)
    setLoading(false)
    timer.current = setTimeout(() => {
      router.push('/login')
    }, 2000)
    enqueueSnackbar(value?.message, { variant: 'success' })

    return () => clearTimeout(timer.current)
  }, 5000)

  // ** Hook to verify email change
  const {
    data: verifyChangeEmailData,
    isLoading: verifyChangeEmailLoading,
    isError: verifyChangeEmailIsError,
    error: verifyChangeEmailError,
    mutate: verifyChangeEmail
  } = useVerifyChangeEmail()

  // ** Trigger email verification
  useEffect(() => {
    if (authToken) {
      verifyChangeEmail()
    }
  }, [authToken])

  // ** Handle verification result
  useEffect(() => {
    try {
      if (verifyChangeEmailData && !verifyChangeEmailLoading) {
        debouncedFetchData(verifyChangeEmailData)
      }
      if (verifyChangeEmailIsError) {
        enqueueSnackbar(verifyChangeEmailError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.log('err', err)
    }
  }, [verifyChangeEmailData, verifyChangeEmailLoading, verifyChangeEmailIsError])

  // ** Styling for success button
  const buttonSx = {
    ...(!success && { bgcolor: 'transparent' }),
    ...(success && {
      bgcolor: green['500'],
      '&:hover': {
        bgcolor: green['500']
      }
    })
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
              color='text.primary'
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                sx={{
                  m: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <Fab aria-label='email' sx={buttonSx}>
                  {success ? (
                    <CheckIcon sx={{ color: 'common.white' }} />
                  ) : (
                    <CircularProgress
                      size={68}
                      sx={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1
                      }}
                    />
                  )}
                </Fab>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

// ** Specify layout for the page
VerifyPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default VerifyPage
