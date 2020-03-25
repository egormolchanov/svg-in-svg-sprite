const fs = require('fs')
const path = require('path')

console.log('\x1b[35m%s\x1b[0m', 'view commands <node index.js --help>')

if (process.argv[2] === '--help') {
  console.log('Move the file "index.js " to the folder where you store images in svg format')
  console.log('<node index.js nameFile>                running the script by image name')
  console.log('<node index.js nameFile newNameFile>    running the script by image name and renaming it')
  console.log('<node index.js --all>                   running the script for all images')
  console.log('questions https://github.com/egormolchanov')
  return
}

if (!process.argv[2]) return

const changeFile = fileName => {
  fs.readFile(
    path.join(__dirname, `${fileName}.svg`), 'utf-8', 
    (error, data) => {
      if (error) throw Error('\x1b[31mfile not found\x1b[0m')
  
      const style = {}
      let newSvg = data
  
      //minification of code
      let minData = data.replace(/\s+/g, '').trim()

      //remove Title and metadata
      const title = data.slice(data.search('<title>'), data.search('</title>') + '</title>'.length)
      const metadata = data.slice(data.search('<metadata>'), data.search('</metadata>') + '</metadata>'.length)
      const xml = data.slice(0, data.search('<svg'))
      newSvg = newSvg.replace(title, '').replace(metadata, '').replace(xml, '')

      fs.writeFile(
        path.join(__dirname, `${fileName}.svg`), newSvg, error => {
          if (error) throw error

          if (title.length) console.log('\x1b[32m%s\x1b[0m', `The "title" was deleted in file: ${fileName}`);
          if (metadata.length || xml.length) console.log('\x1b[32m%s\x1b[0m', `The "metadata" was deleted in file: ${fileName}`);


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

          //search for styles
          const startStyele = minData.slice(minData.search('<style')).slice(minData.slice(minData.search('<style')).search('>') + 1)
          const stateStyle = startStyele.slice(0, startStyele.search('</style'))
          
          if (!stateStyle.length) {
            console.log(`\x1b[31mThe file: ${fileName}. Does not contain <style>\x1b[0m`)
            return
          }
      
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
            path.join(__dirname, `${fileName}.svg`), newSvg, error => {
              if (error) throw error
              console.log('\x1b[32m%s\x1b[0m', `Done! 😀😀😀 file: ${fileName}`);

              if (!!process.argv[3] && fileName !== '--all') {
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
        }
      )
    }
  )
}

if (process.argv[2] === '--all') {

  fs.readdir(__dirname, function(error, items) {
    if (error) throw Error('\x1b[31msomething went wrong\x1b[0m')
 
    const listName = items.filter(el => el.search('.svg') !== -1).join(' ').replace(/.svg/g, '').split(' ')
    listName.forEach(el => {
      changeFile(el)
    })
})
  return
}

changeFile(process.argv[2])