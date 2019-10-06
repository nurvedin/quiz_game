// import { getApiReq } from './fetch-api'

export function addNickName () {
  const nicknameArea = document.querySelector('#quiz-area')
  nicknameArea.appendChild(document.querySelector('#nickname-area').content.cloneNode(true))
  const nicknameField = nicknameArea.querySelector('input')
  const button = document.querySelector('#nickname-button')
  const error = document.createElement('h2')
  const h2 = document.createTextNode('Error! Please enter a nickname')
  error.appendChild(h2)
  const element = document.querySelector('#quiz-area')
  const child = document.querySelector('#nickname-div')
  button.addEventListener('click', event => {
    if (nicknameField.value.length === 0) {
      element.insertBefore(error, child)
    } else {
      button.parentElement.innerHTML = ''
      startGame(nicknameField, nicknameArea)
    }
  })
}

/*
export function errorMessage () {
  const error = document.querySelector('#error')
  error.appendChild()
}
*/

export function startGame (nicknameField, nicknameArea) {
  const welcomeMessage = document.createElement('h2')
  const child = document.querySelector('#welcome-div')
  const h2 = document.createTextNode(`Welcome ${nicknameField.value}, Lets play!`)
  welcomeMessage.appendChild(h2)
  nicknameArea.insertBefore(welcomeMessage, child)
  const button = document.querySelector('#play-button')
  // const url = 'http://vhost3.lnu.se:20080/question/1'
  button.addEventListener('click', event => {
    // getApiReq()
    console.log('Play')
  })
}

export function showResults () {

}
