import { Character, Token } from '..'
import Tokenizer from './tokenize'

export default class NumbersTokenizer implements Tokenizer {
    private numbers: string = '1234567890'
    mustTokenize(character: Character): boolean {
        return this.numbers.includes(character.value)
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
            if (!this.numbers.includes(character.value)) {
                break
            }
            values.push(character.value)
            position += 1
        }

        return {
            token: {
                type: 'NUMBER',
                value: values.join(''),
                line: characters[initialPosition].line,
                column: characters[initialPosition].column,
            },
            position,
        }
    }
}
