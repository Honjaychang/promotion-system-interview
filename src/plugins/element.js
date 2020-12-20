import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Upload,
  Dialog,
  Table,
  TableColumn,
  MessageBox,
  Collapse,
  CollapseItem,
  Image,
  Pagination
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(TableColumn)
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Image)
Vue.use(Pagination)
