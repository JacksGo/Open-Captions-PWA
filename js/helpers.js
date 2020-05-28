let global_test = null;

class customGrammarList {
  constructor(...items) {
    this.list = items;
    this.name = 'custom';
  }
  append(...items) {
    this.list.push(...items);
  }
  toString() {
    return `#JSGF V1.0; grammar ${this.name}; public <${this.name}> = ${this.list.join(" | ")} ;`
  }
  toGrammarList() {
    let grammarList = new webkitSpeechGrammarList();
    grammarList.addFromString(this.toString(), 1);
    return grammarList;
  }
}

class speechResultsDOMManager {
  #results = []; // {{transcript, confidence, isFinal}
  #DOMList = [];
  #containerElem = null;
  
  constructor() {
    // Initialize the container DOM object.
    this.#containerElem = document.createElement("div");
    this.#containerElem.setAttribute("id", "subtitles");
    
    // Freezing the DOM object won't do much, but hey, why not be thorough?
    Object.freeze(this.#containerElem); 
  }
  
  get element() {
    return this.#containerElem;
  }
  
  set(index, result) {
    // If the specified index doesn't exist...
    if (index > this.#results.length-1) {
      
      // A new subtitle element will be created.
      const newLine = document.createElement("div");
      newLine.classList.add("sub");
      
      // Add the line data to the DOM element list.
      this.#DOMList[index] = newLine;
      
      // The length of the DOMList and the results list are the same.
      // Do not get an element by its position in the DOM, because this could be inaccurate.
      this.#containerElem.appendChild(newLine);
    }
    
    // Flatten out the SpeechRecognitionResult object and store it.
    // console.log(result);
    global_test = result;
    this.#results[index] = {transcript: result[0].transcript.trim(), confidence: result[0].confidence, isFinal: result.isFinal};
    
    // Set the text of the current line.
    this.#DOMList[index].textContent = this.#results[index].transcript;
    
    // Make interim results slightly transparent. 
    if (this.#results[index].isFinal) {
      this.#DOMList[index].classList.remove("prelim");
    } else {
      this.#DOMList[index].classList.add("prelim");
    }
  }
}

// Find the nearest space to the 50-character mark of a string, or return 50.
// Note: This could be suboptimal for strings of "short lo...ong", where |...| ~> 50, ' ' ∉ (...).
function getLineEndingPoint(str) {
  let unsigned = new Uint8Array(1);
  unsigned[0] = str.slice(0, 50).lastIndexOf(" ");
  return Math.min(unsigned[0], 50);
}

// Split string into segments of <=50 characters, along spaces where possible.
function splitStringToLines(str) {
  let arr = [];
  let rem = str;
  while (rem.length > 50) {
    let index = getLineEndingPoint(rem);
    arr.push(rem.slice(0, index));
    rem = rem.slice(index).trimStart();
  }
  arr.push(rem);
  return arr;
}