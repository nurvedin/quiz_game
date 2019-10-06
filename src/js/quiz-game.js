import { getQuestion } from './fetch-api.js'

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
      error.remove()
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
  const child = document.querySelector('#welcome-div')
  const welcomeMessage = document.createElement('h2')
  const h2 = document.createTextNode(`Welcome ${nicknameField.value}, Lets play!`)
  welcomeMessage.appendChild(h2)
  nicknameArea.insertBefore(welcomeMessage, child)
  const quizArea = document.querySelector('#quiz-area')
  quizArea.appendChild(document.querySelector('#welcome').content.cloneNode(true))
  const button = document.querySelector('#play-button')
  // const url = 'http://vhost3.lnu.se:20080/question/1'
  button.addEventListener('click', event => {
    const question = getQuestion('http://vhost3.lnu.se:20080/question/1')
    question
      .then(data => {
        typeOfQuestion(data)
      }
      )
  }, true)
}

export function showResults () {

}

function typeOfQuestion (question) {
  console.log(question)
  if (typeof question.alternatives !== 'undefined') {
    console.log('radio')
  } else {
    addInputType(question)
  }
}

function addInputType () {
  const answerArea = document.querySelector('#answer-input')
  const input = document.createElement('INPUT')
  input.setAttribute('type', 'text')
  answerArea.appendChild(input)

  const button = document.createElement('BUTTON')
  button.setAttribute('class', 'btn')
  button.innerHTML = 'Check answer'
  answerArea.appendChild(button)

  button.addEventListener('click', event => {

  })



}
