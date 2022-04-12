// these are the two libraries we need
import prompt from 'prompt-sync'
import prompts  from 'prompts'
import { readFileSync } from 'fs'

// these are some codes to get the console to print in colors
// see examples below
const Reset = "\x1b[0m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

const input:any = prompt();

// QWERT keys
const qwert: any =
  'q w e r t y u i o p a s d f g h j k l z x c v b n m';

const keyboardDict: any  = {}
qwert.split(' ').map((letter:any) => {
  return keyboardDict[ letter.toUpperCase() ] = { color: Reset }
})

const random = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1))
};

const words: string[] = readFileSync(
  'allwords.txt',
  'utf-8'
).split("\n")

const autoCompleteWords: any = words.map((word:any) => {
  return { title: word, value: word }
})

const answers: string[] = readFileSync(
  'answers.txt',
  'utf-8'
).split("\n")

const answer: any = answers[random(answers.length)]

const keyboardBuilder: any = (keys:any) => {
  // formats the key with the color
  const lettersArray: any = Object.keys(keys)
  const lettersArrayFulfilled: any = []
  lettersArray.map((letter:any) => {
    lettersArrayFulfilled.push(
      `${keys[letter].color} ${letter} ${Reset}`
    )
    return true
  })


  console.log('|', '-'.repeat(57), '|')
  const firstRow: any =
    lettersArrayFulfilled.slice(
      0,
      lettersArray.indexOf('A')
    )
  console.log('|', firstRow.join(' | '), '|')

  const secondRow: any =
    lettersArrayFulfilled.slice(
      lettersArray.indexOf('A'),
      lettersArray.indexOf('X')
    )

  console.log('|', '-'.repeat(57), '|')
  console.log('|', secondRow.join(' | '), '|')
  console.log('|', '-'.repeat(57), '|')

  const thirdRow: any =
    lettersArrayFulfilled.slice(
      lettersArray.indexOf('Z')
    )
  console.log('|        |', thirdRow.join(' | '), '|        |')
  console.log('|', '-'.repeat(57), '|')
}


const options: any = {
  QUIT: "QUIT",
  HARD: "HARD",
  EASY: "EASY",
  STAT: "STAT",
  HELP: "HELP"
}

let option: string = ""

const autoCompleteOptions: any =
  Object.values(options).map((option:any) => {
  return { title: option, value: option }
})

const history: any = []

const run: any = async () => {
  const select: any = await prompts({
    type: 'select',
    name: 'value',
    message: 'Available commands:',
    choices: [
      { title: 'QUIT', description: 'exit the game', value: 'QUIT' },
      { title: 'HELP', description: 'print the list of commands and their description', value: 'HELP' },
      { title: 'HARD', value: 'restart a game, in hard mode', disabled: true },
      { title: 'EASY', value: 'restart a game, in normal mode', disabled: true },
      { title: 'STAT', value: 'print some statistics', disabled: true },
    ],
    initial: 1
  })

  option = select.value
  // if (Object.values(options).includes(text)) {
  // }

  while (option !== options.QUIT) {

    // const input: any = await prompts({
    //   type: 'text',
    //   name: 'value',
    //   initial: 'HELP',
    //   message: 'Your guess?',
    //   validate: value => (
    //     !words.includes(value) && !Object.values(options).includes(value)
    //       ? `${value} is not a valid word.`
    //       : true
    //   )
    // });
    const input: any = await prompts({
      type: 'autocomplete',
      name: 'value',
      message: 'Pick up your word to guess',
      choices: [...autoCompleteOptions, ...autoCompleteWords],
      validate: value => (
        !words.includes(value) && !Object.values(options).includes(value)
          ? `${value} is not a valid word.`
          : true
      ),
    })

    if (Object.values(options).includes(input.value)) {
      option = input.value
    }

    console.clear()

    const text: any = input.value

    switch (option) {
      case options.EASY:
        break
      case options.HARD:
        break
      case options.STAT:
        break
      case options.HELP:
        break
      case options.QUIT:
        break
      default:
        break
    }

    const wordIsValid = words.includes(text)
    // const answer: any = "aotrr"
    console.log('answer: ', answer);
    const answerLetters: any = answer.split('')
    const guessLetters: any = text.split('')

    const rowDict: any = {}
    guessLetters.map((letter:any, index:any) => {
      return rowDict[ parseInt(index) ] = {
        value: letter,
        color: BgWhite
      }
    })

    const rowFulfilled: any = []
    Object.values(rowDict).map((item:any, index:any) => {
      const value: any = item.value
      const has: any = answerLetters.includes(item.value)
      const guessedLetter: any = answerLetters[index]
      const samePosition: any = has && guessedLetter === item.value
      if (has) {
        rowDict[index].color = BgYellow
        keyboardDict[value.toUpperCase()].color = BgYellow
      } else {
        keyboardDict[value.toUpperCase()].color = BgWhite
      }

      if (samePosition) {
        rowDict[index].color = BgGreen
        keyboardDict[value.toUpperCase()].color = BgGreen
      }

      rowFulfilled.push(
        `${item.color} ${item.value} ${Reset}`
      )
    })

    history.push(rowFulfilled)
    const divider: any = ` | ---`.repeat(5) + ' |'
    const emptyRow: any = ' |    '.repeat(5) + ' |' 

    console.log(divider)
    for (let i = 0, len = 6; i < len; i++) {
      const wordArray: any = history[i]
      let row: any = emptyRow
      if (wordArray) {
        row = ` | ${wordArray.join(' | ')} |`
      }
      console.log(row)
      console.log(divider)
    }

    console.log('\n');

    keyboardBuilder(keyboardDict) 
  }
}

run()
