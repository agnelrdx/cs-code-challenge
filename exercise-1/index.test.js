const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8')

let dom
let container

describe('index.html', () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: 'dangerously' })
    container = dom.window.document.body
    dom.window.fetchUsers = jest.fn()
  })

  it('renders a heading element', () => {
    expect(container.querySelector('h1')).not.toBeNull()
  })

  it('renders a loader element', () => {
    expect(container.querySelector('#loader')).not.toBeNull()
  })
})
