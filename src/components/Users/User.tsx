import styles from './Users.module.css';
import userPhoto from '../../assets/images/user.svg';
import { NavLink } from 'react-router-dom';
import { UserType } from '../../types/types';

type PropsType = {
    user: UserType
    followingInProgress: Array<number>
    unfollow: (userId: number) => void
    follow: (userId: number) => void
}

let User: React.FC<PropsType> = ({ user, followingInProgress, unfollow, follow }) => {
    return (
        <div key={user.id} className={styles.userCard}>
            <div>
                <NavLink className={styles.userLink} to={'/profile/' + user.id}>
                    <img src={user.photos.small !== null ? user.photos.small : userPhoto} alt={user.name} className={styles.userPhoto} />
                </NavLink>
            </div>
            <div>
                {user.followed ?
                    <button disabled={followingInProgress.some(id => id === user.id)} onClick={() => {
                        unfollow(user.id);
                    }}>Unfollow</button> :
                    <button disabled={followingInProgress.some(id => id === user.id)} onClick={() => {
                        follow(user.id);
                    }}>Follow</button>}</div>
            <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.name}</h3>
                <p className={styles.userStatus}>{user.status}</p>
                <p className={styles.userLocation}>{"user.location.city"}, {"user.location.country"}</p>
            </div>
        </div>
    );
}

export default User;