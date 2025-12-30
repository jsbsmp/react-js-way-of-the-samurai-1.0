import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Layout, Menu, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../redux/auth-reducer';
import { selectCurrentUserLogin, selectIsAuth } from '../../redux/auth-selectors';

export type MapPropsType = {
}

export const Header: React.FC<MapPropsType> = (props) => {

    const isAuth = useSelector(selectIsAuth);
    const login = useSelector(selectCurrentUserLogin);

    const dispatch = useDispatch();

    const logoutCallback = () => {
        dispatch(logout() as any);
    }

    const { Header } = Layout;

    const items = [{ key: '1', label: <Link to="/users" >Developers</Link> }];

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                items={items}
                style={{ flex: 1, minWidth: 0 }}
            />

            {isAuth ?
                <>
                    <Avatar alt={login || ''} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                    <Button onClick={logoutCallback}>Logout</Button>
                </>
                : <Button><Link to={'/login'}>Login</Link></Button>}

        </Header >

        // <header className={classes.header}>
        //     <NavLink to={'/'}><img src='https://toppng.com/uploads/preview/design-for-logo-11549988276bxsuzsd1y1.png' alt='Logo'></img></NavLink>

        //     <div className={classes.loginBlock}>
        //         {props.isAuth ? <div>{props.login} - <button onClick={props.logout}>Logout</button></div> : <NavLink to={'/login'}>Login</NavLink>}
        //     </div>
        // </header>
    )
}