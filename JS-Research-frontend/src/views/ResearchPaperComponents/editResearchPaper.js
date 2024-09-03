import { Card, CardContent, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { categories } from 'src/shared/utility/helpers'
import { useFormik } from 'formik'
import Divider from '@mui/material/Divider'
import * as Yup from 'yup'
import {
  useDeleteResearchPaper,
  useResearchPaperById,
  useUpdateResearchPaper,
  useUpdateResearchPaperFile
} from 'src/shared/utility/services/hooks/researchPaper'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'

import BasicDetails from 'src/components/create-paper/BasicDetails'
import AuthorsDetails from 'src/components/create-paper/AuthorsDetails'
import Editfile from 'src/components/edit-paper/edit-file'

const EditResearchPaper = () => {
  const router = useRouter()
  const id = router.query.id
  const [activeIndex, setActiveIndex] = useState(1)
  const [inputJournalName, setInputJournalName] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState([])
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)
  const [files, setFiles] = useState([])
  const [inputKeyword, setInputKeyword] = useState('')
  const [Filelength, setFilelength] = useState(0)
  const [inputAuthors, setInputAuthors] = useState('')
  const [inputISSN, setInputISSN] = useState('')

  const [researchPaperData, setResearchPaperData] = useState()
  const [inputOfficialUrl, setInputOfficialUrl] = useState('')
  const [filesUpdate, setfilesUpdate] = useState('')

  const {
    data: getResearchPaperDataById,
    isLoading: getResearchPaperDataByIdLoading,
    isError: getResearchPaperByIpdIsError,
    error: getResearchPaperByIdError,
    mutate: getResearchPaperMutate
  } = useResearchPaperById()

  const {
    data: deleteResearchPaperData,
    isLoading: deleteResearchPaperDataLoading,
    isError: deleteResearchPaperIsError,
    error: deleteResearchPaperError,
    mutate: deleteResearchPaperMutate
  } = useDeleteResearchPaper()

  const {
    data: updateResearchPaperFileData,
    isLoading: updateResearchPaperFileDataLoading,
    isError: updateResearchPaperFileIsError,
    error: updateResearchPaperFileError,
    mutate: updateResearchPapeFilerMutate
  } = useUpdateResearchPaperFile()

  useEffect(() => {
    try {
      if (deleteResearchPaperData && !deleteResearchPaperDataLoading) {
        enqueueSnackbar(deleteResearchPaperData?.message, { variant: 'success' })
        getResearchPaperMutate({ id })
      }
      if (deleteResearchPaperIsError) {
        enqueueSnackbar(deleteResearchPaperError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [deleteResearchPaperData, deleteResearchPaperDataLoading, deleteResearchPaperIsError, deleteResearchPaperError])

  useEffect(() => {
    try {
      if (updateResearchPaperFileData && !updateResearchPaperFileDataLoading) {
        enqueueSnackbar(updateResearchPaperFileData?.message, { variant: 'success' })
        getResearchPaperMutate({ id })
        handleClose()
      }
      if (updateResearchPaperFileIsError) {
        enqueueSnackbar(updateResearchPaperFileError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [
    updateResearchPaperFileData,
    updateResearchPaperFileDataLoading,
    updateResearchPaperFileIsError,
    updateResearchPaperFileError,
    getResearchPaperMutate
  ])

  const theme = useTheme()

  useEffect(() => {
    if (id) {
      getResearchPaperMutate({ id })
    }
  }, [id])

  const handleOfficialUrl = (formik, newValue) => {
    const trimmedValue = newValue.trim()
    if (trimmedValue !== '') {
      formik.setFieldValue('officialUrl', [...formik.values.officialUrl, trimmedValue])
      setInputOfficialUrl('')
    }
  }

  useEffect(() => {
    if (filesUpdate) {
      deleteResearchPaperMutate({ uuid: filesUpdate })
    }
  }, [filesUpdate])

  useEffect(() => {
    try {
      if (getResearchPaperDataById && !getResearchPaperDataByIdLoading) {
        setResearchPaperData(getResearchPaperDataById?.paper)

        setFilelength(getResearchPaperDataById?.paper?.files?.length)
        setFiles(getResearchPaperDataById?.paper?.files)
      }
      if (getResearchPaperByIpdIsError) {
        enqueueSnackbar(getResearchPaperByIdError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error('err', err)
    }
  }, [getResearchPaperDataById, getResearchPaperDataByIdLoading, getResearchPaperByIdError])

  const {
    data: updateResearchPaperData,
    isLoading: updateResearchPaperDataLoading,
    isError: updateResearchPaperIsError,
    error: updateResearchPaperError,
    mutate: updateResearchPaperMutate
  } = useUpdateResearchPaper()

  useEffect(() => {
    try {
      if (updateResearchPaperData && !updateResearchPaperDataLoading) {
        enqueueSnackbar(updateResearchPaperData?.message, { variant: 'success' })
        router.push('/research-paper')
        getResearchPaperMutate()
      }
      if (updateResearchPaperIsError) {
        enqueueSnackbar(updateResearchPaperError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [updateResearchPaperData, updateResearchPaperDataLoading, updateResearchPaperIsError])

  useEffect(() => {
    if (researchPaperData) {
      formik.setValues({
        title: researchPaperData?.title || '',
        synopsis: researchPaperData?.synopsis || '',
        authors: researchPaperData?.authors || [],
        keywords: researchPaperData?.keywords || [],
        language: researchPaperData?.language || '',
        isbn: researchPaperData?.isbn || '',
        journalName:
          researchPaperData?.journalName?.length === 1 && researchPaperData?.journalName[0] === ''
            ? []
            : researchPaperData?.journalName || '',
        issn:
          researchPaperData?.issn?.length === 1 && researchPaperData?.issn[0] === ''
            ? []
            : researchPaperData?.issn || [],
        doi: researchPaperData?.doi || '',
        itemType: researchPaperData?.itemType || '',
        officialUrl:
          researchPaperData?.officialUrl?.length === 1 && researchPaperData?.officialUrl[0] === ''
            ? []
            : researchPaperData?.officialUrl || [],
        mainCategories: researchPaperData?.mainCategories || [],
        subCategories: researchPaperData?.subCategories || [],
        yearOfPublication: researchPaperData?.yearOfPublication || '',
        contactNumber: researchPaperData?.contactNumber || '',
        email: researchPaperData?.email || '',
        files: researchPaperData?.files || []
      })
    }
  }, [researchPaperData])

  const { enqueueSnackbar } = useSnackbar()

  const currentYear = new Date().getFullYear()

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

  const handleAddNewFile = event => {
    if (event.target.files.length > 0) {
      const maxFileSize = 25 * 1024 * 1024 // 25 MB in bytes
      const acceptedFileTypes = ['application/pdf']

      const newFiles = Array.from(event.target.files)
      let validFiles = []
      let errorMessages = []

      newFiles.forEach(file => {
        if (file.size > maxFileSize) {
          errorMessages.push(`${file?.name} exceeds the maximum file size of 25MB.`)
        } else if (!acceptedFileTypes.includes(file.type)) {
          errorMessages.push(`${file?.name} is not a valid file type.`)
        } else {
          validFiles.push(file)
        }
      })

      if (errorMessages.length > 0) {
        enqueueSnackbar(errorMessages.join('\n'), { variant: 'error' })
      }

      if (validFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...validFiles])
        formik.setFieldValue('files', [...files, ...validFiles])
      }
    }
  }

  const handlejournalName = (formik, newValue) => {
    const trimmedValue = newValue.trim()
    if (trimmedValue !== '') {
      formik.setFieldValue('journalName', [...formik.values.journalName, trimmedValue])
      setInputJournalName('')
    }
  }

  const handleISSN = (formik, newValue) => {
    const trimmedValue = newValue.trim()
    if (trimmedValue !== '') {
      formik.setFieldValue('issn', [...formik.values.issn, trimmedValue])
      setInputISSN('')
    }
  }

  const formatISSN = value => {
    // Ensure value is a string before cleaning
    if (typeof value === 'string') {
      const cleanedValue = value.replace(/\D/g, '') // Remove non-digit characters
      let formattedValue = ''
      for (let i = 0; i < cleanedValue.length; i++) {
        formattedValue += cleanedValue[i]
        if (i === 3) {
          formattedValue += '-'
        }
      }

      return formattedValue
    } else {
      if (typeof value === 'Array') {
        return value
      }
    }
  }

  const allValues = selectedMainCategory.reduce((acc, category) => {
    return acc.concat(categories[category] || [])
  }, [])

  useEffect(() => {
    if (id) {
      getResearchPaperMutate({ id })
    }
  }, [id])

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
      subCategories: [],
      yearOfPublication: '',
      contactNumber: '',
      email: '',
      isbn: '',
      files: [],
      officialUrl: []
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is Required'),
      synopsis: Yup.string().required('synopsis is Required'),
      doi: Yup.string().optional(),
      itemType: Yup.string().required('itemType is Required'),
      journalName: Yup.array().optional(),
      issn: Yup.array()
        .of(Yup.string().matches(/^\d{4}-\d{4}$/, 'ISSN must be a valid 4-4 digit number'))
        .nullable()
        .test('unique-issn', 'ISSN must be unique', function (value) {
          return new Set(value).size === value?.length
        })
        .nullable(),
      officialUrl: Yup.array().optional(),
      authors: Yup.array()
        .of(Yup.string().matches(/^[a-zA-Z\s.]*$/, 'Author name must contain only letters, spaces, and periods'))
        .min(1, 'min 1 value for Authors is Required')
        .test('unique-authors', 'Authors must be unique', function (value) {
          return new Set(value).size === value.length
        })
        .required('Required'),

      keywords: Yup.array()
        .min(1, 'min 1 value for Keywords is Required')
        .test('unique-keywords', 'Keywords must be unique', function (value) {
          return new Set(value).size === value.length
        })
        .required('Required'),

      mainCategories: Yup.array().min(1, 'min 1 maincategory is vlaue Required').required('Required'),
      subCategories: Yup.array().optional(),
      yearOfPublication: Yup.string()
        .matches(/^[1-9]\d{3}$/, 'Year of publication must be a valid 4-digit year not starting with zero')
        .test('is-not-0000', 'Year of publication cannot be 0000', value => value !== '0000')
        .test(
          'is-not-future-year',
          'Year of publication cannot be in the future',
          value => value && parseInt(value, 10) <= currentYear
        )
        .required('Year of publication is Required'),
      language: Yup.string().required('Language is Required'),
      contactNumber: Yup.string()
        .matches(/^(?!0+$)\d{10,12}$/, 'Invalid contact number')
        .required('Contact Number is Required'),
      email: Yup.string()
        .matches(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Invalid email'
        )
        .required('Email is Required'),
      files: activeIndex === 1 ? Yup.array().min(1, 'Required') : Yup.array().optional(),
      isbn: Yup.string().optional().matches(/^\d+$/, 'ISBN must contain only numeric characters')
    }),
    onSubmit: async values => {
      try {
        if (activeIndex === 2) {
          values.files = []
          files.map(file => deleteResearchPaperMutate({ uuid: file }))
        }

        values.files = values.files.filter(file => typeof file !== 'string')

        if (values.files !== undefined && values.files.length > 0) {
          const form_data = new FormData()

          values.journalName = values.journalName.map(value => value.replace(/\s+/g, ' ').trim())
          values.issn = values.issn.map(value => value.replace(/\s+/g, ' ').trim())
          values.officialUrl = values.officialUrl.map(value => value.replace(/\s+/g, ' ').trim())
          values.authors = values.authors.map(value => value.replace(/\s+/g, ' ').trim())
          values.keywords = values.keywords.map(value => value.replace(/\s+/g, ' ').trim())
          values.doi = values.doi.replace(/\s+/g, ' ').trim()
          values.title = values.title.replace(/\s+/g, ' ').trim()
          values.synopsis = values.synopsis.replace(/\s+/g, ' ').trim()
          values.yearOfPublication = values.yearOfPublication.replace(/\s+/g, ' ').trim()

          form_data.append('title', values.title)
          form_data.append('isbn', values.isbn)
          form_data.append('synopsis', values.synopsis)
          form_data.append('language', values.language)
          form_data.append('doi', values.doi)
          form_data.append('itemType', values.itemType)
          form_data.append('yearOfPublication', values.yearOfPublication)
          form_data.append('contactNumber', values.contactNumber)
          form_data.append('email', values.email)

          // Append files only if the user selected "Yes" to upload

          // Ensure these fields are appended as arrays
          values.files.forEach(file => form_data.append('files', file))
          values.issn.length > 0
            ? values.issn.forEach(issn => form_data.append('issn[]', issn))
            : form_data.append('issn[]', [])
          values.authors.forEach(author => form_data.append('authors[]', author))
          values.keywords.forEach(keyword => form_data.append('keywords[]', keyword))
          values.journalName.length > 0
            ? values.journalName.forEach(journal => form_data.append('journalName[]', journal))
            : form_data.append('journalName[]', [])
          values.mainCategories.forEach(category => form_data.append('mainCategories[]', category))
          values.subCategories.length > 0
            ? values.subCategories.forEach(subCategory => form_data.append('subCategories[]', subCategory))
            : form_data.append('subCategories[]', [])
          values.officialUrl.length > 0
            ? values.officialUrl.forEach(url => form_data.append('officialUrl[]', url))
            : form_data.append('officialUrl[]', [])
          await updateResearchPaperMutate({ id: id, data: form_data })
        } else {
          values.journalName = values.journalName.map(value => value.replace(/\s+/g, ' ').trim())
          values.issn = values.issn.map(value => value.replace(/\s+/g, ' ').trim())
          values.officialUrl = values.officialUrl.map(value => value.replace(/\s+/g, ' ').trim())
          values.authors = values.authors.map(value => value.replace(/\s+/g, ' ').trim())
          values.keywords = values.keywords.map(value => value.replace(/\s+/g, ' ').trim())
          values.doi = values.doi.replace(/\s+/g, ' ').trim()
          values.title = values.title.replace(/\s+/g, ' ').trim()
          values.synopsis = values.synopsis.replace(/\s+/g, ' ').trim()
          values.yearOfPublication = values.yearOfPublication.replace(/\s+/g, ' ').trim()

          delete values.files

          await updateResearchPaperMutate({ id: id, data: values })
        }
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }
  })

  useEffect(() => {
    if (selectedMainCategory.length === 0) {
      formik.setFieldValue('subCategories', [])
    }
  }, [selectedMainCategory])

  const handleDeleteFile = index => {
    if (index + 1 <= Filelength) {
      deleteResearchPaperMutate({ uuid: files[index] })
      setFilelength(Filelength - 1)
    } else {
      const newFile = files.filter((_, i) => i !== index)
      setFiles(newFile)
    }
  }

  const handleOnChangeMainCategory = (e, value) => {
    setSelectedMainCategory(value)
  }

  const handleReplaceFile = (file, newFile) => {
    if (file?.length > 0 && newFile?.length > 0 && file[0]?.length !== 0 && newFile[0].length !== 0) {
      const formdata = new FormData()
      formdata.append('files', newFile[0]) // Append the actual file instead of a boolean

      updateResearchPapeFilerMutate({ uuid: file[0], data: formdata })
    } else {
      console.error('Invalid file or newFile: one of them is empty or contains an empty array.')
    }
  }

  return (
    <Card sx={{ marginBottom: '30px' }}>
      <CardContent sx={{ padding: '5%' }}>
        <Typography
          sx={{ paddingBottom: '30px', fontWeight: 600, fontSize: '26px' }}
          color={theme.palette.mode === 'dark' ? 'white' : theme.palette.primary.main}
        >
          Update Research Paper/Thesis/Book
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <BasicDetails
            formik={formik}
            allValues={allValues}
            handleOnChangeMainCategory={handleOnChangeMainCategory}
            inputKeyword={inputKeyword}
            setInputAuthors={setInputAuthors}
            inputAuthors={inputAuthors}
            setInputKeyword={setInputKeyword}
            handleAuthors={handleAuthors}
            handleKeywords={handleKeywords}
          />

          <Divider sx={{ marginTop: '25px' }} />

          {/* Authors details section */}
          <AuthorsDetails
            formik={formik}
            handleISSN={handleISSN}
            inputISSN={inputISSN}
            handlejournalName={handlejournalName}
            inputOfficialUrl={inputOfficialUrl}
            setInputOfficialUrl={setInputOfficialUrl}
            setInputJournalName={setInputJournalName}
            inputJournalName={inputJournalName}
            setInputISSN={setInputISSN}
            formatISSN={formatISSN}
            handleOfficialUrl={handleOfficialUrl}
          />

          <Divider sx={{ marginTop: '25px' }} />

          <Editfile
            activeIndex={activeIndex}
            formik={formik}
            updateResearchPaperDataLoading={updateResearchPaperDataLoading}
            handleDeleteFile={handleDeleteFile}
            handleReplaceFile={handleReplaceFile}
            files={files}
            Filelength={Filelength}
            handleAddNewFile={handleAddNewFile}
            handleClose={handleClose}
            open={open}
            handleOnClick={handleOnClick}
            setOpen={setOpen}
          />
        </form>
      </CardContent>
    </Card>
  )
}

export default EditResearchPaper
