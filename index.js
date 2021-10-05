const fs = require('fs/promises')

const relativeFilePath = 'atividades.json'

/* função que retorna uma Promise onde é executada uma operação
assíncrona no parâmetro dado */
function whatev(activity) {
  return new Promise((resolve, reject) => {
    const demora = Math.round(Math.random()*2000)
    setTimeout(
      () => {
        if (demora < 1500) {
          console.log(activity.title + ' ' + demora + 'ms')
          resolve()
        } else {
          reject(activity.title + ' demorou muito: ' + demora + 'ms')
        }
      }, 
      demora
    )
  })
}

/* função reducer que assume que o accumulator é uma Promise. Encadeia-se um 
then que aguardará a resolução dessa Promise e retornará outra Promise recebendo
o item corrente do array.
*/
const reducer = (accumulator, currentItem) => {
  return accumulator.then(() => whatev(currentItem))
}

/* O conteúdo de um arquivo .json é parseado em um array. Depois executa-se, 
de forma ordenada e síncrona, uma função assíncrona em cada item do array.
*/
fs.readFile(relativeFilePath, { encoding: 'utf-8' })
  .then((stringContent) => {
    const jsonContent = JSON.parse(stringContent)
    const activities = jsonContent.calendar_events

    /* uma promise resolvida inicializará o acumulador do reduce */
    activities
      .reduce(reducer, Promise.resolve())
      .then(() => {
        console.log("TODAS RESOLVERAM")
      })
      .catch((error) => {
        console.log("ALGUMA REJEITOU")
        console.log(error)
      })
  })
  .catch((error) => {
    console.log(error)
  })
