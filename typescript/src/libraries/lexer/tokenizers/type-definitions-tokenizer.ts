import { Character, Token } from '..'
import Tokenizer from './tokenize'

export default class TypeDefinitionsTokenizer implements Tokenizer {
    private typeDefinitions: string = ':'
    mustTokenize(character: Character): boolean {
        return this.typeDefinitions === character.value
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
                type: 'TYPE_DEFINITION',
                value: characters[initialPosition].value,
                line: characters[initialPosition].line,
                column: characters[initialPosition].column,
            },
            position,
        }
    }
}
