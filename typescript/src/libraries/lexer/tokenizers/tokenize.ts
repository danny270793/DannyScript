import { Character, Token } from '..'

export default interface Tokenizer {
    mustTokenize(character: Character): boolean
    getNextToken(
        path: string,
        characters: Character[],
        position: number,
    ): { token: Token; position: number }
}
