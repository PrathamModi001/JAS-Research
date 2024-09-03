// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import GetResearchPaper from 'src/views/ResearchPaperComponents/getResearchPaper'

const ResearchPaper = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <GetResearchPaper />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default ResearchPaper
