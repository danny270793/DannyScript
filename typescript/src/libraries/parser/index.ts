import { Token } from "../lexer"

export default class Parser {
    tokens: Token[]
    constructor(tokens: Token[]) {
        this.tokens = tokens
    }
}
