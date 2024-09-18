import { Character, Token } from '..'
import Tokenizer from './tokenize'

export default class PointsTokenizer implements Tokenizer {
    private point: string = '.'
    mustTokenize(character: Character): boolean {
        return this.point === character.value
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
                type: 'POINT',
                value: character.value,
                column: character.column,
                line: character.line,
            },
            position,
        }
    }
}
