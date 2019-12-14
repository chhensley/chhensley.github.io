/**
 * Copyright 2019
 * Do as thou wilt shall be the whole of the License.
 * Love is the License, love under will.
 */

var worker = new Worker('app/worker.js')

//Retrieve configuration info
var manifest = getJson('app/manifest.json')
var config = getJson('app/' + manifest.config)

//Intialize simulated terminal
var term = new ROT.Display
term.setOptions(config.terminal);

//Initialize input
var inputLock = false

document.body.onload = function() {
  document.getElementById('term').appendChild(term.getContainer())
}

worker.onmessage = function(e) {
  if (e.data.id == 'term_refresh') {
    refreshTerm(e.data.body)
  } else if (e.data.id = 'input_unlock') {
    inputLock = false
  }
}

/**
 * Draws a 2-dimensional array of tile objects to the terminal
 * @param {object[][]} map 
 */
function refreshTerm(map) {
  term.clear()
  for(var x = 0; x < config.terminal.width; x++) {
    for (var y = 0; y < config.terminal.height; y++) {
      if (map[x][y].char) {
        term.draw(x, y, map[x][y].char, map[x][y].color)
      }
    }
  }
}

function keyInput(key) {
  if(!inputLock) {
    inputLock = true;
    worker.postMessage({id: 'keypress', body: key})
  }
}

window.addEventListener('keyup', function(e){
  keyInput(e.key)
}, false);

document.getElementById('up').addEventListener('click', function(e){
  keyInput('w')
}, false)

document.getElementById('down').addEventListener('click', function(e){
  keyInput('s')
}, false)

document.getElementById('left').addEventListener('click', function(e){
  keyInput('a')
}, false)

document.getElementById('right').addEventListener('click', function(e){
  keyInput('d')
}, false)