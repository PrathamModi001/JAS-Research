// ** Icon imports
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import AccountGroup from 'mdi-material-ui/AccountGroup'
import AddIcon from '@mui/icons-material/Add'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import { store } from 'src/redux/store'
import AddTaskIcon from '@mui/icons-material/AddTask'

const organizationAdmin = [
  {
    title: 'Dashboard',
    icon: HomeOutline,
    path: '/dashboard'
  },
  {
    title: 'Account Settings',
    icon: AccountCogOutline,
    path: '/account-settings'
  },
  {
    title: 'Clients',
    icon: AccountGroup,
    path: '/clients'
  },
  {
    title: 'Employee',
    icon: BadgeOutlinedIcon,
    path: '/employee'
  }
]

const organizationEmployee = [
  {
    title: 'Dashboard',
    icon: HomeOutline,
    path: '/dashboard'
  },
  {
    title: 'Account Settings',
    icon: AccountCogOutline,
    path: '/account-settings'
  },
  {
    title: 'Clients',
    icon: AccountGroup,
    path: '/clients'
  },
  {
    title: 'Employee',
    icon: BadgeOutlinedIcon,
    path: '/employee'
  }
]

const companyAdmin = [
  {
    title: 'Dashboard',
    icon: HomeOutline,
    path: '/dashboard'
  },
  {
    title: 'Account Settings',
    icon: AccountCogOutline,
    path: '/account-settings'
  },
  {
    title: 'Employee',
    icon: BadgeOutlinedIcon,
    path: '/employee'
  }
]

const companyEmployee = [
  {
    title: 'Dashboard',
    icon: HomeOutline,
    path: '/dashboard'
  },
  {
    title: 'Account Settings',
    icon: AccountCogOutline,
    path: '/account-settings'
  },
  {
    title: 'Employee',
    icon: BadgeOutlinedIcon,
    path: '/employee'
  }
]

const superAdmin = [
  {
    title: 'Users',
    icon: HomeOutline,
    path: '/users'
  },
  {
    title: 'Account Settings',
    icon: AccountCogOutline,
    path: '/account-settings'
  },
  {
    title: 'Power-Bi',
    icon: AccountCogOutline,
    path: '/sa-powerbi'
  }
]

const Admin = [
  {
    title: 'JAS Users',
    icon: HomeOutline,
    path: '/users'
  },
  {
    title: 'Upload-Paper',
    icon: AddIcon,
    path: '/create-paper'
  },
  {
    title: 'Research-Papers',
    icon: AccountCogOutline,
    path: '/research-paper'
  },

  {
    title: 'Approve-Papers',
    icon: AddTaskIcon,
    path: '/paper-approval'
  }
]

const user = [
  {
    title: 'Create-Paper',
    icon: AddTaskIcon,
    path: '/create-paper'
  },
  {
    title: 'Research-Papers',
    icon: HomeOutline,
    path: '/research-paper'
  }
]

const rolesRelatedSidebarMenu = {
  User: user,
  organizationAdmin,
  organizationEmployee,
  companyAdmin,
  companyEmployee,
  superAdmin,
  Admin
}

const navigation = () => {
  const user = store.getState().user
  if (!user) {
    return rolesRelatedSidebarMenu[User]
  }

  return rolesRelatedSidebarMenu[user?.userData?.role]
}

export default navigation
