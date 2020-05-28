let resultsManager = null;
const recognition = new webkitSpeechRecognition();

let is_stopped = true;

function processResults(e) {
  // console.log(e);
  // Keep our own list of past results.
  // This will allow us to animate old subtitles rolling off the top.
  resultsManager.set(e.resultIndex, e.results[e.resultIndex]);
}

function startRecognition() {
  resultsManager = new speechResultsDOMManager();
  document.getElementById("subtitles").replaceWith(resultsManager.element);
  recognition.start();
}

// let customList = new customGrammarList(["bruh"]).toGrammarList();
// recognition.grammars = customList;

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
recognition.addEventListener("result", processResults);
recognition.addEventListener("start", function() { is_stopped = false; });
recognition.addEventListener("end", function() { is_stopped = true; });

startRecognition();

/*window.addEventListener("click", function(){
  if (is_stopped) {
    startRecognition();
  }
});*/