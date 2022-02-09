const fetchUsers = async () => {
  try {
    const users = await fetch('https://615485ee2473940017efaed3.mockapi.io/assessment')
    const context = await users.json()
    const source = document.getElementById('entry-template').innerHTML
    const template = Handlebars.compile(source)
    const html = template({ users: context })
    const loader = document.getElementById('loader')
    loader.remove()
    document.getElementById('user-wrapper').innerHTML = html
  } catch (error) {}
}

const viewUserDetails = id => {
  const btn = document.getElementById(`btn-${id}`)
  btn.remove()
  const details = document.getElementById(`details-${id}`)
  details.style.display = 'block'
}
