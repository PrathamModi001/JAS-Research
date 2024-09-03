import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { selectUser } from 'src/redux/reducers/authSlice'

/*
    users keyword is used allowing to users and clients page
    dashboard and accountSettings are common for all roles
*/

const superAdmin = ['users', 'accountSettings', 'sa-powerbi']
const organizationAdmin = ['dashboard', 'accountSettings', 'clients', 'employee', 'powerBi']
const User = ['accountSettings', 'clients', 'employee', 'powerBi', 'research-paper']

const Admin = [
  'users',
  'research-paper',
  'clients',
  'employee',
  'powerBi',
  'accountSettings',
  'paper-approval',
  'editResearchPaper'
]
const organizationEmployee = ['dashboard', 'accountSettings', 'clients', 'employee', 'powerBi', 'research-paper']
const companyAdmin = ['dashboard', 'accountSettings', 'clients', 'employee', 'research-paper']
const companyEmployee = ['dashboard', 'accountSettings', 'employee', 'research-paper']

const roleAccessConfig = {
  User,
  Admin,
  superAdmin,
  organizationAdmin,
  organizationEmployee,
  companyAdmin,
  companyEmployee
}

const AuthLayout = ({ children, pageName }) => {
  // ** Hooks
  const router = useRouter()
  const user = useSelector(selectUser)
  const haveAccess = roleAccessConfig[user?.role]?.includes(pageName)

  if (!user) {
    router.push('/')
  } else if (user && !haveAccess) {
    router.push('/401')
  }

  return user ? children : <></>
}

export default AuthLayout
