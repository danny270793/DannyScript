import sys
from libraries.lexer import Lexer
from libraries.parser import Parser

if __name__ == '__main__':
    path = sys.argv[1]
    lexer = Lexer(path)
    tokens = lexer.tokenize()

    parser = Parser(tokens)
    tree = parser.parse()
