import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useResearchPaperById, useResearchPaperPDF } from 'src/shared/utility/services/hooks/researchPaper'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Link } from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import BasicTable from './paperInfoTable'
import { enqueueSnackbar } from 'notistack'
import PdfDialog from './PdfDialog'

function ResearchPaperById() {
  const router = useRouter()
  const id = router.query.id
  const [uuId, setUUID] = useState([])
  const [access, setAccess] = useState(false)
  const [base64Pdf, setBase64Pdf] = useState('')
  const [sendUUID, setSendUUID] = useState('')
  const [getData, setGetData] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const date1 = new Date(getData?.createdAt)

  const options1 = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }
  const formattedDate = date1.toLocaleString('en-US', options1)

  const {
    data: getResearchPaperDataById,
    isLoading: getResearchPaperDataByIdLoading,
    isError: getResearchPaperByIdIsError,
    mutate: getResearchPaperMutate
  } = useResearchPaperById()

  const {
    data: getResearchPaperPDFData,
    isLoading: getResearchPaperPDFLoading,
    isError: getResearchPaperPDFIsError,
    error: getResearchPaperPDFError,
    mutate: getResearchPaperPDFMutate
  } = useResearchPaperPDF()

  useEffect(() => {
    const loadPdf = async () => {
      try {
        if (getResearchPaperPDFData && !getResearchPaperPDFLoading) {
          const pdfUrl = getResearchPaperPDFData?.link?.url

          setBase64Pdf(pdfUrl)
          setDialogOpen(true)
        }
        if (getResearchPaperPDFIsError) {
          enqueueSnackbar(getResearchPaperPDFError?.response?.data?.message, { variant: 'error' })
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadPdf()
  }, [getResearchPaperPDFData, getResearchPaperPDFLoading, getResearchPaperPDFIsError])

  useEffect(() => {
    if (id) {
      getResearchPaperMutate({ id })
    }
  }, [id])

  useEffect(() => {
    if (getResearchPaperDataById && !getResearchPaperDataByIdLoading) {
      setAccess(true)
      setGetData(getResearchPaperDataById?.paper)
      setUUID(getResearchPaperDataById?.paper?.files)
    }
    if (getResearchPaperByIdIsError) {
      router.push('/404')
    }
  }, [getResearchPaperByIdIsError, getResearchPaperDataById, getResearchPaperDataByIdLoading])

  const handleBack = () => {
    router.push('/research-paper')
  }

  const HandlePDF = id => {
    setSendUUID(id)
    setDialogOpen(false)
    getResearchPaperPDFMutate({ id })
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSendUUID('')
  }

  return (
    access && (
      <>
        <Card>
          <CardContent
            sx={{
              padding: theme => `${theme.spacing(3.25, 5.75, 6.25)} !important`
            }}
          >
            <Grid
              container
              sx={{
                justifyContent: 'space-between',
                width: '95%',
                alignItems: 'center',
                margin: '10px auto 40px auto'
              }}
            >
              <Typography sx={{ fontWeight: 600 }} variant='h6'>
                {getData?.title}
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>{formattedDate}</Typography>
            </Grid>
            <Grid container alignItems={'center'} sx={{ justifyContent: 'center' }} direction={'row'} gap={5} mt={5}>
              <Grid container sx={{ justifyContent: 'center' }}>
                {getData?.authors?.map((author, index) => (
                  <Typography key={index}>{author}; </Typography>
                ))}
                {getData?.mainCategories?.map((mainCategories, index) => (
                  <Typography key={index}>{mainCategories}; </Typography>
                ))}
                {getData?.subCategories?.map((subCategories, index) => (
                  <Typography key={index}>{subCategories}; </Typography>
                ))}
                issn:
                {getData?.issn?.length > 0
                  ? getData?.issn?.map((issn, index) => <Typography key={index}>{issn}, </Typography>)
                  : 'N/A,'}
                isbn: 
                {getData?.isbn?.length > 0
                  ? getData?.isbn?.map((issn, index) => <Typography key={index}>{isbn}, </Typography>)
                  : 'N/A,'}
                <Typography>{getData?.DOI}</Typography>
                <Typography sx={{ textAlign: 'center', width: '100%' }}>
                  Full text not available from this repository. Kindly check Official URL:
                  <br />
                  <Grid container sx={{ justifyContent: 'center' }}>
                    <span>
                      <Link
                        href={getData?.officialUrl}
                        target='_blank'
                        sx={{
                          color: 'info.main',
                          display: 'flex',
                          justifyContent: 'center',
                          textAlign: 'center',
                          width: '100%',
                          maxWidth: '100%',
                          flexWrap: 'wrap',
                          '@media (max-width: 600px)': {
                            fontSize: '0.9rem'
                          }
                        }}
                      >
                        {getData?.officialUrl?.map((url, index) => url + ',')}
                      </Link>
                    </span>
                  </Grid>
                </Typography>
              </Grid>
              {uuId?.length > 0 &&
                uuId?.map((uuid, index) => (
                  <Grid key={index}>
                    <Grid container sx={{ justifyContent: 'center', mt: 2, alignItems: 'center' }}>
                      <Button color='error' sx={{ height: '100%' }}>
                        <PictureAsPdfIcon sx={{ fontSize: '8rem' }} />
                      </Button>
                      <Button
                        color='info'
                        sx={{
                          height: '100%',
                          fontSize: '1.5rem',
                          '&:hover': { color: 'info.dark', backgroundColor: 'transparent' },
                          textTransform: 'none'
                        }}
                        onClick={() => HandlePDF(uuid)}
                      >
                        Click to View {index + 1} PDF
                      </Button>
                    </Grid>
                  </Grid>
                ))}

              {base64Pdf && <PdfDialog open={dialogOpen} handleClose={handleDialogClose} PDFURL={base64Pdf} />}
            </Grid>

            <Divider sx={{ marginTop: '2rem', marginBottom: '2rem' }} />

            <Grid container alignItems={'center'} sx={{ justifyContent: 'center', flexDirection: 'column' }} gap={5}>
              <Typography variant='h6' fontWeight={'bold'}>
                Abstract Of The Article
              </Typography>
              <Typography sx={{ textAlign: 'center' }}>{getData?.synopsis}</Typography>

              <BasicTable data={getData} />
            </Grid>
            <Grid sx={{ paddingTop: '20px' }}>
              <Button
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  backgroundColor: '#036A85',
                  color: 'white',
                  '&:hover': { backgroundColor: '#036A85' },
                  gap: '5px',
                  lineHeight: '0',
                  margin: ' 0 0 0 5px'
                }}
                onClick={handleBack}
              >
                <KeyboardBackspaceOutlinedIcon />
                Back
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </>
    )
  )
}

export default ResearchPaperById
