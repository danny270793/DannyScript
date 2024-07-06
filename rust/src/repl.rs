use std::io::{self, Error, Write};

pub fn ask_for_data() -> Result<String, Error> {
    let mut input: String = String::from("");

    while input.trim() == "" {
        print!(">> ");
        io::stdout().flush()?;
    
        io::stdin().read_line(&mut input)?;
    }

    Ok(input)
}
