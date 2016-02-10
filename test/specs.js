import { expect } from 'chai'

import substyle from '../src'

describe('substyle', function () {

  const myStyle = {

    width: '100%',

    ':hover': {
      background: 'silver'
    },

    '&active': {
      background: 'blue'
    },

    '&inactive': {
      background: 'white'
    },

    '&disabled': {
      pointerEvents: 'none'
    },


    toggle: {
      display: 'block',
      width: 50,
    },

    btn: {
      cursor: 'pointer'
    }

  }


  
  it('should derive a BEM compliant classNames for a passed nested element key', function () {
    const { className } = substyle({ className: 'my-class' }, 'toggle')
    expect(className).to.equal('my-class__toggle')
  })

  it('should derive a BEM compliant classNames for a passed modifier key', function () {
    const { className } = substyle({ className: 'my-class' }, '&active')
    expect(className).to.equal('my-class my-class--active')
  })

  it('should should select the nested inline styles for the given key', function () {
    const { style } = substyle({ style: myStyle }, 'toggle')
    expect(style).to.deep.equal({
      display: 'block',
      width: 50
    })
  })

  it('should not return a className when no className has been set in the props', function () {
    const props = substyle({ style: myStyle }, 'toggle')
    expect(props).to.not.have.property('className')
  })

  it('should not return a style when no style has been set in the props', function () {
    const props = substyle({ className: 'my-class' }, 'toggle')
    expect(props).to.not.have.property('style')
  })


  it('should include direct style definitions if a modifier key is used', function () {
    const { style } = substyle(
      { style: myStyle }, 
      '&active'
    )
    expect(style).to.deep.equal({ 
      width: '100%',
      ':hover': {
        background: 'silver'
      },
      background: 'blue'
    })
  })

  it('should support passing multiple keys in an array', function () {
    const { style, className } = substyle(
      { style: myStyle, className: 'my-class' }, 
      [ 'toggle', 'btn' ]
    )

    expect(className).to.equal('my-class__toggle my-class__btn')
    expect(style).to.deep.equal({ 
      display: 'block',
      width: 50,
      cursor: 'pointer'
    })
  })

  it('should support passing multiple keys as an object', function () {
    const { style, className } = substyle(
      { style: myStyle, className: 'my-class' }, 
      { '&active': true, '&inactive': false, '&disabled': true }
    )

    expect(className).to.equal('my-class my-class--active my-class--disabled')
    expect(style).to.deep.equal({ 
      width: '100%',
      ':hover': {
        background: 'silver'
      },
      background: 'blue',
      pointerEvents: 'none'
    })
  })

  it('should return the original className when nestedKeys is not specified or empty', function () {
    const { className } = substyle({ className: 'my-class' })
    expect(className).to.equal('my-class')

    const { className: sameClassName } = substyle({ className: 'my-class' }, { '@active': false })
    expect(sameClassName).to.equal('my-class')

    const { className: stillTheSameClassName } = substyle({ className: 'my-class' }, undefined)
    expect(stillTheSameClassName).to.equal('my-class')
  })

  it('should return the top-level inline style definitions when nestedKeys is not specified', function () {
    const { style } = substyle({ style: myStyle })
    expect(style).to.have.property('width', '100%')
  })

  it('should include nested inline style definitions for pseudo-class selectors when nestedKeys is not specified', function () {
    const { style } = substyle({ style: myStyle })
    expect(style).to.have.property(':hover')
    expect(style[':hover']).to.deep.equal({
      background: 'silver'
    })
  })

  it('should merge nested inline styles in the order of the nestedKeys', function () {
    const styleWithDeepNesting = {
      toggle: {
        width: 100,

        label: {
          fontSize: '11pt',
          color: 'blue'
        }
      },

      specialToggle: {
        width: 50,

        label: {
          color: 'red'
        }
      }
    }

    const { style } = substyle({ style: styleWithDeepNesting }, ['toggle', 'specialToggle'])
    expect(style).to.deep.equal({
      width: 50,

      label: {
        fontSize: '11pt',
        color: 'red'
      }
    })

    const { style: otherStyle } = substyle({ style: styleWithDeepNesting }, ['specialToggle', 'toggle'])
    expect(otherStyle).to.deep.equal({
      width: 100,

      label: {
        fontSize: '11pt',
        color: 'blue'
      }
    })
  })

  it('should also pick the inline style sub object under the camelized version of the key', function () {
    const styleWithCamelCaseKey = {
      specialToggle: {
        width: 50
      }
    }

    const { style } = substyle({ style: styleWithCamelCaseKey }, 'special-toggle')
    expect(style).to.deep.equal({
      width: 50
    })
  })

})