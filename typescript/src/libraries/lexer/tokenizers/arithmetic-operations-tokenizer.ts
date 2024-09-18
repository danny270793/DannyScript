import { Character, Token } from '..'
import Tokenizer from './tokenize'

export default class ArithmeticOperationsTokenizer implements Tokenizer {
    private arithmeticOperations: string = '+-* /'
    mustTokenize(character: Character): boolean {
        return this.arithmeticOperations.includes(character.value)
    }
    getNextToken(
        path: string,
        characters: Character[],
        position: number,
    ): { token: Token; position: number } {
        const initialPosition: number = position
        position += 1

        return {
            token: {
                type: 'ARITHMETIC_OPERATION',
                value: characters[initialPosition].value,
                line: characters[initialPosition].line,
                column: characters[initialPosition].column,
            },
            position,
        }
    }
}
