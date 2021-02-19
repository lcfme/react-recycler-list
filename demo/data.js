import avatar from './avatar.jpg'
import jpg1 from './1.jpg'
import jpg2 from './2.jpg'
import jpg3 from './3.jpg'
import jpg4 from './4.jpg'
import jpg5 from './5.jpg'
import jpg6 from './6.jpg'
import jpg7 from './7.jpg'
import jpg8 from './8.jpg'

export const publisher = {
  name: 'minecraft',
  url: avatar
}

const _posts = [
  {
    text: 'jpg1',
    url: jpg1
  },
  {
    text: 'jpg2',
    url: jpg2
  },
  {
    text: 'jpg3',
    url: jpg3
  },
  {
    text: 'jpg4',
    url: jpg4
  },
  {
    text: 'jpg5',
    url: jpg5
  },
  {
    text: 'jpg6',
    url: jpg6
  },
  {
    text: 'jpg7',
    url: jpg7
  },
  {
    text: 'jpg8',
    url: jpg8
  },
]

export const posts = [].concat(_posts, _posts, _posts).map((item, index) => {
  return {
    ...item,
    text: `jpg${index}`
  }
})