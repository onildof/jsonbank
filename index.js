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
  /* se vc fizer qualquer operação síncrona aqui, vai descobrir que o reducer a
  roda para todos os elementos do array muito antes de o then da sua primeira 
  execução ter a chance */
  return accumulator
    .then(() => {
      /* não faça nada aqui (ver *) */
      return whatev(currentItem)
    })
    /*
    .catch((error) => { 
      console.log(error + ' ' + currentItem.title)
      throw(error) 
    })

    Escrever um catch aqui vai formar um encadeamento de catches. Então se der erro
    na execução para um elemento, todos os catches dos elementos subsequentes serão
    processados:

    > node index.js

    Título 1 demorou muito: 1753ms Título 1
    Título 1 demorou muito: 1753ms Título 2
    Título 1 demorou muito: 1753ms Título 3
    ALGUMA REJEITOU
    Título 1 demorou muito: 1753ms

    Então é melhor não escrever catch aqui e deixar apenas o catch que vem depois
    do Array.prototype.reduce. Seria tentador deixar este catch para retornar o item
    do array (o item corrente) onde o erro aconteceu; mas é desnecessário, porque 
    pode-se retorná-lo no catch na definição da função que o recebe (whatev).

    * também é fundamental que neste then só se chame uma função dando o item corrente
    como parâmetro. Se vc tentar fazer qualquer outra operação antes dessa chamada,
    corre o risco dessa operação gerar um erro e você terminar sem saber em qual
    elemento do array o erro aconteceu.

    Em suma: a função reducer deve ser a mais simples possível.
    */
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
