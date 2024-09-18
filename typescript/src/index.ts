import Path from 'node:path'
import Fs from 'node:fs'
import Lexer, { Character, Token } from './libraries/lexer'
import Parser from './libraries/parser'

function main() {
    const path: string = Path.join('.', 'input', 'index.dv')
    const outputPath: string = Path.join('.', 'output')

    const lexer: Lexer = new Lexer(path)
    const characters: Character[] = lexer.getCharacters()
    Fs.writeFileSync(
        Path.join(outputPath, 'index.dv.characters.json'),
        JSON.stringify(characters, null, 4),
    )

    const tokens: Token[] = lexer.getTokens(characters)
    Fs.writeFileSync(
        Path.join(outputPath, 'index.dv.tokens.json'),
        JSON.stringify(tokens, null, 4),
    )

    const parser: Parser = new Parser(tokens)
}

main()
