import AuthLayout from 'src/layouts/AuthLayout'
import ResearchPaperById from 'src/views/ResearchPaperComponents/researchPaperById'

function Index() {
  return (
    <AuthLayout pageName='research-paper'>
      <ResearchPaperById />
    </AuthLayout>
  )
}

export default Index
