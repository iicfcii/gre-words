const jetpack = require("fs-jetpack");
const { app, ipcMain } = require("electron");

const WordsHistoryManager = function (win) {
  this.wordHistory = null;
  const NUM_LIST = 30;
  this.tempWordHistory = [];

  // Initialize all lists
  this.wordLists = [];
  for (let i = 0; i < NUM_LIST; i ++){
    if (i === 0){
      this.wordLists.push(new WordList(i+1,101,0));
      continue;
    }
    if (i === NUM_LIST-1){
      this.wordLists.push(new WordList(i+1,106,this.wordLists[i-1].startIndex+this.wordLists[i-1].numWords));
      continue;
    }

    this.wordLists.push(new WordList(i+1,101,this.wordLists[i-1].startIndex+this.wordLists[i-1].numWords));
  }

  const wordHistoryFile = 'words-history';
  const userDataDir = jetpack.cwd(app.getPath("userData"));
  const backupDir = userDataDir.cwd('backup');

  ipcMain.on('shuffle', (evt) => {
    this.shuffle();
    this.write(); // Save to file
  });

  ipcMain.on('reorder', (evt) => {
    this.reorder();
    this.write();
  });

  ipcMain.on('prioritize', (evt) => {
    this.prioritize();
    this.write();
  });

  ipcMain.on('reset', (evt) => {
    this.resetAllForgetTimes();
    this.write();
  });

  ipcMain.on('getHistory', (evt) => {
    win.webContents.send('history', this.tempWordHistory);
  });


  // Handle nextWord request
  ipcMain.on('nextWord', (evt, list, word, isForget) => {
    // Add to current word History
    this.tempWordHistory.unshift(word);
    // console.log(this.tempWordHistory);
    if (isForget){
      this.incrementForgetTimes(word);
      this.wordLists[list-1].addForgottenWord(word);
      // console.log(this.wordHistory);
    } else {
      this.wordLists[list-1].removeForgottenWord(word);
    }

    let w = this.wordLists[list-1].getNextWord(this.wordHistory);
    if (!w) {
      console.log('No more words for this list');
      this.write(); // Save list when finished
      win.webContents.send('word', null, null, null);
      return;
    }
    win.webContents.send('word', w, this.wordLists[list-1].nextWordIndex);
  });

  // Handle current word request
  ipcMain.on('currentWord', (evt, list) => {
    let w = this.wordLists[list-1].getCurrentWord(this.wordHistory);
    win.webContents.send('word', w, this.wordLists[list-1].nextWordIndex);
  });

  this.read = () => {
    try {
      this.wordHistory = userDataDir.read(wordHistoryFile, "json");
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    if (!this.wordHistory){
      console.log('No history found');
      const appDir = jetpack.cwd(app.getAppPath());
      this.wordHistory = appDir.read('./app/words/words-history-template', "json");
    }

    return this.wordHistory
  }

  this.write = () => {
    userDataDir.write(wordHistoryFile, this.wordHistory, { atomic: true });
    let d = new Date();
    let backupFile = wordHistoryFile + ' ' +
                     d.getFullYear()+ '-' +
                     (d.getMonth()+1)+ '-' +
                     d.getDate()+ '-' +
                     d.getHours()+ '-' +
                     d.getMinutes()+ '-' +
                     d.getSeconds();
    console.log(backupFile);
    // console.log(backupDir);

    backupDir.write(backupFile, this.wordHistory, { atomic: true });

  }

  this.incrementForgetTimes = (word) => {
    this.wordHistory.forEach((w) => {
      if (word.word === w.word){
        w.forgetTimes += 1;
        word.forgetTimes += 1;
      }
    });

    // console.log(this.wordHistory[0]);
  }

  this.reorder = () => {
    this.wordHistory.sort(function (a, b) {
      return a.word.localeCompare(b.word);
    });
    console.log(this.wordHistory);
  }

  this.prioritize = () => {
    let pWords = [];
    let words = this.wordHistory.slice(); // Copy the array before finishing
    // Loop backwards and splice
    for (let i = words.length-1; i >= 0; i --){
      if (words[i].forgetTimes >= 4){
        pWords.unshift(words[i]);
        words.splice(i, 1);
      }
    }
    let newWordHistory = pWords.concat(words);
    console.log(newWordHistory.length);
    console.log(newWordHistory);
    this.wordHistory = newWordHistory;
  }

  this.resetAllForgetTimes = () => {
    this.wordHistory.forEach((wh) => {
      wh.forgetTimes = 0;
    });
    console.log(this.wordHistory);
  }

  this.shuffle = () => {
    if (!this.wordHistory){
      return;
    }

    let newWordHistory = [];
    let currentWordHistory = this.wordHistory.slice(); // Copy the array before finishing
    let times = currentWordHistory.length;
    for (let i = 0; i < times; i ++){
      let index = Math.floor(Math.random() * Math.floor(currentWordHistory.length));
      newWordHistory.push(currentWordHistory.splice(index,1)[0]); // add only the element
    }

    // console.log(this.wordHistory.length);
    // console.log(newWordHistory.length);
    console.log(newWordHistory);
    // Check again
    if (newWordHistory.length === this.wordHistory.length){
      this.wordHistory = newWordHistory;
      console.log('Shuffled successful');
    } else {
      console.log('Shuffle failed');
    }

  }
}

// List class to keep track of word index
const WordList = function (list, numWords, startIndex) {
  this.list = list; // 1 - 30
  this.numWords = numWords;
  this.nextWordIndex = 0;
  this.forgottenWords = [];
  this.currentForgottenWord = null;
  this.startIndex = startIndex;
  this.isFinished = false;

  this.getCurrentWord = (wh) => {
    if (this.nextWordIndex <= this.numWords && this.nextWordIndex > 0 && !this.isFinished){
      // Return current word if list not finished
      return wh[this.startIndex + this.nextWordIndex-1];
    } else if (this.nextWordIndex === 0){
      // return next word if no current word yet
      return this.getNextWord(wh);
    } else {
      // If finished, return current forgotten word
      return this.currentForgottenWord;
    }
  }

  // Word history array as input
  this.getNextWord = (wh) => {
    if (!wh){
      return null;
    }

    if (this.nextWordIndex < this.numWords){
      let word = wh[this.startIndex + this.nextWordIndex];
      this.nextWordIndex += 1;
      return word;
    } else {
      console.log('Start forgotten words');
      this.isFinished = true;
      // Give forgotten words
      let word = this.forgottenWords.shift();
      this.currentForgottenWord = word; // if no forgotten, will reset to null
      return word;
    }
  }

  this.addForgottenWord = (w) => {
    this.forgottenWords.push(w); // Add to forgotten list
    // console.log(this.forgottenWords);
  }

  this.removeForgottenWord = (w) => {
    if (!w){
      return;
    }

    // If is remembered, remove from forgotten list if applicable
    let index = this.forgottenWords.indexOf(w);
    if (index > -1) {
      this.forgottenWords.splice(index, 1);
    }
  }
}

module.exports = {
  WordsHistoryManager: WordsHistoryManager,
}
