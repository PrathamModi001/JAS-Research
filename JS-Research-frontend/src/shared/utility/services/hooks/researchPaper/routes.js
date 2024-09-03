import { baseURL } from 'src/shared/utility/helpers'

export const researchPaper = {
  authorAndYear: {
    get: {
      query: 'GET_AUTHOR_YEAR',
      method: 'GET',
      url: `${baseURL}research-paper/details`
    }
  },
  getResearchPaper: {
    get: {
      query: 'GET_RESEARCH_PAPER_DETAILS',
      method: 'GET',
      url: `${baseURL}research-paper`
    }
  },
  createResearchPaper: {
    post: {
      query: 'CREATE_RESEARCH_PAPER',
      method: 'POST',
      url: `${baseURL}research-paper`
    }
  },

  getResearchPaperById: {
    get: {
      query: 'GET_RESEARCH_PAPER_BY_ID',
      method: 'GET',
      url: `${baseURL}research-paper/`
    }
  },
  updateResearchPaper: {
    put: {
      query: 'UPDATE_RESEARCH_PAPER',
      method: 'PUT',
      url: `${baseURL}research-paper/`
    }
  },

  updateResearchPaperFile: {
    put: {
      query: 'UPDATE_RESEARCH_PAPER',
      method: 'PUT',
      url: `${baseURL}research-paper/file/`
    }
  },

  editResearchPaper: {
    get: {
      query: 'EDIT_RESEARCH_PAPER',
      method: 'GET',
      url: `${baseURL}research-paper/`
    }
  },

  deleteResearchPaper: {
    delete: {
      query: 'DELETE_RESEARCH_PAPER',
      method: 'DELETE',
      url: `${baseURL}research-paper/`
    }
  },

  deleteResearchPaperByID: {
    delete: {
      query: 'DELETE_RESEARCH_PAPER_BY_ID',
      method: 'DELETE',
      url: `${baseURL}research-paper/file/`
    }
  },
  getPaperPDFById: {
    get: {
      query: 'GET_PAPER_PDF_BY_ID',
      method: 'GET',
      url: `${baseURL}research-paper/download/`
    }
  },
  getfiledetails: {
    post: {
      query: 'GET_FILE_DETAILS',
      method: 'POST',
      url: `${baseURL}research-paper/pre-signed`
    }
  },
  addFileToAWS: {
    post: {
      query: 'ADD_FILE_TO_AWS',
      method: 'POST',
      url: ''
    }
  }
}
