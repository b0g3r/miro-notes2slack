// show preview
// add slack webhook url input
// add "send button"
// send selected to slack
// disable button if none selected or webhook url is empty

async function showPreview() {
  clear()
  const stickersAsText = convertToText(await getStickers())
  getContainer().appendChild(createPreview('by Type', 'Looks like the selection is empty.', stickersAsText))
}

/**
 *
 * @returns {Promise<SDK.IStickerWidget[]>}
 */
async function getStickers() {
  const selection = await miro.board.selection.get()
  return selection.filter(item => item.type.toLowerCase() === 'sticker')
}

/**
 *
 * @param {Array<SDK.IStickerWidget>} stickers
 * @returns {Promise<string>}
 */
function convertToText(stickers) {
  let text = ''
  stickers.forEach(sticker => {
    console.log(sticker.text)
    let plainText = sticker.text.replaceAll('<p>', '')
    console.log(plainText)
    plainText = plainText.replaceAll(/<\/p>|<br>|<br \/>/gm, '\n')
    console.log(plainText)
    text += plainText
    text += '-------\n'
  })
  return text
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

function createPreview(title, emptyText, stickersAsText) {

  const statView = document.createElement('div')
  statView.className = 'preview-list__table'

  const titleView = document.createElement('div')
  titleView.className = 'preview-list__title'
  titleView.innerHTML = stickersAsText.length === 0 ? '<span>Select some stickers</span>' : '<span>Stickers to send</span>'
  statView.appendChild(titleView)

  const itemView = document.createElement('textarea')
  itemView.className = 'preview-list__item'
  console.log(stickersAsText)
  itemView.value = stickersAsText
  statView.appendChild(itemView)
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
