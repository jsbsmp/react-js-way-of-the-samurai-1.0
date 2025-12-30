import React from 'react';
import classes from './MyPosts.module.css';
import Post from './Post/Post';
import { PostType } from '../../../types/types';
import AddPostForm, { AddPostFormValuesType } from './AddPostForm';

export type MapPropsType = {
  posts: Array<PostType>
}

export type DispatchPropsType = {
  addPost: (newPostText: string) => void
}

const MyPosts: React.FC<MapPropsType & DispatchPropsType> = props => {

  let postsElements = props.posts.map(p => <Post key={p.id} message={p.message} likesCount={p.likesCount} />);

  let onAddPost = (values: AddPostFormValuesType) => {
    props.addPost(values.newPostText);
  };

  return (
    <div className='classes.postBlock'>
      <h3>My posts</h3>
      <AddPostForm onSubmit={onAddPost} />
      <div className={classes.posts}>
        {postsElements}
      </div>
    </div>
  )
};

const MyPostMemorized = React.memo(MyPosts);

export default MyPostMemorized;