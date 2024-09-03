// src/components/GetResearchPaper.js
import { TablePagination } from '@mui/material'
import { useDebouncedCallback } from 'use-debounce'

import {
  useAuthorYearData,
  useGetResearchPaperData,
  useUpdateResearchPaper
} from 'src/shared/utility/services/hooks/researchPaper'
import { useEffect, useState } from 'react'
import { categories } from 'src/shared/utility/helpers'
import { enqueueSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import {
  setSearchQuery,
  setSelectedYear,
  setSelectedAuthor,
  setSelectedMainCategory,
  setSelectedSubCategory,
  setSelectedLanguages,
  set_Page,
  set_RowsPerPage
} from 'src/redux/reducers/searchSlice'
import ShowPaperDetails from 'src/components/getresearchpaper/ShowPaperDetails'

const GetResearchPaper = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchState = useSelector(state => state.search)

  const [authorData, setAuthorData] = useState([])
  const [yearData, setYearData] = useState([])
  const [researchPaperData, setResearchPaperData] = useState([])
  const [is_Approved, set_IsApproved] = useState('')

  const [totalPapers, setTotalPapers] = useState(0)

  const [loadingPaperId, setLoadingPaperId] = useState(null)

  const mainCategories = Object.keys(categories)
  const subCategories = categories[searchState.selectedMainCategory] || []

  const debouncedFetchData = useDebouncedCallback(value => {
    getResearchPaperMutate(value)
  }, 1000)

  const {
    data: getAuthorAndYearData,
    isLoading: getAuthorAndYearLoading,
    isError: getAuthorAndYearIsError,
    error: getAuthorAndYearError,
    mutate: getAuthorAndYearMutate
  } = useAuthorYearData()

  useEffect(() => {
    getAuthorAndYearMutate()
  }, [])

  useEffect(() => {
    try {
      if (getAuthorAndYearData && !getAuthorAndYearLoading) {
        setAuthorData(getAuthorAndYearData?.data?.authors ?? [])
        setYearData(getAuthorAndYearData?.data?.yearOfPublication ?? [])
      }
      if (getAuthorAndYearIsError) {
        enqueueSnackbar(getAuthorAndYearError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [getAuthorAndYearData, getAuthorAndYearLoading, getAuthorAndYearIsError])

  const {
    data: getResearchPaperData,
    isLoading: getResearchPaperLoading,
    isError: getResearchPaperIsError,
    error: getResearchPaperError,
    mutate: getResearchPaperMutate
  } = useGetResearchPaperData()

  useEffect(() => {
    try {
      if (getResearchPaperData && !getResearchPaperLoading) {
        setResearchPaperData(getResearchPaperData?.data?.list || [])
      }

      if (getResearchPaperIsError) {
        enqueueSnackbar(getResearchPaperError?.response?.data?.message, { variant: 'error' })
      }
    } catch (err) {
      console.error(err)
    }
  }, [getResearchPaperData, getResearchPaperLoading, getResearchPaperIsError])

  useEffect(() => {
    const queryParamsAuthor =
      searchState.selectedAuthor?.length > 0
        ? searchState.selectedAuthor.map(author => `authors=${author}`).join('&')
        : ''

    const queryParamsYear =
      searchState.selectedYear?.length > 0
        ? searchState.selectedYear.map(year => `yearOfPublication=${year}`).join('&')
        : ''

    const dataObject = {
      authors: queryParamsAuthor,
      yearOfPublication: queryParamsYear,
      limit: searchState.rowsPerPage || 10,
      pageNo: searchState.page + 1 || 1,
      otherQueryParams: {
        isApproved: searchState.isApprove,
        query: searchState.searchQuery,
        language: searchState.selectedLanguages,
        mainCategories: searchState.selectedMainCategory,
        subCategories: searchState.selectedSubCategory
      }
    }

    getResearchPaperMutate(dataObject)
  }, [searchState])

  useEffect(() => {
    const queryParamsAuthor =
      searchState.selectedAuthor?.length > 0
        ? searchState.selectedAuthor.map(author => `authors=${author}`).join('&')
        : ''

    const queryParamsYear =
      searchState.selectedYear?.length > 0
        ? searchState.selectedYear.map(year => `yearOfPublication=${year}`).join('&')
        : ''

    debouncedFetchData({
      authors: queryParamsAuthor,
      yearOfPublication: queryParamsYear,
      limit: searchState.rowsPerPage || 10,
      pageNo: searchState.page + 1 || 1,
      otherQueryParams: {
        isApproved: searchState.isApprove,
        query: searchState.searchQuery,
        language: searchState.selectedLanguages,
        mainCategories: searchState.selectedMainCategory,
        subCategories: searchState.selectedSubCategory
      }
    })
  }, [searchState.searchQuery])

  useEffect(() => {
    if (getResearchPaperData) {
      setTotalPapers(getResearchPaperData.data.total || 0)
    }
  }, [getResearchPaperData])

  const Page = (event, newPage) => {
    dispatch(set_Page(newPage))

    const queryParamsAuthor =
      searchState.selectedAuthor?.length > 0
        ? searchState.selectedAuthor.map(author => `authors=${author}`).join('&')
        : ''

    const queryParamsYear =
      searchState.selectedYear?.length > 0
        ? searchState.selectedYear.map(year => `yearOfPublication=${year}`).join('&')
        : ''

    const dataObject = {
      authors: queryParamsAuthor,
      yearOfPublication: queryParamsYear,
      limit: searchState.rowsPerPage || 10,
      pageNo: searchState.page + 1 || 1,
      otherQueryParams: {
        query: searchState.searchQuery,
        language: searchState.selectedLanguages,
        mainCategories: searchState.selectedMainCategory,
        subCategories: searchState.selectedSubCategory
      }
    }

    getResearchPaperMutate(dataObject)
  }

  const handleChangeRowsPerPage = event => {
    const newRowsPerPage = parseInt(event.target.value, 10)
    dispatch(set_RowsPerPage(newRowsPerPage))

    const newPageNumber = Math.floor((searchState.page * searchState.rowsPerPage) / newRowsPerPage)
    dispatch(set_Page(newPageNumber))
  }

  const {
    data: updateResearchPaperData,
    isLoading: updateResearchPaperLoading,
    isError: updateResearchPaperIsError,
    error: updateResearchPaperError,
    mutate: updateResearchPaperMutate
  } = useUpdateResearchPaper()

  const clearSearch = () => {
    dispatch(setSearchQuery(''))
    dispatch(setSelectedAuthor([]))
    dispatch(setSelectedYear([]))
    dispatch(setSelectedLanguages([]))
    dispatch(setSelectedMainCategory(''))
    dispatch(setSelectedSubCategory(''))

    dispatch(set_Page(0))
    dispatch(set_RowsPerPage(10))

    getResearchPaperMutate({
      authors: '',
      yearOfPublication: '',
      limit: 10,
      pageNo: 1,
      otherQueryParams: {
        query: '',
        language: '',
        mainCategories: '',
        subCategories: ''
      }
    })
  }

  useEffect(() => {
    try {
      if (updateResearchPaperData && !updateResearchPaperLoading) {
        enqueueSnackbar(is_Approved === 'approved' ? 'Approved Successfully' : 'Rejected Successfully', {
          variant: 'success'
        })

        setLoadingPaperId(null)

        const queryParamsAuthor =
          searchState.selectedAuthor?.length > 0
            ? searchState.selectedAuthor.map(author => `authors=${author}`).join('&')
            : ''

        const queryParamsYear =
          searchState.selectedYear?.length > 0
            ? searchState.selectedYear.map(year => `yearOfPublication=${year}`).join('&')
            : ''

        const paramsQuery = {
          authors: queryParamsAuthor,
          yearOfPublication: queryParamsYear,
          limit: searchState.rowsPerPage || 10,
          pageNo: searchState.page + 1 || 1,
          otherQueryParams: {
            isApproved: searchState.isApprove,
            query: searchState.searchQuery,
            language: searchState.selectedLanguages,
            mainCategories: searchState.selectedMainCategory,
            subCategories: searchState.selectedSubCategory
          }
        }

        getResearchPaperMutate(paramsQuery)
      }
    } catch (err) {
      enqueueSnackbar(err, { variant: 'error' })
    }
  }, [updateResearchPaperData, updateResearchPaperLoading, updateResearchPaperIsError, updateResearchPaperError])

  const handleEditOnClick = paperId => {
    router.push({
      pathname: `/research-paper/editResearchPaper/${paperId}`
    })
  }

  return (
    <>
      <ShowPaperDetails
        authorData={authorData}
        mainCategories={mainCategories}
        loadingPaperId={loadingPaperId}
        subCategories={subCategories}
        researchPaperData={researchPaperData}
        clearSearch={clearSearch}
        updateResearchPaperMutate={updateResearchPaperMutate}
        set_IsApproved={set_IsApproved}
        getResearchPaperLoading={getResearchPaperLoading}
        yearData={yearData}
        setLoadingPaperId={setLoadingPaperId}
        handleEditOnClick={handleEditOnClick}
        updateResearchPaperLoading={updateResearchPaperLoading}
      />

      <TablePagination
        component='div'
        count={totalPapers}
        page={searchState.page}
        onPageChange={Page}
        rowsPerPage={searchState.rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default GetResearchPaper
