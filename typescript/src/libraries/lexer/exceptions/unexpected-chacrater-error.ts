import { Character } from '..'

export default class UnexpectedChacraterError {
    static from(
        path: string,
        characters: Character[],
        character: Character,
    ): Error {
        const currentLine: Character[] = characters.filter(
            (currentCharacter: Character) =>
                character.line === currentCharacter.line,
        )
        currentLine.map((currentCharacter: Character) => {
            process.stdout.write(`${currentCharacter.value}`)
        })
        currentLine.map((currentCharacter: Character, column: number) => {
            if (column < character.column) {
                process.stdout.write(' ')
            }
            if (column === character.column) {
                process.stdout.write(`^ unexpected character\n`)
            }
        })

        return new Error(
            `invalid character "${character.value}" found at ${path}:${character.line + 1}:${character.column + 1}`,
        )
    }
}
