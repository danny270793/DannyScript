from .tokens import Token, Number, Word, Operation, String, Type, Reserved

class InvalidTokenException(Exception):
    pass

class Lexer:
    type_descriptor = ':'
    assigment = '<-'
    arrays_definition = '[]'
    strings_definition = "'"
    types = ['number', 'string']
    reserved = ['nothing', 'output']
    digits = '1234567890'
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    operations = "+-/*()="

    def __init__(self, path):
        file = open(path)
        lines = file.readlines()
        file.close()

        self.path = path
        self.code = ''.join(lines)
        self.index = 0
        self.character = self.code[self.index]
    
    def move_to_next_character(self):
        self.index += 1
        if self.index < len(self.code):
            self.character = self.code[self.index]
    
    def move_to_last_character(self):
        self.index -= 1
        self.character = self.code[self.index]
    
    def extract_number(self, line, column):
        number = ''
        while self.character in Lexer.digits and self.index < len(self.code):
            number += self.character
            self.move_to_next_character()
        return Number(number, line, column)

    def extract_word(self, line, column):
        word = ''
        while self.character in Lexer.characters and self.index < len(self.code):
            word += self.character
            self.move_to_next_character()

        if word in Lexer.types:
            return Type(word, line, column)
        elif word in Lexer.reserved:
            return Reserved(word, line, column)
        else:
            return Word(word, line, column)

    def extract_string(self, line, column):
        self.move_to_next_character()
        string = ''
        while (self.character != Lexer.strings_definition) and self.index < len(self.code):
            string += self.character
            self.move_to_next_character()
        self.move_to_next_character()
        return String(string, line, column)

    def compute_line_column(self):
        line = 0
        column = 1
        for index in range(self.index + 1):
            if self.code[index - 1] == '\n':
                line += 1
                column = 1
            else:
                column += 1
        return (line, column)
    
    def tokenize(self):
        tokens = []
        while self.index < len(self.code):
            token = None
            line, column = self.compute_line_column()
            if self.character in Lexer.digits:
                token = self.extract_number(line, column)
            elif self.character in Lexer.characters:
                token = self.extract_word(line, column)
            elif self.character == Lexer.type_descriptor:
                token = Token('TYPE_DESCRIPTOR', self.character, line, column)
                self.move_to_next_character()
            elif self.character == ' ':
                self.move_to_next_character()
                continue
            elif self.character == '\n':
                token = Token('LINE_BREAK', self.character, line, column)
                self.move_to_next_character()
            elif self.character == Lexer.strings_definition:
                token = self.extract_string(line, column)
            elif self.character == Lexer.assigment[0]:
                self.move_to_next_character()
                if self.character == Lexer.assigment[1]:
                    token = Token('ASSIGNMENT', Lexer.assigment, line, column)
                    self.move_to_next_character()
                else:
                    self.move_to_last_character()
            elif self.character == Lexer.arrays_definition[0]:
                self.move_to_next_character()
                if self.character == Lexer.arrays_definition[1]:
                    token = Token('ARRAY_DEFINITION', Lexer.arrays_definition, line, column)
                    self.move_to_next_character()
                else:
                    self.move_to_last_character()
            elif self.character in Lexer.operations:
                token = Operation(self.character, line, column)
                self.move_to_next_character()
            else:
                raise InvalidTokenException(f'invalid token "{self.character}" found at {self.path}:{line}:{column}')
            tokens.append(token)
        return tokens
