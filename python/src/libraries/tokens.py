import json

class Token:
    def __init__(self, type, value, line, column):
        self.type = type
        self.value = value
        self.line = line
        self.column = column

    def __str__(self):
        return json.dumps({'value': self.value, 'type': self.type, 'line': self.line, 'column': self.column})

class Number(Token):
    def __init__(self, value, line, column):
        super().__init__('NUMBER', value, line, column)

class String(Token):
    def __init__(self, value, line, column):
        super().__init__('STRING', value, line, column)

class Type(Token):
    def __init__(self, value, line, column):
        super().__init__('TYPE', value, line, column)

class Reserved(Token):
    def __init__(self, value, line, column):
        super().__init__('RESERVED', value, line, column)

class Word(Token):
    def __init__(self, value, line, column):
        super().__init__('WORD', value, line, column)

class Operation(Token):
    def __init__(self, value, line, column):
        super().__init__('OPERATION', value, line, column)
