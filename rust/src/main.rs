use lexer::Lexer;
use parser::Parser;
use std::error;

mod repl;
mod lexer;
mod parser;

fn repl() -> Result<(), Box<dyn error::Error>>{
    let input: String = repl::ask_for_data()?;
    let mut lexer: Lexer = Lexer::new(input.trim().to_string());

    let tokens: Vec<lexer::Token> = lexer.lex()?;
    for token in tokens.clone() {
        println!("{}", token);
    }

    let mut parser = Parser::new(tokens);
    parser.parse();
    /*
    let term: parser::Node = parser.parse()?;
    println!("{:?}", term);
    */

    Ok(())
}

fn main() {
    loop {
        match repl() {
            Ok(()) => {}
            Err(error) => println!("{}", error)
        }
    }
}
