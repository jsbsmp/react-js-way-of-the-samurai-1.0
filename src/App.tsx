import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import 'antd/dist/reset.css';
import SubMenu from 'antd/es/menu/SubMenu';
import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Preloader from './components/common/Preloader/Preloader';
import { Header } from './components/Header/Header';
import { LoginPage } from './components/Login/Login';
import Music from './components/Music/Music';
import News from './components/News/News';
import Settings from './components/Settings/Settings';
import { UsersPage } from './components/Users/UsersContainer';
import { withSuspense } from './hoc/withSuspense';
import { initializeApp } from './redux/app-reducer';
import store, { AppStateType } from './redux/redux-store';

const { Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: Array.from({ length: 4 }).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

const DialogContainer = React.lazy(() => import('./components/Dialog/DialogContainer'));
const ProfileContainer = React.lazy(() => import('./components/Profile/ProfileContainer'));
const ChatPage = React.lazy(() => import('./pages/Chat/ChatPage'));

const SuspendedDialogContainer = withSuspense(DialogContainer);
const SuspendedProfileContainer = withSuspense(ProfileContainer);
const SuspendedChatPage = withSuspense(ChatPage);

const App: React.FC = () => {

  const initialized = useSelector((state: AppStateType) => state.app.initialized);
  const dispatch = useDispatch();

  const catchAllUnhandledErrors = (e: PromiseRejectionEvent) => {
    alert("Some error occurred");
  }

  useEffect(() => {
    dispatch(initializeApp() as any);
    window.addEventListener("unhandledrejection", catchAllUnhandledErrors);
    return () => {
      window.removeEventListener("unhandledrejection", catchAllUnhandledErrors);
    }
  }, [dispatch]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!initialized) {
    return <Preloader />;
  }

  return (
    <Layout>
      <Header />
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderInlineEnd: 0 }}
          // items={items2}
          >
            <SubMenu key="SubMenu1" title="My Profile">
              <Menu.Item key="1"><Link to="/profile" >Profile</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/dialogs" >Messages</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="SubMenu2" title="Developers">
              <Menu.Item key="3"><Link to="/users" >Users</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="SubMenu3" title="Chat">
              <Menu.Item key="4"><Link to="/chat" >Chat</Link></Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            style={{ margin: '16px 0' }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/profile" />} />
              <Route path='/dialogs' element={
                <SuspendedDialogContainer />
              } />
              <Route path="/profile/*" element={
                <SuspendedProfileContainer />
              } />
              <Route path="/profile/:userId" element={
                <SuspendedProfileContainer />
              } />
              <Route path='/users' element={<UsersPage pageTitle="Users" />} />
              <Route path='/news' element={<News />} />
              <Route path='/music' element={<Music />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/chat' element={<SuspendedChatPage />} />
              <Route path='*' element={<div>404 NOT FOUND
                <Button>OK</Button>
              </div>} />
              {/* <Route path='*' element={<NotFound />} /> */}
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

const SamuraiJSApp: React.FC = () => {
  return (
    <React.StrictMode>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

export default SamuraiJSApp;