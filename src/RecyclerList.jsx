import React, { cloneElement, Component, Children, useState, useEffect, useMemo, useRef, useCallback, createElement, useReducer } from 'react'
import { findDOMNode } from 'react-dom'

function shallowEqual(a, b) {
  if (a == null || b == null) {
    return false
  }
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }
  for (let k in a) {
    if (a[k] != b[k]) {
      return false
    }
  }
  return true
}

class RecyclerListChild extends Component {
  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props, nextProps)
  }
  render() {
    return Children.only(this.props.children)
  }
}

function toChildMap(data, childFactory) {
  const childMap = {}
  Children.map(data.map((i) => Children.only(childFactory(i))), child => child).forEach(child => {
    childMap[child.key] = child
  })
  return childMap
}

function rerenderComponentHook() {
  let [r, s] = useState(0)
  return () => {
    s(r => r + 1)
  }
}

export default function RecyclerList(props) {
  const rerender = rerenderComponentHook()
  const startIndexRef = useRef(0)
  const lenRef = useRef(0)
  const paddingTopRef = useRef(0)
  const paddingBottomRef = useRef(0)
  const sizeCache = useRef({})
  const componentCache = useRef({})
  const childFactoryRef = useRef(props.children)
  const delta = useRef(0)
  const lastScrollTop = useRef(0)
  const indexKeyMap = useRef({})

  const startIndex = startIndexRef.current
  const len = lenRef.current
  const paddingTop = paddingTopRef.current
  const paddingBottom = paddingBottomRef.current

  const recordComponent = useCallback((key, component) => {
    componentCache.current[key] = component
  }, [])

  const children = useMemo(() => {
    const childMap = toChildMap(props.listData.slice(Math.max(startIndex - 1, 0), Math.min(startIndex + len + 1, props.listData.length)), childFactoryRef.current)
    const renderedChildren = []
    let i = startIndex
    for (let key in childMap) {
      if (indexKeyMap.current[i] != null && indexKeyMap.current[i] !== key) {
        delete sizeCache.current[key]
      }
      indexKeyMap.current[i] = key
      i += 1
      let factoryChild = childMap[key]
      if (factoryChild) {
        let wrapper = createElement(RecyclerListChild, {
          key,
          ref: recordComponent.bind(null, key)
        }, factoryChild)
        renderedChildren.push(wrapper)
      }
    }
    return renderedChildren
  }, [startIndex, len, props.listData, childFactoryRef.current])

  const afterPaint = useCallback(() => {
    let renderedHeight = 0
    children.forEach((child) => {
      const inst = componentCache.current[child.key]
      if (sizeCache.current[child.key] == null) {
        const dom = findDOMNode(inst)
        if (dom) {
          let width = dom.offsetWidth
          let height = dom.offsetHeight
          sizeCache.current[child.key] = {
            width,
            height,
          }
        }
      }
      renderedHeight += sizeCache.current[child.key].height
    })
    if (renderedHeight < window.innerHeight * 2 && startIndex + len < props.listData.length - 1) {
      lenRef.current = len + 1
      rerender()
    }
  }, [children, props.listData])


  useEffect(() => {
    afterPaint()
  })

  const onScroll = useCallback((e) => {
    const scrollTop = window.pageYOffset
    let deltaValue = scrollTop - lastScrollTop.current + delta.current
    console.log(deltaValue, 'deltaV', lastScrollTop.current, scrollTop, delta.current)
    let nextStartIndex = startIndex
    let nextPaddingTop = paddingTop
    let nextPaddingBottom = paddingBottom
    let child, key, size
    lastScrollTop.current = scrollTop
    if (children.length) {
      while (deltaValue < 0) {
        if (nextStartIndex > 0) {
          nextStartIndex -= 1
          key = indexKeyMap.current[nextStartIndex]
          size = sizeCache.current[key]
          console.log('dec', size)
          deltaValue += size ? size.height : 0
          nextPaddingTop -= size ? size.height : 0
        } else {
          break
        }
      }
      // console.log(deltaValue)
      while (deltaValue > 0 && nextStartIndex + len < props.listData.length - 1) {
        key = indexKeyMap.current[nextStartIndex]
        size = sizeCache.current[key]
        if (deltaValue > (size ? size.height : 0)) {
          console.log('inc', size)
          nextStartIndex += 1
          deltaValue -= size ? size.height : 0
          nextPaddingTop += size ? size.height : 0
        } else {
          break
        }
      }
    }


    delta.current = deltaValue
    console.log(nextStartIndex, startIndex, 'scroll')
    if (nextStartIndex !== startIndex) {
      console.log(nextStartIndex, startIndex, 'set')
      paddingTopRef.current = nextPaddingTop
      paddingBottomRef.current = nextPaddingBottom
      startIndexRef.current = nextStartIndex
      rerender()
    }
  }, [props.listData, startIndex])
  useEffect(() => {
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  })


  return createElement('div', {
    style: {
      paddingTop: `${paddingTop}px`,
      paddingBottom: `${paddingBottom}px`
    }
  }, children)
}