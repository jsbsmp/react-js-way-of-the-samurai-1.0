import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FilterType, follow as followThunk, requestUsers, unfollow as unfollowThunk } from '../../redux/users-reducer';
import { getCurrentPage, getFollowingInProgress, getPageSize, getTotalUsersCount, getUsers, getUsersFilter } from '../../redux/users-selectors';
import Paginator from '../common/Paginator/Paginator';
import User from './User';
import styles from './Users.module.css';
import { UsersSearchForm } from './UsersSearchForm';

type PropsType = {
}

export const Users: FC<PropsType> = (props) => {

  const totalUsersCount = useSelector(getTotalUsersCount);
  const currentPage = useSelector(getCurrentPage);
  const pageSize = useSelector(getPageSize);
  const filter = useSelector(getUsersFilter);
  const users = useSelector(getUsers);
  const followingInProgress = useSelector(getFollowingInProgress);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const location = useLocation();
  const [searchParams] = useSearchParams(location.search);
  
  useEffect(() => {
    const parsed = Object.fromEntries(Array.from(searchParams.entries()))
    
    let actualPage = currentPage;
    let actualFilter = filter;
    
    if (!!parsed.page) actualPage = Number(parsed.page)
      if (!!parsed.term) actualFilter = { ...actualFilter, term: parsed.term as string }
    if (!!parsed.friend) actualFilter = { ...actualFilter, friend: parsed.friend === "true" ? true : parsed.friend === "false" ? false : null }
    
    dispatch(requestUsers(pageSize, currentPage, filter) as any);
  }, [currentPage, pageSize, filter, dispatch]);

  useEffect(() => {
    navigate({
      pathname: '/users',
      search: `?term=${filter.term}&friend=${filter.friend}&page=${currentPage}`
    });
  }, [filter, currentPage]
  );

  const onPageChanged = (pageNumber: number) => {
    dispatch(requestUsers(pageSize, pageNumber, filter) as any);
  }

  const onFilterChanged = (filter: FilterType) => {
    dispatch(requestUsers(pageSize, 1, filter) as any);
  }

  const unfollow = (userId: number) => {
    dispatch(unfollowThunk(userId) as any);
  }
  const follow = (userId: number) => {
    dispatch(followThunk(userId) as any);
  }

  return <div>
    <UsersSearchForm onFilterChanged={onFilterChanged} />
    <Paginator currentPage={currentPage} onPageChanged={onPageChanged} totalItemsCount={totalUsersCount} pageSize={pageSize} />
    <h2>Users</h2>
    <div className={styles.userList}>
      {users.map(user => <User user={user} followingInProgress={followingInProgress} unfollow={unfollow} follow={follow} key={user.id} />)}
    </div>
  </div>
}