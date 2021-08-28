// show preview
// add slack webhook url input
// add "send button"
// send selected to slack
// disable button if none selected or webhook url is empty

async function showPreview() {
  const selection = await miro.board.selection.get()
  clear()
  getContainer().appendChild(createPreview('by Type', 'Looks like the selection is empty.', selection))
}

function clear() {
  const elements = getContainer().getElementsByClassName('preview-list__table')
  for (let i = 0; i < elements.length; i++) {
    elements.item(i).remove()
  }
}

function getContainer() {
  return document.getElementById('notes-container')
}

function createPreview(title, emptyText, data) {
  // filter only stickers
  const stickers = data.filter(item => item.type.toLowerCase() === 'sticker')

  const statView = document.createElement('div')
  statView.className = 'preview-list__table'

  const titleView = document.createElement('div')
  titleView.className = 'preview-list__title'
  titleView.innerHTML = stickers.size === 0 ? '<span>Stickers to send</span>' : '<span>Select some stickers</span>'
  statView.appendChild(titleView)

  stickers.forEach(sticker => {
    let itemView = document.createElement('div')
    itemView.className = 'preview-list__item'
    itemView.innerHTML = `<span class="preview-list__item-value">${sticker}</span>`
    statView.appendChild(itemView)
  })
  return statView
}

function calcByType(widgets) {
  return countBy(widgets, (a) => a.type)
}

function countBy(list, keyGetter) {
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    const count = map.get(key)
    map.set(key, !count ? 1 : count + 1)
  })
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]))
}

miro.onReady(() => {
  miro.addListener('SELECTION_UPDATED', showPreview)
  showPreview()
})
