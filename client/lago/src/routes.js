import DashboardLayout from './pages/layout/DashboardLayout.vue'

import Dashboard from './pages/Dashboard.vue'
import SchemaInput from './pages/SchemaInput'
import SchemaBrowser from './pages/SchemaBrowser'
import SchemaTreeBrowser from './pages/SchemaTree'
import SchemaContent from './pages/layout/SchemaContent'
import About from './pages/About'
import MySchemaList from './pages/MySchemaList'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/schema/gencode',
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'schema',
        component: SchemaContent,
        children: [
          {
            path: 'gencode',
            component: SchemaInput
          },
          {
            path: 'browser',
            component: SchemaBrowser
          },
          {
            path: 'tree',
            component: SchemaTreeBrowser
          },
          {
            path: 'my',
            component: MySchemaList
          },
          {
            path: 'about',
            component: About
          }
        ]
      }
    ]
  }
]

export default routes
