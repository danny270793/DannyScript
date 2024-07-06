use std::fmt;
use std::error;

#[derive(Debug)]
pub enum LexerError {
    IllegalCharacterError(usize, String)
}

impl fmt::Display for LexerError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            LexerError::IllegalCharacterError(position, message) => write!(f, "   {}^\nIllegal chracter \"{}\" found at column {}", " ".repeat(*position), message, position)
        }
    }
}

impl error::Error for LexerError {}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum DataType {
    Integer, Decimal, Add, Substract, Multiply, Divide, LeftParenthesis, RightParenthesis
}

static DIGITS: &str = "0123456789";

#[derive(Debug, Clone)]
pub struct Token {
    pub data_type: DataType,
    pub value: String,
    pub position: usize
}

impl fmt::Display for Token {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{:?}, {}]", self.data_type, self.value)
    }
}

pub struct Lexer {
    text: String,
    postion: usize,
    current_chracter: char
}

impl Lexer {
    pub fn new(text: String) -> Lexer{
        let current_chracter: char = text.chars().nth(0).unwrap();
        Lexer { text: text, postion: 0, current_chracter: current_chracter }
    }
    fn advance(&mut self) {
        self.postion += 1;
        if self.postion < self.text.len() {
            self.current_chracter = self.text.chars().nth(self.postion).unwrap();
        } else {
            self.current_chracter = char::from(0);
        }
    }
    pub fn lex(&mut self) -> Result<Vec<Token>, LexerError> {
        let mut tokens: Vec<Token> = Vec::new();
        while self.current_chracter != char::from(0) {
            if self.current_chracter == '\t' || self.current_chracter == ' ' {
                self.advance();
            } else if self.current_chracter == '+' {
                let token: Token = Token{data_type: DataType::Add, value: "+".to_string(), position: self.postion};
                tokens.push(token);
                self.advance();
            } else if self.current_chracter == '-' {
                let token: Token = Token{data_type: DataType::Substract, value: "-".to_string(), position: self.postion};
                tokens.push(token);
                self.advance();
            } else if self.current_chracter == '*' {
                let token: Token = Token{data_type: DataType::Multiply, value: "*".to_string(), position: self.postion};
                tokens.push(token);
                self.advance();
            } else if self.current_chracter == '/' {
                let token: Token = Token{data_type: DataType::Divide, value: "/".to_string(), position: self.postion};
                tokens.push(token);
                self.advance();
            } else if self.current_chracter == '(' {
                let token: Token = Token{data_type: DataType::LeftParenthesis, value: "(".to_string(), position: self.postion};
                tokens.push(token);
                self.advance();
            } else if self.current_chracter == ')' {
                let token: Token = Token{data_type: DataType::RightParenthesis, value: ")".to_string(), position: self.postion};
                tokens.push(token);
                self.advance();
            } else if DIGITS.contains(self.current_chracter) {
                let token: Token = self.make_number_token(self.postion);
                tokens.push(token);
            } else {
                return Err(LexerError::IllegalCharacterError(self.postion, self.current_chracter.to_string()));
            }
        }
        Ok(tokens)
    }
    fn make_number_token(&mut self, current_position: usize) -> Token {
        let mut number: String = String::new();
        let mut dot_count: i8 = 0;

        while self.current_chracter != char::from(0) && (DIGITS.contains(self.current_chracter) || self.current_chracter.to_string() == ".") {
            if self.current_chracter.to_string() == "." {
                if dot_count == 1 {
                    break;
                }
                
                dot_count += 1;
                number += ".";
            } else {
                number += self.current_chracter.to_string().as_str();
            }
            self.advance();
        }
        if dot_count == 0 {
            Token{data_type: DataType::Integer, value: number, position: current_position}
        } else {
            Token{data_type: DataType::Decimal, value: number, position: current_position}
        }
    } 
}
