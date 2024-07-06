class Parser:
    def __init__(self, tokens):
        self.tokens = tokens

    def group(self):
        tokens = []
        groups = []
        for token in self.tokens:
            if token.type == 'LINE_BREAK':
                tokens.append(groups)
                groups = []
            else:
                groups.append(token)
        return tokens

    def parse(self):
        for group in self.group():
            for token in group:
                print(token)
            print('\n')
