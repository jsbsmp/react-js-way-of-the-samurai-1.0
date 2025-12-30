import classes from './Post.module.css';

type PropsType = {
  message: string
  likesCount: string
}

const Post = (props: PropsType) => {
  return (
    <div className={classes.item}>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFX-mLQIAtHa9IMC-WsA4rwrdQprIHJ_5Ehg&s" alt='Post Cover' />
      {props.message}
      <div>{props.likesCount} likes
      </div>
    </div>
  )
}

export default Post; 