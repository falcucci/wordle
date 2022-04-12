import prompts  from 'prompts'
import { readFileSync } from 'fs'

const log: any = console.log

const Reset = "\x1b[0m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

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
  './static/allwords.txt',
  'utf-8'
).split("\n")

const autoCompleteWords: any = words.map((word:any) => {
  return { title: word, value: word }
})

const answers: string[] = readFileSync(
  './static/answers.txt',
  'utf-8'
).split("\n")

const answer: any = answers[random(answers.length)]

const selectChoices: any = [
  {
    title: 'VERY EASY',
    description: 'easy mode but using autocomplete :)',
    value: 'VERYEASY'
  },
  {
    title: 'EASY',
    description: 'initialize a game, in normal mode',
    value: 'EASY'
  },
  {
    title: 'HARD',
    description: 'initialize a game, in hard mode',
    value: 'HARD'
  },
  {
    title: 'STAT',
    value: 'print some statistics',
    disabled: true
  },
  {
    title: 'HELP',
    description: 'print the list of commands and their description',
    value: 'HELP',
    disabled: true
  },
  {
    title: 'QUIT',
    description: 'exit the game',
    value: 'QUIT'
  },
]

/**
 * [TODO:description]
 *
 * @param {any} keys - [TODO:description]
 * @returns {[TODO:type]} [TODO:description]
 */
const keyboardBuilder: any = (keys:any) => {
  // formats the key with the color
  const lettersArray: any = Object.keys(keys)
  const lettersArrayFulfilled: any = []
  lettersArray.map((letter:any) => {
    lettersArrayFulfilled.push(
      `${keys[letter].color} ${letter} ${Reset}`
    )
  })

  const divider: any = '| ' + '-'.repeat(57) + ' |'

  log(divider)
  const firstRow: any =
    lettersArrayFulfilled.slice(
      0,
      lettersArray.indexOf('A')
    )
  log('|', firstRow.join(' | '), '|')

  const secondRow: any =
    lettersArrayFulfilled.slice(
      lettersArray.indexOf('A'),
      lettersArray.indexOf('X')
    )

  log(divider)
  log('|', secondRow.join(' | '), '|')
  log(divider)

  const thirdRow: any =
    lettersArrayFulfilled.slice(
      lettersArray.indexOf('Z')
    )
  log('|        |', thirdRow.join(' | '), '|        |')
  log('|', '-'.repeat(57), '|')
}

const options: any = {
  QUIT: "QUIT",
  VERYEASY: "VERYEASY",
  EASY: "EASY",
  HARD: "HARD",
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
    choices: selectChoices,
    initial: 2
  })

  option = select.value

  while (option !== options.QUIT) {

    switch (option) {
      case options.VERYEASY:
        await wordle(options.VERYEASY)
        break
      case options.EASY:
        await wordle(options.EASY)
        break
      case options.HARD:
        await wordle(options.HARD)
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
  }
}

const wordle: any = async function (level: string) {
  const input: any = await prompts(getInput(level))

  if (Object.values(options).includes(input.value)) {
    option = input.value
    return
  }

  const text: any = input.value
  const wordIsValid = words.includes(text) || Object.values(options).includes(text)

  if (!wordIsValid) {
    console.log(`${BgRed}Please type a valid word.${Reset}`);
    await wordle(option)
    return
  }

  console.clear()

  log('answer: ', answer);
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

  log(divider)
  for (let i = 0, len = 6; i < len; i++) {
    const wordArray: any = history[i]
    let row: any = emptyRow
    if (wordArray) {
      row = ` | ${wordArray.join(' | ')} |`
    }
    log(row)
    log(divider)
  }

  log('\n');

  keyboardBuilder(keyboardDict) 
}


/**
 * [TODO:description]
 *
 * @param {any} option - [TODO:description]
 * @returns {[TODO:type]} [TODO:description]
 */
const getInput: any = (option:any) => {
  return {
    [options.VERYEASY]: [{
      type: 'autocomplete',
      name: 'value',
      message: 'Pick up your word to guess',
      choices: [...autoCompleteOptions, ...autoCompleteWords]
    }],
    [options.EASY]: [{
      type: 'text',
      name: 'value',
      message: 'Your guess?',
      validate: (value:any) => (
        !words.includes(value) &&
          !Object.values(options).includes(value)
          ? `${value} is not a valid word.`
          : true
      ) 
    }],
    [options.HARD]: [{
      type: 'text',
      name: 'value',
      message: 'Your guess?',
      validate: (value:any) => (
        !words.includes(value) &&
          !Object.values(options).includes(value)
          ? `${value} is not a valid word.`
          : true
      ) 
    }]
  }[option]
}

run()
