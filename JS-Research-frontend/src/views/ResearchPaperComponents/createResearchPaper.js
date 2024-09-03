import { Button, Card, CardContent, Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import { useFormik } from 'formik'
import { useSnackbar } from 'notistack'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined'
import { useEffect, useState } from 'react'
import { categories } from 'src/shared/utility/helpers'
import {
  useCreateResearchPaperData,
  useSendFileData,
  useSendFilePDF,
  useUpdateResearchPaper
} from 'src/shared/utility/services/hooks/researchPaper'
import * as Yup from 'yup'
import { useRouter } from 'next/router'

import BasicDetails from '../../components/create-paper/BasicDetails'
import AuthorsDetails from '../../components/create-paper/AuthorsDetails'
import FileComponent from '../../components/create-paper/FileComponent'
import { selectUser } from 'src/redux/reducers/authSlice'
import { useSelector } from 'react-redux'

const CreateResearchPaper = () => {
  const [activeIndex, setActiveIndex] = useState(1)
  const [inputJournalName, setInputJournalName] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState([])
  const [inputKeyword, setInputKeyword] = useState('')
  const [inputISSN, setInputISSN] = useState('')
  const [fileUUID, setFileUUID] = useState([])
  const [inputAuthors, setInputAuthors] = useState('')
  const [inputOfficialUrl, setInputOfficialUrl] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const theme = useTheme()
  const router = useRouter()
  const user = useSelector(selectUser)

  const formik = useFormik({
    initialValues: {
      title: '',
      synopsis: '',
      authors: [],
      keywords: [],
      language: '',
      doi: '',
      itemType: '',
      journalName: [],
      issn: [],
      mainCategories: [],
      isbn: '',
      subCategories: [],
      yearOfPublication: '',
      contactNumber: '',
      email: '',
      files: [],
      officialUrl: []
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Title is required'),
      synopsis: Yup.string().required('Synopsis is required'),
      doi: Yup.string().optional(),
      itemType: Yup.string().required('ItemType is required'),
      journalName: Yup.array().optional(),
      issn: Yup.array()
        .of(Yup.string().matches(/^\d{4}-\d{4}$/, 'ISSN must be a valid 4-4 digit number'))
        .test('unique-issn', 'ISSN must be unique', function (value) {
          return new Set(value).size === value?.length
        })
        .nullable(),
      officialUrl: Yup.array()
        .of(
          Yup.string().matches(
            '^(https?:\\/\\/)?' + // protocol
              '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
              '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
              '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
              '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
              '(\\#[-a-z\\d_]*)?$',
            'Official Url must be a valid URL'
          )
        )
        .optional(),
      authors: Yup.array()
        .of(Yup.string().matches(/^[a-zA-Z\s.]*$/, 'Author name must contain only letters, spaces, and periods'))
        .min(1, 'Minimum 1 value for authors is required')
        .test('unique-authors', 'Authors must be unique', function (value) {
          return new Set(value).size === value.length
        })
        .required('Required'),
      keywords: Yup.array()
        .min(1, 'Minimum 1 value for keywords is required')
        .test('unique-keywords', 'Keywords must be unique', function (value) {
          return new Set(value).size === value.length
        })
        .required('Required'),
      mainCategories: Yup.array().min(1, 'Minimum 1 maincategory is value required').required('Required'),
      subCategories: Yup.array().optional(),
      yearOfPublication: Yup.string()
        .matches(/^[1-9]\d{3}$/, 'Year of publication must be a valid 4-digit year not starting with zero')
        .test('is-not-0000', 'Year of publication cannot be 0000', value => value !== '0000')
        .test(
          'is-not-future-year',
          'Year of publication cannot be in the future',
          value => value && parseInt(value, 10) <= currentYear
        )
        .required('Year of publication is required'),
      language: Yup.string().required('Language is required'),
      contactNumber: Yup.string()
        .matches(/^\+?\d{1,12}$/, 'Invalid contact number')
        .required('Contact Number is required'),
      email: Yup.string()
        .matches(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Invalid email'
        )
        .required('Email is required'),
      files: activeIndex === 1 ? Yup.array().min(1, 'Required') : Yup.array().optional(),
      isbn: Yup.string()
        .optional()
        .matches(/^[\d-]+$/, 'ISBN must contain only numeric characters and dashes')
    }),
    onSubmit: async values => {
      // Clean up values before submission
      values.journalName = values.journalName.map(value => value.replace(/\s+/g, ' ').trim())
      values.issn = values.issn.map(value => value.replace(/\s+/g, ' ').trim())
      values.officialUrl = values.officialUrl.map(value => value.replace(/\s+/g, ' ').trim())
      values.authors = values.authors.map(value => value.replace(/\s+/g, ' ').trim())
      values.keywords = values.keywords.map(value => value.replace(/\s+/g, ' ').trim())
      values.doi = values.doi.replace(/\s+/g, ' ').trim()
      values.isbn = values.isbn.replace(/\s+/g, ' ').trim()
      values.title = values.title.replace(/\s+/g, ' ').trim()
      values.synopsis = values.synopsis.replace(/\s+/g, ' ').trim()
      values.yearOfPublication = values.yearOfPublication.replace(/\s+/g, ' ').trim()

      try {
        // Create research paper data
        let v = { ...values }
        delete v.files
        await createResearchPaperMutate(v)

        // Handle file submission if files are provided
        if (values?.files?.length > 0) {
          const fileUUIDs = await Promise.all(
            values?.files?.map(async file => {
              const response1 = await submitFileMutate({
                action: 'upload',
                file_name: file?.name || 'Untitled',
                file_category: 'PDF'
              })

              // Construct FormData for file upload
              const newFormData = new FormData()
              newFormData.append('key', response1.data.fields.key)
              newFormData.append('policy', response1.data.fields.Policy)
              newFormData.append('x-amz-algorithm', response1.data.fields['X-Amz-Algorithm'])
              newFormData.append('x-amz-credential', response1.data.fields['X-Amz-Credential'])
              newFormData.append('x-amz-date', response1.data.fields['X-Amz-Date'])
              newFormData.append('x-amz-signature', response1.data.fields['X-Amz-Signature'])
              newFormData.append('bucket', response1.data.fields.bucket)
              newFormData.append('file', file)

              const payloadData = {
                formData: newFormData,
                url: response1.data.url
              }

              // Upload file
              await createResearchPaperMutate1(payloadData)

              // Return converted filename
              return convertFilename(response1.data.fields.key)
            })
          )

          // Set file UUIDs after upload
          setFileUUID(fileUUIDs)
        } else {
          // Notify success and navigate
          enqueueSnackbar('Research Paper Created Successfully', { variant: 'success' })
          router.push('/research-paper')
        }
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
  })

  const handleOnClick = index => {
    setActiveIndex(index)
  }

  const handleAuthors = (formik, newValue) => {
    const trimmedValue = newValue.trim()
    if (trimmedValue !== '') {
      formik.setFieldValue('authors', [...formik.values.authors, trimmedValue])
      setInputAuthors('')
    }
  }

  const handleKeywords = (formik, newValue) => {
    const trimmedValue = newValue.trim()

    if (trimmedValue !== '') {
      formik.setFieldValue('keywords', [...formik.values.keywords, trimmedValue])
      setInputKeyword('')
    }
  }

  const handleOfficialUrl = (formik, newValue) => {
    const trimmedValue = newValue.trim()
    if (trimmedValue !== '') {
      formik.setFieldValue('officialUrl', [...formik.values.officialUrl, trimmedValue])
      setInputOfficialUrl('')
    }
  }

  const handlejournalName = (formik, newValue) => {
    const trimmedValue = newValue.trim()
    if (trimmedValue !== '') {
      formik.setFieldValue('journalName', [...formik.values.journalName, trimmedValue])
      setInputJournalName('')
    }
  }

  const {
    data: createResearchPaperData,
    isLoading: createResearchPaperLoading,
    error: createResearchPaperError,
    isError: createResearchPaperIsError,
    mutateAsync: createResearchPaperMutate
  } = useCreateResearchPaperData()

  useEffect(() => {
    if (createResearchPaperData && !createResearchPaperLoading) {
      console.log({ createResearchPaperData })
    }
    if (createResearchPaperIsError && createResearchPaperError) {
      enqueueSnackbar('Something went wrong. Please try again', {
        variant: 'error'
      })
    }
  }, [createResearchPaperData, createResearchPaperLoading, createResearchPaperIsError, createResearchPaperError])

  const {
    data: createResearchPaperData1,
    isLoading: createResearchPaperLoading1,
    mutate: createResearchPaperMutate1
  } = useSendFilePDF()

  const { mutateAsync: submitFileMutate } = useSendFileData()

  useEffect(() => {
    if (createResearchPaperData1) {
      enqueueSnackbar('File submitted successfully', {
        variant: 'success'
      })
      router.push('/research-paper')
    }
  }, [createResearchPaperData1, enqueueSnackbar, router])

  const formatISSN = value => {
    // Remove non-digit characters from the value
    const cleanedValue = value.replace(/\D/g, '')

    // Insert hyphen after the fourth digit
    let formattedValue = ''
    for (let i = 0; i < cleanedValue.length; i++) {
      formattedValue += cleanedValue[i]
      if (i === 3) {
        formattedValue += '-'
      }
    }

    return formattedValue
  }

  const currentYear = new Date().getFullYear()

  const handleOnChangeMainCategory = (e, value) => {
    setSelectedMainCategory(value)
  }

  const handleISSN = (formik, newValue) => {
    const trimmedValue = newValue.trim()
    if (trimmedValue !== '') {
      formik.setFieldValue('issn', [...formik.values.issn, trimmedValue])
      setInputISSN('')
    }
  }

  const { mutate: updateResearchPaperMutate } = useUpdateResearchPaper()

  // Concatenate all subcategories of selected main categories
  const allValues = selectedMainCategory.reduce((acc, category) => {
    return acc.concat(categories[category] || [])
  }, [])

  // Extract filename from the file path
  function convertFilename(filePath) {
    const match = filePath.match(/([^/]+)(?=\.\w+$)/)

    return match ? match[0] : null
  }

  useEffect(() => {
    // Update file UUIDs for the last submitted research paper
    if (fileUUID.length > 0) {
      const lastResponse = createResearchPaperData
      updateResearchPaperMutate({ id: lastResponse.data._id, data: { files: fileUUID } })
    }
  }, [fileUUID, createResearchPaperData, updateResearchPaperMutate])

  return (
    <Card sx={{ marginBottom: '30px' }}>
      {!user && (
        <Button
          variant='contained'
          color='primary'
          sx={{ margin: '30px 0px 0px 30px' }}
          onClick={() => router.push('/login')}
        >
          <KeyboardBackspaceOutlinedIcon />
          Back
        </Button>
      )}
      <CardContent sx={{ padding: user && user.role ? '5% 5% 0% 5%' : '2% 5% 0% 5%' }}>
        <Typography
          sx={{ paddingBottom: '30px', fontWeight: 600, fontSize: '26px' }}
          color={theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main}
        >
          Research Paper/Thesis/Book Submit Form
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          {/* Basic details section */}
          <BasicDetails
            formik={formik}
            allValues={allValues}
            inputKeyword={inputKeyword}
            handleKeywords={handleKeywords}
            setInputAuthors={setInputAuthors}
            inputAuthors={inputAuthors}
            setInputKeyword={setInputKeyword}
            handleAuthors={handleAuthors}
            handleOnChangeMainCategory={handleOnChangeMainCategory}
          />
          <Divider sx={{ marginTop: '25px' }} />

          {/* Authors details section */}
          <AuthorsDetails
            formik={formik}
            handleISSN={handleISSN}
            inputISSN={inputISSN}
            handlejournalName={handlejournalName}
            inputJournalName={inputJournalName}
            inputOfficialUrl={inputOfficialUrl}
            setInputOfficialUrl={setInputOfficialUrl}
            setInputJournalName={setInputJournalName}
            setInputISSN={setInputISSN}
            formatISSN={formatISSN}
            handleOfficialUrl={handleOfficialUrl}
          />

          <Divider sx={{ marginTop: '25px' }} />

          {/* File upload component */}
          <FileComponent
            formik={formik}
            setFileUUID={setFileUUID}
            createResearchPaperLoading1={createResearchPaperLoading1}
            activeIndex={activeIndex}
            handleOnClick={handleOnClick}
          />
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateResearchPaper
