import CreateResearchPaper from 'src/views/ResearchPaperComponents/createResearchPaper'
import AuthLayout from 'src/layouts/AuthLayout'
import { selectUser } from 'src/redux/reducers/authSlice'
import { useSelector } from 'react-redux'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Output = () => {
  const user = useSelector(selectUser)

  return user ? (
    <AuthLayout pageName='research-paper'>
      <CreateResearchPaper />
    </AuthLayout>
  ) : (
    <BlankLayout>
      <CreateResearchPaper />
    </BlankLayout>
  )
}

export default Output
