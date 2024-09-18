import { Character, Token } from '..'
import Tokenizer from './tokenize'

export default class WordsTokenizer implements Tokenizer {
    private words: string =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
    mustTokenize(character: Character): boolean {
        return this.words.includes(character.value)
    }
    getNextToken(
        path: string,
        characters: Character[],
        position: number,
    ): { token: Token; position: number } {
        const initialPosition: number = position

        const values: string[] = []
        while (position < characters.length) {
            const character: Character = characters[position]
            if (!this.words.includes(character.value)) {
                break
            }
            values.push(character.value)
            position += 1
        }

        return {
            token: {
                type: 'WORD',
                value: values.join(''),
                line: characters[initialPosition].line,
                column: characters[initialPosition].column,
            },
            position,
        }
    }
}
