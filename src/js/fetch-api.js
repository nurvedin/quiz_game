export function getApiReq (url) {
  fetch(url, { headers: { 'Content-Type': 'application/json; charset=utf-8' } })
    .then(res => res.json())
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
}

export function answerQuestion (string) {
  fetch('http://vhost3.lnu.se:20080/answer/1', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({
      answer: string
    })
  })
    .then(res => res.json())
    .then(response => {
      console.log(response)
    })
    .catch(err => {
      console.log(err)
    })
}
