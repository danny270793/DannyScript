import { Character, Token } from '..'
import UnexpectedChacraterError from '../exceptions/unexpected-chacrater-error'
import Tokenizer from './tokenize'

export default class ValueAssigmentsTokenizer implements Tokenizer {
    private valueAssigments: string = '<-'
    mustTokenize(character: Character): boolean {
        return character.value === this.valueAssigments[0]
    }
    getNextToken(
        path: string,
        characters: Character[],
        position: number,
    ): { token: Token; position: number } {
        const initialPosition: number = position
        position += 1
        if (characters[position].value !== this.valueAssigments[1]) {
            throw UnexpectedChacraterError.from(
                path,
                characters,
                characters[position],
            )
        }
        position += 1

        return {
            token: {
                type: 'VALUE_ASSIGMENT',
                value: this.valueAssigments,
                line: characters[initialPosition].line,
                column: characters[initialPosition].column,
            },
            position,
        }
    }
}
