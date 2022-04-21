import util from 'util'
import prompts  from 'prompts'
import { readFileSync } from 'fs'

const log: any = console.log
const clear: any = console.clear
const table: any = console.table

const Reset = "\x1b[0m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgWhite = "\u001b[0m\u001b[7m"

const languageChoices: any = [
  { title: '🇧🇪  german', value: 'german' },
  { title: '🇱🇷  english', value: 'english' },
  { title: '🇮🇹  italian', value: 'italian' },
  { title: '🇪🇸  spanish', value: 'spanish', disabled: true },
  { title: '🇧🇷  portuguese', value: 'portuguese' }
]

const options: any = {
  EZZZ: "EZZZ",
  EASY: "EASY",
  HARD: "HARD",
  STAT: "STAT",
  HELP: "HELP",
  QUIT: "QUIT"
}

const statistics: any = {
  count: 0,
  wins: 0,
  losses: 0
}

const statuses: any = {
  EMPTY: 'empty',
  FILLED: 'filled'
}

const gameStatus: any = {
  WON: 'won',
  GAMEOVER: 'gameover',
  INPROGRESS: 'inprogress'
}

const selectChoices: any = [
  {
    title: 'EZZZ',
    description: 'easy mode but using autocomplete 💚',
    value: 'EZZZ'
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
    value: 'STAT',
    description: 'print some statistics'
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

const line: string = "\n"

const congratsMsg: string =
  `${line}🌈 CONGRATS, YOU GUESSED THE WORD %s ❤️"`

const goodbye: string = `${line}See you! 🍃 ${line}`

const restartMsg: string = `${line} Restarting the game! ♻️  ${line}` 
const gameoverMsg: string =
  `${line}Urghhh! maybe next time. 😊 ${line}`

const validation: string =
  `${BgRed}Please type a valid word.${Reset}`

const qwert: any =
  'Q W E R T Y U I O P A S D F G H J K L Z X C V B N M';

const keyboardDict: any  = {}
qwert.split(' ').map((letter:any) => {
  return keyboardDict[ letter ] = { color: Reset }
})

const exit: any = () => {
  log(goodbye)
  return process.exit()
}

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

const getGameStatus: any = (
  history:any,
  option:string,
  input:string,
  answer:string,
  payloads:any
) => {
  const secondLast: any = payloads[payloads.length - 2]
  const has: any = secondLast &&
    Object.values(secondLast)
    .filter((payload:any) => { return payload.required })
    .map((payload:any) => { return payload.value })
    .every((letter:string) => {
      return input.split('').includes(letter)
    })                

  const maxAttempts: boolean = history.length === 6 
  const hard: boolean =
    maxAttempts || option === options.HARD && secondLast && !has

  const gameover: boolean = maxAttempts || hard
  const won: any = answer === input
  return (
    won
    ? gameStatus.WON
    : gameover
      ? gameStatus.GAMEOVER
      : gameStatus.INPROGRESS
  )
}

const ask: any = async (
  option:string,
  language:string,
  words:string[],
  autoCompleteWords:string[],
  autoCompleteOptions:string[],
  result:any
) => {
  const toggle: any = await prompts(getInput(
    'RESTART',
    words,
    autoCompleteWords,
    autoCompleteOptions
  ))

  if (toggle.value) {
    await restart(language, option, words, result)
  }

  table(result);
  exit()
}

const getResultActionAfterwards: any = async (
  status:string,
  option:string,
  language:string,
  words:string[],
  answer:string,
  history:string[],
  payloads: any,
  autoCompleteWords:string[],
  autoCompleteOptions:string[],
  result:any
) => {
  return {
    won: async () => {
      const newResult: any = {
        count: result.count + 1,
        wins: result.wins + 1,
        losses: result.losses
      }
      return await ask(
        option,
        language,
        words,
        autoCompleteWords,
        autoCompleteOptions,
        newResult
      )
    },
    gameover: async () => {
      const newResult: any = {
        count: result.count + 1,
        wins: result.wins,
        losses: result.losses + 1 
      }
      return await ask(
        option,
        language,
        words,
        autoCompleteWords,
        autoCompleteOptions,
        newResult
      )
    },
    inprogress: async () => {
      const newResult: any = {
        count: result.count + 1,
        wins: result.wins,
        losses: result.losses
      }
      return await wordle(
        language,
        option,
        words,
        answer,
        history,
        payloads,
        newResult
      )
    }
  }[status]
}

const getResultMessage: any = (option:string, answer:string) => {
  return {
    gameover: gameoverMsg,
    won: util.format(congratsMsg, answer)
  }[option]
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

const getAutocompleteOptions: any = (options:any) => {
  return Object.values(options).map((option:any) => {
    return { title: option, value: option }
  })
}

const getAutocompleteWords: any = (words:string[]) => {
  return words.map((word:any) => {
    return { title: word, value: word }
  })
}

const getInput: any = (
  option:any,
  words: string[],
  autoCompleteWords: any,
  autoCompleteOptions: any
) => {
  return {
    [options.EZZZ]: [{
      type: 'autocomplete',
      name: 'value',
      message: 'Pick up your word to guess',
      choices: [...autoCompleteWords, ...autoCompleteOptions]
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
    }],
    RESTART: [{
      type: 'toggle',
      name: 'value',
      message: 'Play again?',
      initial: true,
      active: 'yes',
      inactive: 'no'  
    }]
  }[option]
}

const repeatingLetters: any = (letters:any, value:string) => {
  return letters.filter(
    (letter:any) => letter === value
  ).length > 1
}

const tableBuilder: any = (history:string[]) => {
  const divider: any = ` | ---`.repeat(5) + ' |'
  const emptyRow: any = ' |    '.repeat(5) + ' |' 

  log(divider)
  const chances: any = [...Array(6).keys()]
  chances.forEach((i:any) => {
    const wordArray: any = history[i]
    const row: string =
      wordArray 
      ? ` | ${wordArray.join(' | ')} |`
      : emptyRow
    log(row)
    log(divider)
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
    lettersArrayFulfilled.slice(0, lettersArray.indexOf('A'))
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
    lettersArrayFulfilled.slice(lettersArray.indexOf('Z'))
  log('|        |', thirdRow.join(' | '), '|        |')
  log(divider)
}

const restart: any = async (
  language: string,
  option: string,
  words: string[],
  result: any
) => {
  clear(0)
  log(restartMsg)
  const newAnswer: string = getAnswer(language, 'answers.txt')
  return await wordle(
    language,
    option,
    words,
    newAnswer,
    [],
    [],
    result
  )
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

  const history: any = []
  const payloads: any = []
  const option: string = select.value
  const language: any = languages.value
  const words : string[] = getWords(language, 'words.txt')
  const answer: string = getAnswer(language, 'answers.txt')

  const args: any[] = [
    language,
    option,
    words,
    answer,
    history,
    payloads,
    statistics
  ]

  switch (option) {
    case options.EZZZ: await wordle(...args)
    case options.EASY: await wordle(...args) 
    case options.HARD: await wordle(...args)  
    case options.STAT: await table(statistics) 
    case options.HELP: break
    case options.QUIT: exit()
    default: break
  } 
}

const wordle: any = async function (
  language: string,
  option: string,
  words: string[],
  answer: string,
  history: string[],
  payloads: any,
  result: any
) {
  const autoCompleteWords: any = getAutocompleteWords(words)
  const autoCompleteOptions: any = getAutocompleteOptions(options)
  const input: any = await prompts(getInput(
    option,
    words,
    autoCompleteWords,
    autoCompleteOptions
  ))

  const text: any = input.value

  if ([options.EZZZ, options.EASY, options.HARD].includes(text)) {
    return await restart(language, option, words, result)
  }

  if ([options.QUIT, options.STAT].includes(text)) {
    exit()
  }

  const wordIsValid = (
    (words.includes(text) && text.length === 5) ||
    Object.values(options).includes(text)
  )
  if (!wordIsValid) {
    log(validation);
    return await wordle(
      language,
      option,
      words,
      answer,
      history,
      payloads,
      result
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
      required: false,
      status: statuses.EMPTY
    }
  })

  const rowFulfilled: any = []
  const dictValues: any = Object.values(rowDict)
  dictValues.forEach((item:any, index:any) => {
    const value: any = item.value
    const has: any = answerLetters.includes(value)
    const guessedLetter: any = answerLetters[index]
    const samePosition: any = guessedLetter === value
    const position: any = answerLetters.indexOf(value)

    const repeating: boolean =
      repeatingLetters(answerLetters, value)

    keyboardDict[value.toUpperCase()].color = BgWhite

    if (has) {
      rowDict[index].color = BgYellow
      rowDict[index].status = statuses.FILLED
      rowDict[index].required = option === options.HARD
      keyboardDict[value.toUpperCase()].color = BgYellow
    }

    const ignore: boolean = (
      has &&
      rowDict[position].status === statuses.FILLED &&
      !repeating
    )

    if (ignore) {
      rowDict[index].color = BgWhite
      rowDict[index].status = statuses.FILLED
    }

    if (samePosition) {
      rowDict[index].color = BgGreen
      rowDict[index].status = statuses.FILLED
      rowDict[index].required = option === options.HARD
      keyboardDict[value.toUpperCase()].color = BgGreen
    }

    rowFulfilled.push(
      `${item.color} ${item.value} ${Reset}`
    )
  })

  history.push(rowFulfilled)
  payloads.push(rowDict)
  tableBuilder(history)
  log(line);
  keyboardBuilder(keyboardDict) 

  const status: string = getGameStatus(
    history,
    option,
    text,
    answer,
    payloads
  )

  const action: any = await getResultActionAfterwards(
    status,
    option,
    language,
    words,
    answer,
    history,
    payloads,
    autoCompleteWords,
    autoCompleteOptions,
    result
  )

  const message: string = getResultMessage(
    status,
    answer.toUpperCase()
  )

  message && log(message)
  action && await action()
}

run()
