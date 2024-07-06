use crate::lexer::{DataType, Token};

use std::error::Error;
use std::fmt;
use std::error;
use std::io;

#[derive(Debug)]
pub enum ParserError {
    IllegalTokenError(usize, String)
}

impl fmt::Display for ParserError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ParserError::IllegalTokenError(position, message) => {
                let space: String = " ".repeat(*position);
                write!(f, "   {}^\nIllegal token \"{}\" found at column {}", space, message, position)
            }
        }
    }
}

impl error::Error for ParserError {}

#[derive(Debug)]
pub struct NumberNode {
    value: Token
}

impl fmt::Display for NumberNode {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.value)
    }
}

#[derive(Debug)]
pub enum Node {
    BinaryOperationNode(Box<BinaryOperationNode>),
    NumberNode(Box<NumberNode>)
}

#[derive(Debug)]
pub struct BinaryOperationNode {
    left: Node,
    operator: Token,
    right: Node
}

impl fmt::Display for BinaryOperationNode {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{{:?}, {}, {:?}}}", self.left, self.operator, self.right)
    }
}

pub struct Parser {
    tokens: Vec<Token>,
    index: usize,
    current_token: Token
}

impl Parser {
    pub fn new(tokens: Vec<Token>) -> Parser {
        let token = tokens.get(0).unwrap();
        Parser { tokens: tokens.clone(), index: 0, current_token: token.clone() }
    }
    fn next_token(&mut self) -> Option<Token> {
        if self.index + 1 < self.tokens.len() {
            let token: &Token = self.tokens.get(self.index).unwrap();
            Some(token.clone())
        } else {
            None
        }
    }
    fn advance(&mut self) {
        self.index += 1;
        if self.index < self.tokens.len() {
            let token: &Token = self.tokens.get(self.index).unwrap();
            self.current_token = token.clone();
        }
    }
    fn regress(&mut self) {
        self.index -= 1;
        if self.index >= 0 {
            let token: &Token = self.tokens.get(self.index).unwrap();
            self.current_token = token.clone();
        }
    }
    fn get_node(&mut self) -> Result<Node, ParserError> {
        let mut input: String = String::from("");
        io::stdin().read_line(&mut input).unwrap();

        if self.current_token.data_type == DataType::Integer || self.current_token.data_type == DataType::Decimal {
            self.get_number_node()
        } else if self.current_token.data_type == DataType::Add || self.current_token.data_type == DataType::Substract || self.current_token.data_type == DataType::Multiply || self.current_token.data_type == DataType::Divide {
            self.regress();
            self.get_binary_operation_node()
        } else {
            self.get_binary_operation_node()
        }
    }
    fn get_number_node(&mut self) -> Result<Node, ParserError> {
        let node: NumberNode = NumberNode{value: self.current_token.clone()};
        self.advance();
        return Ok(Node::NumberNode(Box::new(node)));
    }
    fn get_binary_operation_node(&mut self) -> Result<Node, ParserError> {
        let left: Node = self.get_node()?;
        let operator: Token = self.current_token.clone();
        self.advance();
        let right: Node = self.get_node()?;
        let node: BinaryOperationNode = BinaryOperationNode{ left: left, operator: operator, right: right};
        Ok(Node::BinaryOperationNode(Box::new(node)))
    }
    /*
    fn term(&mut self) -> Result<BinaryOperationNode, ParserError> {
        self.binary_operation(|s: &mut Self| s.factor())
    }
    fn expr(&mut self) -> Result<BinaryOperationNode, ParserError> {
        self.binary_operation(|s: &mut Self| s.term())
    }
    fn binary_operation<F>(&mut self, callback: F) -> Result<BinaryOperationNode, ParserError> where F: Fn(&mut Self) -> Result<NumberNode, ParserError> {
        let left: NumberNode = callback(self)?;
        self.advance();
        let operator: Token = self.current_token.clone();
        self.advance();
        let right: NumberNode = callback(self)?;
        self.advance();
        Ok(BinaryOperationNode{ left: left, operator: operator, right: right})
    }
    */
    pub fn parse(&mut self) -> Result<(), ParserError> {
        while self.index < self.tokens.len() {
            let left: Node = self.get_node()?;
            println!("left {:?}", left);
            let right: Node = self.get_node()?;
            println!("right {:?}", right);
        }

        Ok(())
    }
}
