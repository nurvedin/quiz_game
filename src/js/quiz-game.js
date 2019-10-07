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
    radioBtn(question)
  } else {
    addInputType(question)
  }
}

function radioBtn (question) {
  const answerArea = document.querySelector('#item-type')
  const div = document.createElement('div')
  div.setAttribute('id', 'radio-section')

  Object.keys(question.alternatives).map(function (key) {
    const label = document.createElement('label')
    const input = document.createElement('INPUT')
    input.setAttribute('type', 'radio')
    input.setAttribute('name', 'radio-btn')
    input.setAttribute('value', key)
    label.appendChild(input)
    label.innerHTML += `${question.alternatives[key]}<br>`
    div.appendChild(label)
  })

  answerArea.appendChild(div)

  const radios = document.getElementsByName('radio-btn')
  const button = document.createElement('button')
  button.setAttribute('content', 'test content')
  button.setAttribute('class', 'btn')
  button.innerHTML = 'check answer'
  answerArea.appendChild(button)

  for (let i = 0, length = radios.length; i < length; i++) {
    radios[i].onclick = function (e) {
      const val = this.value
      button.addEventListener('click', () => {
        checkAnswer(question, val)
      }, false)
    }
  }
}

function addInputType (question) {
  const answerArea = document.querySelector('#answer-input')
  const input = document.createElement('INPUT')
  input.setAttribute('type', 'text')
  answerArea.appendChild(input)

  const button = document.createElement('BUTTON')
  button.setAttribute('class', 'btn')
  button.innerHTML = 'Check answer'
  answerArea.appendChild(button)

  button.addEventListener('click', event => {
    if (input.value !== '') {
      checkAnswer(question, input.value)
    }
  }, false)
}
