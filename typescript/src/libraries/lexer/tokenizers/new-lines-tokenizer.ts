import { Character, Token } from '..'
import Tokenizer from './tokenize'

export default class NewLinesTokenizer implements Tokenizer {
    private newLine: string = '\n'
    mustTokenize(character: Character): boolean {
        return this.newLine === character.value
    }
    getNextToken(
        path: string,
        characters: Character[],
        position: number,
    ): { token: Token; position: number } {
        const character: Character = characters[position]
        position += 1
        return {
            token: {
                type: 'NEW_LINE',
                value: character.value,
                column: character.column,
                line: character.line,
            },
            position,
        }
    }
}
