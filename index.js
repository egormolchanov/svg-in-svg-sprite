const fs = require('fs')
const path = require('path')

console.log('\x1b[35m%s\x1b[0m', 'view commands <node index.js --help>')

if (process.argv[2] === '--help') {
  console.log('drag the file to the svg folder')
  console.log('start <node index.js nameFile>')
  console.log('start and rename <node index.js nameFile newNameFile>')
  console.log('questions https://github.com/egormolchanov')
  return
}

if (!process.argv[2]) return

fs.readFile(
  path.join(__dirname, `${process.argv[2]}.svg`), 'utf-8', 
  (error, data) => {
    if (error) throw Error('\x1b[31mfile not found\x1b[0m')

    const style = {}
    let newSvg = data

    const searchClass = () => {

      let key, value

      let cls = filterStyle.slice(filterStyle.search('.') + 1, filterStyle.search('{'))
      let cut = filterStyle.slice(0, filterStyle.search('{') + 1)
      filterStyle = filterStyle.replace(cut, '')
      style[cls] = {}

      const searchStyle = () => {
        key = filterStyle.slice(0, filterStyle.search(':'))
        value = filterStyle.slice(filterStyle.search(':') + 1, filterStyle.search(';'))

        style[cls][key] = value

        if (filterStyle[filterStyle.search(';') + 1] === '}' ) {
          cut = filterStyle.slice(0, filterStyle.search(';') + 2)
          filterStyle = filterStyle.replace(cut, '')

        } else {
          cut = filterStyle.slice(0, filterStyle.search(';') + 1)
          filterStyle = filterStyle.replace(cut, '')
          searchStyle()
        }
      }

      searchStyle()

      if (!!filterStyle.length) searchClass()
    }

    let minData = data.replace(/\s+/g, '').trim()

    const startStyele = minData.slice(minData.search('<style')).slice(minData.slice(minData.search('<style')).search('>') + 1)
    const stateStyle = startStyele.slice(0, startStyele.search('</style'))
    if (!stateStyle.length) throw Error('\x1b[31mThe file does not contain <style>\x1b[0m')

    let filterStyle = stateStyle.slice()

    searchClass()
  
    const cutStyle = () => {
      const startStyele = newSvg.slice(newSvg.search('<style')).slice(newSvg.slice(newSvg.search('<style')).search('>') + 1)
      const cut = startStyele.slice(0, startStyele.search('</style'))
      newSvg = newSvg.replace(cut, '')
    }

    cutStyle()

    const changeClass = () => {
      let startClass = newSvg.slice(newSvg.search('class="'))
      let startNameClass = newSvg.slice(newSvg.search('class="') + 'class="'.length)
      let className = startNameClass.slice(0, startNameClass.search('"')).split(' ')
      let cut = startClass.slice(0, startClass.search(className.join(' ')) + className.join(' ').length + 1)

      let addAttr = ''

      className.forEach(el => {
        for (let key in style[el]) {
          addAttr += `${key}="${style[el][key]}" `
        }
      })

      newSvg = newSvg.replace(cut, addAttr)

      if (newSvg.includes('class="')) changeClass()
    }

    changeClass()

    fs.writeFile(
      path.join(__dirname, `${process.argv[2]}.svg`), newSvg, error => {
        if (error) throw error
        console.log('\x1b[32m%s\x1b[0m', 'Done! 😀😀😀');
      }
      
    )

    if (!!process.argv[3]) {
      fs.rename(
        path.join(__dirname, `${process.argv[2]}.svg`),
        path.join(__dirname, `${process.argv[3]}.svg`),
        err => {
          if (err) throw err
      
          console.log('\x1b[35m%s\x1b[0m', `File renamed in ${process.argv[3]}.svg`)
        }
      )
    }
  }
)
