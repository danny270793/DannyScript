import Fs from 'node:fs'
import Tokenizer from './tokenizers/tokenize'
import WordsTokenizer from './tokenizers/words-tokenizer'
import ValueAssigmentsTokenizer from './tokenizers/value-assigments-tokenizer'
import PointsTokenizer from './tokenizers/points-tokenizer'
import ArithmeticOperationsTokenizer from './tokenizers/arithmetic-operations-tokenizer'
import NewLinesTokenizer from './tokenizers/new-lines-tokenizer'
import TypeDefinitionsTokenizer from './tokenizers/type-definitions-tokenizer'
import NumbersTokenizer from './tokenizers/numbers-tokenizer'
import UnexpectedChacraterError from './exceptions/unexpected-chacrater-error'

export interface Character {
    value: string
    line: number
    column: number
}

export interface Token {
    value: string
    type: string
    line: number
    column: number
}

export default class Lexer {
    static tokenizeres: Tokenizer[] = [
        new WordsTokenizer(),
        new TypeDefinitionsTokenizer(),
        new ValueAssigmentsTokenizer(),
        new NumbersTokenizer(),
        new NewLinesTokenizer(),
        new ArithmeticOperationsTokenizer(),
        new PointsTokenizer(),
    ]

    position: number = 0
    content: string
    path: string
    constructor(path: string) {
        this.path = path
        const file: Buffer = Fs.readFileSync(this.path)
        this.content = file.toString()
    }
    hasNextPosition(): boolean {
        return this.position < this.content.length
    }
    moveToNextPosition() {
        this.position += 1
    }
    getCharacters(): Character[] {
        const characters: Character[] = []
        let line: number = 0
        let column: number = 0
        for (const character of this.content) {
            characters.push({
                value: character,
                column,
                line: line,
            })
            if (character == '\n') {
                line += 1
                column = 0
            } else {
                column += 1
            }
        }
        return characters
    }
    getNextTokenizer(character: Character): Tokenizer | undefined {
        for (const tokenizer of Lexer.tokenizeres) {
            if (tokenizer.mustTokenize(character)) {
                return tokenizer
            }
        }
        return undefined
    }
    getTokens(characters: Character[]): Token[] {
        const tokens: Token[] = []
        while (this.hasNextPosition()) {
            const character: Character = characters[this.position]
            if (character.value === ' ') {
                this.moveToNextPosition()
                continue
            }

            const tokenizer: Tokenizer | undefined =
                this.getNextTokenizer(character)
            if (tokenizer === undefined) {
                throw UnexpectedChacraterError.from(
                    this.path,
                    characters,
                    character,
                )
            }

            const tokenized: { token: Token; position: number } =
                tokenizer.getNextToken(this.path, characters, this.position)
            tokens.push(tokenized.token)
            this.position = tokenized.position
        }
        return tokens
    }
}
