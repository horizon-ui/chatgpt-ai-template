import { Icon } from './lib/chakra';
import {
  MdFileCopy,
  MdHome,
  MdLock,
  MdLayers,
  MdAutoAwesome,
  MdOutlineManageAccounts,
  MdMessage,
  MdOutlineHelp
} from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { IoIosHelpCircle } from "react-icons/io";
import { LuHistory } from 'react-icons/lu';
import { RoundedChart } from '@/components/icons/Icons';

// Auth Imports
import { IRoute } from './types/navigation';



const APIDOMAIN = process.env.API_DOMAIN;



const routes: IRoute[] = [

  // --- Main Pages ---
  {
    name: 'Home',
    path: '/',
    icon: (
      <Icon as={MdHome} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },
  {
    name: 'Olivia, Andrew, Me',
    path: '/conversation/test_conversation',
    icon: (
      <Icon as={MdMessage} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },
  {
    name: 'Instructions',
    path: '/instructions',
    icon: (
      <Icon as={IoIosHelpCircle} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  },

  // --- Others ---
  {
    name: 'Other Pages',
    invisible: true,
    disabled: true,
    path: '/others',
    icon: <Icon as={MdFileCopy} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Prompt Page',
        layout: '/others',
        path: '/prompt',
      },
      {
        name: 'Register',
        layout: '/others',
        path: '/register',
      },
      {
        name: 'Sign In',
        layout: '/others',
        path: '/sign-in',
      },
    ],
  },

  // --- Admin Pages ---
  {
    name: 'Admin Pages',
    invisible: true,
    disabled: true,
    path: '/admin',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'All Templates',
        layout: '/admin',
        path: '/all-admin-templates',
      },
      {
        name: 'New Template',
        layout: '/admin',
        path: '/new-template',
      },
      {
        name: 'Edit Template',
        layout: '/admin',
        path: '/edit-template',
      },
      {
        name: 'Users Overview',
        layout: '/admin',
        path: '/overview',
      },
    ],
  },
  {
    name: 'Profile Settings',
    disabled: true,
    path: '/settings',
    icon: (
      <Icon
        as={MdOutlineManageAccounts}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    invisible: true,
    collapse: false,
  },
  {
    name: 'History',
    disabled: true,
    path: '/history',
    icon: <Icon as={LuHistory} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'Usage',
    disabled: true,
    path: '/usage',
    icon: <Icon as={RoundedChart} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
  {
    name: 'My plan',
    disabled: true,
    path: '/my-plan',
    icon: <Icon as={RoundedChart} width="20px" height="20px" color="inherit" />,
    invisible: true,
    collapse: false,
  },
];



export async function fetchRoutes(): Promise<IRoute[]> {

  // Fetch the list of conversations available to this user from the API
  const conversations = await (
    await fetch(
      `${APIDOMAIN}/api/conversations`,
      {
        credentials: 'include',
      }
    )
  ).json()

  // Map the list of conversations to a list of route objects
  const conversationRoutes = conversations.map((conversation: any) => ({
    name: conversation.ds_key,
    path: `/conversation/${conversation.ds_key}`,
    icon: (
      <Icon as={MdMessage} width="20px" height="20px" color="inherit" />
    ),
    collapse: false,
  }))

  // Insert the list of conversations into the routes list
  return [

    // Homepage
    {
      name: 'Home',
      path: '/',
      icon: (
        <Icon as={MdHome} width="20px" height="20px" color="inherit" />
      ),
      collapse: false,
    },

    // Conversations
    ...conversationRoutes,

    // Instructions
    {
      name: 'Instructions',
      path: '/instructions',
      icon: (
        <Icon as={IoIosHelpCircle} width="20px" height="20px" color="inherit" />
      ),
      collapse: false,
    },
  ];
}


export default { fetchRoutes }
