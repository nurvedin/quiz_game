let downloadTimer
let countdown
let totalTime
let timeInput = 0
let timeRadio = 0

// object to hold user info, uuid is a unique random identifier if we use users with the same name
const userInfo = {
  uuid: Math.random().toString(36).substr(2, 5),
  name: null,
  highscore: null
}
// function for adding nick name, input field and a button
// Event listener on the play button to get the first question in the API
export function addNickName () {
  const nicknameArea = document.querySelector('#quiz-area')
  nicknameArea.appendChild(document.querySelector('#nickname-area').content.cloneNode(true))
  const nicknameField = nicknameArea.querySelector('input')
  const button = document.querySelector('#nickname-button')
  const error = document.createElement('h2')
  const h2 = document.createTextNode('Error! Please enter a nickname')
  error.appendChild(h2)
  const child = document.querySelector('#nickname-div')

  button.addEventListener('click', event => {
    if (nicknameField.value.length === 0) {
      nicknameArea.insertBefore(error, child)
    } else {
      error.remove()
      button.parentElement.innerHTML = ''
      const child = document.querySelector('#welcome')
      const welcomeMessage = document.createElement('h2')
      const h2 = document.createTextNode(`Welcome ${nicknameField.value}, Lets play!`)
      welcomeMessage.appendChild(h2)
      nicknameArea.insertBefore(welcomeMessage, child)

      userInfo.name = nicknameField.value

      const quizArea = document.querySelector('#quiz-area')
      quizArea.appendChild(document.querySelector('#welcome').content.cloneNode(true))
      const playButton = document.querySelector('#play-button')
      playButton.addEventListener('click', event => {
        welcomeMessage.remove()
        playButton.remove()
        quizArea.appendChild(document.querySelector('#question-area').content.cloneNode(true))
        const question = getQuestion('http://vhost3.lnu.se:20080/question/1')
        question
          .then(data => {
            addQuestion(data)
          }
          )
      }, true)
    }
  })
}

// function for adding the questions in 'p' elements
function addQuestion (question, nicknameArea) {
  setTimeout(true)
  const questionArea = document.querySelector('#question')
  const addQ = document.createElement('p')
  addQ.innerText = question.question
  questionArea.appendChild(addQ)
  typeOfQuestion(question)
  countdown = 20
}

// checking the answer, either correct, got all the answers right (endgame) or wrong answer
function checkAnswer (question, val) {
  const answer = answerQuestion(question.nextURL, val)
  answer
    .then(data => {
      if (data.message === 'Correct answer!') {
        cleanUp()
        if (typeof data.nextURL === 'undefined') {
          endGame()
        }
        if (typeof data.nextURL === 'string') {
          addNewQuestion(data.nextURL)
        }
      } else {
        gameOver()
      }
    })
}

function gameOver () {
  const gameOver = document.querySelector('#quiz-area')
  gameOver.innerText = 'Game Over!'
}

// get the question, function that uses the fetch API. GET is the default method for fetch API.
const getQuestion = async (url) => {
  const response = await window.fetch(url)
  const data = await response.json()
  return data
}

// function to get the next question
function addNewQuestion (nexURL) {
  const question = getQuestion(nexURL)
  question
    .then(data =>
      addQuestion(data)
    )
}

// little clean up function to clear the question if the question was correctly answered
function cleanUp () {
  countdown = 20
  const questionAreaParagraph = document.querySelector('#question')
  questionAreaParagraph.innerHTML = ''
}

// timer function that decrements from 20 seconds
function setTimeout () {
  downloadTimer = setInterval(() => {
    if (countdown >= 1) {
      countdown--
    }
    const timer = document.querySelector('#countdown-timer')
    timer.innerText = `Time left: ${countdown} sec`
    if (countdown === 0) {
      gameOver()
      clearInterval(downloadTimer)
    }
  }, 1000)
}

function typeOfQuestion (question) {
  if (typeof question.alternatives !== 'undefined') {
    radioBtn(question)
  } else {
    addInputType(question)
  }
}

// creating radio buttons when getting that type of question
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
  button.setAttribute('id', 'btn')
  button.innerText = 'Check answer'
  answerArea.appendChild(button)

  for (let i = 0, length = radios.length; i < length; i++) {
    radios[i].onclick = function (e) {
      const val = this.value
      button.addEventListener('click', () => {
        clearInterval(downloadTimer)
        checkAnswer(question, val)
        timeRadio += (20 - countdown)
        button.remove()
        div.remove()
      }, true)
    }
  }
}

// creating input field for that type of question
function addInputType (question) {
  const answerArea = document.querySelector('#quiz-area')
  const input = document.createElement('INPUT')
  const breakLine = document.createElement('br')
  input.setAttribute('type', 'text')
  input.setAttribute('id', 'input')
  answerArea.appendChild(input)
  answerArea.appendChild(breakLine)
  const button = document.createElement('BUTTON')
  button.setAttribute('id', 'btn')
  button.innerText = 'Check answer'
  answerArea.appendChild(button)
  button.addEventListener('click', event => {
    if (input.value !== '') {
      clearInterval(downloadTimer)
      checkAnswer(question, input.value)
      timeInput += (20 - countdown)
      button.remove()
      input.remove()
    }
  }, true)
}

// arrow function for posting the answer, or sending with POST to check answer
const answerQuestion = async (nextUrl, string) => {
  const url = nextUrl
  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      answer: string
    })
  }
  try {
    const fetchResponse = await window.fetch(url, settings)
    const data = await fetchResponse.json()
    return data
  } catch (e) {
    return e
  }
}

// function for when all the answers are correctly answered and where i create the localstorage
// where the top 5 highscores are being calculated and displayed
function endGame () {
  const divArea = document.querySelector('#quiz-area')
  const userInfoItem = localStorage.getItem('user info')

  totalTime = timeInput + timeRadio
  userInfo.highscore = totalTime
  let itemArr = []
  if (userInfoItem) {
    itemArr = JSON.parse(userInfoItem)
  }

  itemArr.push(userInfo)
  localStorage.setItem('user info', JSON.stringify(itemArr))

  itemArr.find(x => {
    if (x.uuid === userInfo.uuid) {
      x.highscore = totalTime
    }
  })

  localStorage.setItem('user info', JSON.stringify(itemArr))
  const questionArea = document.querySelector('#highscore')
  const highscore = document.createElement('p')
  highscore.innerText = `${userInfo.name} : ${userInfo.highscore} sec`
  questionArea.appendChild(highscore)

  const returnFastestScore = itemArr.sort((a, b) => parseFloat(a.highscore) - parseFloat(b.highscore))
  returnFastestScore
    .filter((i, index) => (index < 5))
    .map((user, index) => {
      const scoreNode = document.createElement('p')
      scoreNode.innerHTML =
        `<strong>Name: </strong>${user.name}<br>
        <strong>Highscore: </strong>${user.highscore} sec`

      divArea.appendChild(scoreNode)
    })
}
