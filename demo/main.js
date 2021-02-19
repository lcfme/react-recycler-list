import React, { Component } from 'react'
import { render } from 'react-dom'
import * as data from './data'
import RecyclerList from 'react-recycler-list'
import './style.sass'



function PostCard(props) {
  return <div className="postcard">
    <div className="postcard-header-cont">
      <div className="postcard-header">
        <div className="postcard-avatar-cont">
          <div className="postcard-avatar" style={{ backgroundImage: `url(${props.publisher.url})` }}>
          </div>
        </div>
        <div className="postcard-name">{props.publisher.name}</div>
      </div>
    </div>
    <div className="postcard-main">
      <div className="postcard-text">{props.post.text}</div>
      <div className="postcard-img" style={{ backgroundImage: `url(${props.post.url})` }}></div>
    </div>
  </div>
}

class App extends Component {
  render() {
    return <RecyclerList listData={data.posts.map(post => ({
      publisher: data.publisher,
      post
    }))}>
      {data => <PostCard publisher={data.publisher} post={data.post} key={data.post.text} />}
    </RecyclerList>
  }
  // render() {
  //   return data.posts.map(post => ({
  //     publisher: data.publisher,
  //     post
  //   })).map(data => {
  //     return <PostCard publisher={data.publisher} post={data.post} key={data.post.text} />
  //   })
  // }
}

render(<App data={data} />, document.querySelector('#app'))