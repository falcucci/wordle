import prompts  from 'prompts'
import { readFileSync } from 'fs'

const log: any = console.log
const clear: any = console.clear

const Reset = "\x1b[0m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\u001b[0m\u001b[7m"

const languageChoices: any = [
  { title: '🇧🇪  german', value: 'german', disabled: true },
  { title: '🇱🇷  english', value: 'english' },
  { title: '🇮🇹  italian', value: 'italian' },
  { title: '🇪🇸  spanish', value: 'spanish', disabled: true },
  { title: '🇧🇷  portuguese', value: 'portuguese', disabled: true }
]

const options: any = {
  EZ: "EZ",
  EASY: "EASY",
  HARD: "HARD",
  STAT: "STAT",
  HELP: "HELP",
  QUIT: "QUIT"
}

const autoCompleteOptions: any =
  Object.values(options).map((option:any) => {
  return { title: option, value: option }
})

const history: any = []

const statuses: any = {
  EMPTY: 'empty',
  FILLED: 'filled'
}

const selectChoices: any = [
  {
    title: 'EZ',
    description: 'easy mode but using autocomplete :)',
    value: 'EZ'
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

const qwert: any =
  'Q W E R T Y U I O P A S D F G H J K L Z X C V B N M';

const keyboardDict: any  = {}
qwert.split(' ').map((letter:any) => {
  return keyboardDict[ letter ] = { color: Reset }
})

const random = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1))
};

const formatArrayOfKeys: any = (keys: string[], keyboard:any) => {
  // formats the key with the default color
  const lettersArrayFulfilled: any = []
  keys.forEach((letter:any) => {
    lettersArrayFulfilled.push(
      `${keyboard[letter].color} ${letter} ${Reset}`
    )
  })
  return lettersArrayFulfilled
}

const getWords: any = (language:string, file:string) => {
  return readFileSync(
    `./static/${language}/${file}`,
    'utf-8'
  ).split("\n")            
}

const getAnswer: any = (language:string, file:string) => {
  const answers : string[] = getWords(language, file)
  return answers[random(answers.length)]
}

const getAutocompleteWords: any = (words:string[]) => {
  return words.map((word:any) => {
    return { title: word, value: word }
  })
}

const keyboardBuilder: any = (keys:any) => {
  // formats the key with the default color
  // do some refactor later
  const lettersArray: any = Object.keys(keys)
  const lettersArrayFulfilled: string[] =  formatArrayOfKeys(
    lettersArray,
    keys
  )

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

const run: any = async () => {
  const select: any = await prompts({
    type: 'select',
    name: 'value',
    message: '🌈 WORDLE 🌈',
    choices: selectChoices,
    initial: 0
  })

  const languages: any = await prompts({
    type: 'select',
    name: 'value',
    message: 'Preferred language 🌎',
    choices: languageChoices,
    initial: 1
  })

  const option: string = select.value
  const language: any = languages.value
  const words : string[] = getWords(language, 'words.txt')
  const answer: string = getAnswer(language, 'answers.txt')

  switch (option) {
    case options.EZ:
      await wordle(language, option, words, answer)
    break
    case options.EASY:
      await wordle(language, option, words, answer)
    break
    case options.HARD:
      await wordle(language, option, words, answer)
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

const wordle: any = async function (
  language: string,
  option: string,
  words: string[],
  answer: string
) {
  const autoCompleteWords: any = getAutocompleteWords(words)
  const input: any = await prompts(getInput(
    option,
    words,
    autoCompleteWords
  ))

  if (Object.values(options).includes(input.value)) {
    return
  }

  const text: any = input.value

  const wordIsValid = (
    (words.includes(text) && text.length === 5) ||
    Object.values(options).includes(text)
  )
  if (!wordIsValid) {
    console.log(`${BgRed}Please type a valid word.${Reset}`);
    return await wordle(
      language,
      option,
      words,
      answer
    )
  }

  clear()

  log('answer: ', answer);
  const answerLetters: any = answer.split('')
  const guessLetters: any = text.split('')

  const rowDict: any = {}
  guessLetters.forEach((letter:any, index:any) => {
    return rowDict[ parseInt(index) ] = {
      value: letter,
      color: BgWhite,
      status: statuses.EMPTY
    }
  })

  const rowFulfilled: any = []
  Object.values(rowDict).forEach((item:any, index:any) => {
    const value: any = item.value
    const guessedLetter: any = answerLetters[index]
    const has: any = answerLetters.includes(item.value)
    const samePosition: any = has && guessedLetter === item.value
    const repeatingAnswer: any = answerLetters.filter(
      (a:any) => a === item.value
    ).length > 1
    const repeatingGuessing: any = guessLetters.filter(
      (a:any) => a === item.value
    ).length > 1
    const position: any = answerLetters.indexOf(item.value)
    keyboardDict[value.toUpperCase()].color = BgWhite

    if (has) {
      rowDict[index].color = BgYellow
      rowDict[index].status = statuses.FILLED
      keyboardDict[value.toUpperCase()].color = BgYellow
    }

    const repeating: any = repeatingAnswer && repeatingGuessing
    const shouldFill: boolean = (
      has && rowDict[position].status === statuses.FILLED && !repeating
    )
    if (shouldFill) {
      rowDict[index].color = BgWhite
      rowDict[index].status = statuses.FILLED
    }

    if (samePosition) {
      rowDict[index].color = BgGreen
      rowDict[index].status = statuses.FILLED
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
  const chances: any = [...Array(6).keys()]
  chances.forEach((i:any) => {
    const wordArray: any = history[i]
    let row: any = emptyRow
    if (wordArray) {
      row = ` | ${wordArray.join(' | ')} |`
    }
    log(row)
    log(divider)
  })

  log('\n');
  keyboardBuilder(keyboardDict) 

  const congratsMsg: string =
    `\n🌈 CONGRATS, YOU GUESSED THE WORD ${answer.toUpperCase()} ❤️"`

  if (answer === text) {
    log(congratsMsg)
    process.exit(0)
  }

  return await wordle(
    language,
    option,
    words,
    answer
  )
}


/**
 * [TODO:description]
 *
 * @param {any} option - [TODO:description]
 * @returns {[TODO:type]} [TODO:description]
 */
const getInput: any = (
  option:any,
  words: string[],
  autoCompleteWords: any
) => {
  return {
    [options.EZ]: [{
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
