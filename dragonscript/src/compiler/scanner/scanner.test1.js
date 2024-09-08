import Scanner from './token'
describe("Testing single char operator", () => {
    it("should return EOS token for empty source", () => {
        const scanner = new Scanner('')
        const eos_token = scanner.scan()
        expect(eos_token).toMatchObject({
            lexeme: "",
            token: Scanner.EOF,
            line: 0,
        })
    });

    it("shoud return left paren token for (", () => {
        let scanner = new Scanner('(')
        let left_paren_token = scanner.scan()
        expect(left_paren_token).toMatchObject({
            lexeme: "(",
            token: Scanner.LEFT_PAREN,
            line: 0,
        })
    })

    it("shoud return right paren token for )", () => {
        let scanner = new Scanner(')')
        let right_paren_token = scanner.scan()
        expect(right_paren_token).toMatchObject({
            lexeme: ")",
            token: Scanner.RIGHT_PAREN,
            line: 0,
        })
    })

    it("shoud return left brace token for {", () => {
        let scanner = new Scanner('{')
        let left_brace_token = scanner.scan()
        expect(left_brace_token).toMatchObject({
            lexeme: "{",
            token: Scanner.LEFT_BRACE,
            line: 0,
        })
    })

    it("shoud return right brace token for }", () => {
        let scanner = new Scanner('}')
        let right_brace_token = scanner.scan()
        expect(right_brace_token).toMatchObject({
            lexeme: "}",
            token: Scanner.RIGHT_BRACE,
            line: 0,
        })
    })

    it("shoud return comma token for ,", () => {
        let scanner = new Scanner(',')
        let comma_token = scanner.scan()
        expect(comma_token).toMatchObject({
            lexeme: ",",
            token: Scanner.COMMA,
            line: 0,
        })
    })

    it("shoud return dot token for .", () => {
        let scanner = new Scanner('.')
        let dot_token = scanner.scan()
        expect(dot_token).toMatchObject({
            lexeme: ".",
            token: Scanner.DOT,
            line: 0,
        })
    })

    it("shoud return minus token for -", () => {
        let scanner = new Scanner('-')
        let num_token = scanner.scan()
        expect(num_token).toMatchObject({
            lexeme: "-",
            token: Scanner.MINUS,
            line: 0,
        })
    })

    it("shoud return plus token for +", () => {
        let scanner = new Scanner('+')
        let plus_token = scanner.scan()
        expect(plus_token).toMatchObject({
            lexeme: "+",
            token: Scanner.PLUS,
            line: 0,
        })
    })

    it("shoud return semicolon token for ;", () => {
        let scanner = new Scanner(';')
        let semicolon_token = scanner.scan()
        expect(semicolon_token).toMatchObject({
            lexeme: ";",
            token: Scanner.SEMICOLON,
            line: 0,
        })
    })

    it("shoud return star token for *", () => {
        let scanner = new Scanner('*')
        let star_token = scanner.scan()
        expect(star_token).toMatchObject({
            lexeme: "*",
            token: Scanner.START,
            line: 0,
        })
    })

    it("shoud return bang token for !", () => {
        let scanner = new Scanner('!')
        let bang_token = scanner.scan()
        expect(bang_token).toMatchObject({
            lexeme: "!",
            token: Scanner.BANG,
            line: 0,
        })
    })

    it("shoud return less token for <", () => {
        let scanner = new Scanner('<')
        let less_token = scanner.scan()
        expect(less_token).toMatchObject({
            lexeme: "<",
            token: Scanner.LESS,
            line: 0,
        })
    })

    it("shoud return greater token for >", () => {
        let scanner = new Scanner('>')
        let greater_token = scanner.scan()
        expect(greater_token).toMatchObject({
            lexeme: ">",
            token: Scanner.GREATER,
            line: 0,
        })
    })
});

describe("Testing double chars operator", () => {
    it("shoud return BANG_EQUAL token for !=", () => {
        let scanner = new Scanner('!=')
        let bang_equal_toke = scanner.scan()
        expect(bang_equal_toke).toMatchObject({
            lexeme: "!=",
            token: Scanner.BANG_EQUAL,
            line: 0,
        })
    })

    it("shoud return EQUAL_EQUAL token for ==", () => {
        let scanner = new Scanner('==')
        let equal_equal_toke = scanner.scan()
        expect(equal_equal_toke).toMatchObject({
            lexeme: "==",
            token: Scanner.EQUAL_EQUAL,
            line: 0,
        })
    })

    it("shoud return LESS_EQUAL token for <=", () => {
        let scanner = new Scanner('<=')
        let less_equal_toke = scanner.scan()
        expect(less_equal_toke).toMatchObject({
            lexeme: "<=",
            token: Scanner.LESS_EQUAL,
            line: 0,
        })
    })

    it("shoud return GREATER_EQUAL token for >=", () => {
        let scanner = new Scanner('>=')
        let greater_equal_token = scanner.scan()
        expect(greater_equal_token).toMatchObject({
            lexeme: ">=",
            token: Scanner.GREATER_EQUAL,
            line: 0,
        })
    })

    it("should return COMMENT token for //", () => {
        let scanner = new Scanner("//this is a line of comment")
        let comment_token = scanner.scan()
        expect(comment_token).toMatchObject({
            lexeme: "this is a line of comment",
            token: Scanner.COMMENT,
            line: 0,
        })
    })
})

describe("Testing space and newline", () => {
    it("should ignore space for token", () => {
        let scanner = new Scanner("  \t\r >=")
        let greater_equal = scanner.scan()
        expect(greater_equal).toMatchObject({
            lexeme: ">=",
            token: Scanner.GREATER_EQUAL,
            line: 0,
        })
    })

    it("should count the right line number", () => {
        let scanner = new Scanner("\n\n\n>=")
        let greater_equal = scanner.scan()
        expect(greater_equal).toMatchObject({
            lexeme: ">=",
            token: Scanner.GREATER_EQUAL,
            line: 3,
        })
    })
})

describe("Testing string and number literals", () => {
    it("should return string token for chars in double quotes", () => {
        let scanner = new Scanner("\"this is a string\"")
        let string_token = scanner.scan()
        expect(string_token).toMatchObject({
            lexeme: "this is a string",
            token: Scanner.STRING,
            line: 0,
        })
    })

    it("should return error token for unterminated string", () => {
        let scanner = new Scanner("\"this is a string")
        let error_token = scanner.scan()
        expect(error_token).toMatchObject({
            lexeme: "unterminated string",
            token: Scanner.ERROR,
            line: 0,
        })
    })

    it("should count newlines in string", () => {
        let scanner = new Scanner("\"\n\nthis \nis string\"")
        let string_token = scanner.scan()
        expect(scanner.line).toEqual(3)
    })

    it("should return number token for number without decimal point", () => {
        let scanner = new Scanner("1234")
        let num_token = scanner.scan()
        expect(num_token).toMatchObject({
            lexeme: "1234",
            token: Scanner.NUMBER,
            line: 0,
        })
    })

    it("should return number token for float number string", () => {
        let scanner = new Scanner("12.34")
        let num_token = scanner.scan()
        expect(num_token).toMatchObject({
            lexeme: "12.34",
            token: Scanner.NUMBER,
            line: 0,
        })
    })

    it("should return error token for number string with leading decimal point", () => {
        let scanner = new Scanner(".1234")
        let error_token = scanner.scan()
        expect(error_token).toMatchObject({
            lexeme: "leading decimal number string",
            token: Scanner.ERROR,
            line: 0,
        })
    })

    // it("should return error token for number string with trailing decimal", () => {
    //     let scanner = new Scanner("1234.")
    //     let error_token = scanner.scan()
    //     expect(error_token).toMatchObject({
    //         lexeme: "trailing decimal number string",
    //         token: Scanner.ERROR,
    //         line: 0,
    //     })
    // })
})

describe("Testing identifer and keyword", () => {
    it("should return identifier token for any \
    string contains only alpha and without double quotes", () => {
        let scanner = new Scanner("counter")
        let id_token = scanner.scan()
        expect(id_token).toMatchObject({
            lexeme: "counter",
            token: Scanner.IDENTIFIER,
            line: 0,
        })
    })

    it("should return identifier token for any \
    string begin with underscore, and follow by alpha , number or underscore", () => {
        let scanner = new Scanner("_counter_timer_123")
        let id_token = scanner.scan()
        expect(id_token).toMatchObject({
            lexeme: "_counter_timer_123",
            token: Scanner.IDENTIFIER,
            line: 0,
        })
    })

    // it("should return error token for string start with number and \
    // follow with characters that are not digit", () => {
    //     let scanner = new Scanner("123_abc")
    //     let error_token = scanner.scan()
    //     expect(error_token).toMatchObject({
    //         lexeme: "illegal char in number string:_",
    //         token: Scanner.ERROR,
    //         line: 0,
    //     })
    // })

    it("should return token LET for key word let", () => {
        let scanner = new Scanner("let")
        let let_token = scanner.scan()
        expect(let_token).toMatchObject({
            lexeme: "let",
            token: Scanner.LET,
            line: 0,
        })
    })

    it("should return token AND for key word and", () => {
        let scanner = new Scanner("and")
        let and_token = scanner.scan()
        expect(and_token).toMatchObject({
            lexeme: "and",
            token: Scanner.AND,
            line: 0,
        })
    })

    it("should return token CLASS for key word class", () => {
        let scanner = new Scanner("class")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "class",
            token: Scanner.CLASS,
            line: 0,
        })
    })

    it("should return token IF for key word if", () => {
        let scanner = new Scanner("if")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "if",
            token: Scanner.IF,
            line: 0,
        })
    })

    it("should return token ELSE for key word ELSE", () => {
        let scanner = new Scanner("else")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "else",
            token: Scanner.ELSE,
            line: 0,
        })
    })

    it("should return token TRUE for key word true", () => {
        let scanner = new Scanner("true")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "true",
            token: Scanner.TRUE,
            line: 0,
        })
    })

    it("should return token FALSE for key word false", () => {
        let scanner = new Scanner("false")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "false",
            token: Scanner.FALSE,
            line: 0,
        })
    })

    it("should return token FOR for key word for", () => {
        let scanner = new Scanner("for")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "for",
            token: Scanner.FOR,
            line: 0,
        })
    })

    it("should return token WHILE for key word while", () => {
        let scanner = new Scanner("while")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "while",
            token: Scanner.WHILE,
            line: 0,
        })
    })

    it("should return token FUNC for key word func", () => {
        let scanner = new Scanner("func")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "func",
            token: Scanner.FUNC,
            line: 0,
        })
    })

    it("should return token NIL for key word nil", () => {
        let scanner = new Scanner("nil")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "nil",
            token: Scanner.NIL,
            line: 0,
        })
    })

    it("should return token PRINT for key word print", () => {
        let scanner = new Scanner("print")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "print",
            token: Scanner.PRINT,
            line: 0,
        })
    })

    it("should return token RETURN for key word return", () => {
        let scanner = new Scanner("return")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "return",
            token: Scanner.RETURN,
            line: 0,
        })
    })

    it("should return token SUPER for key word super", () => {
        let scanner = new Scanner("super")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "super",
            token: Scanner.SUPER,
            line: 0,
        })
    })

    it("should return token THIS for key word this", () => {
        let scanner = new Scanner("this")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "this",
            token: Scanner.THIS,
            line: 0,
        })
    })

    it("should return token VAR for key word var", () => {
        let scanner = new Scanner("var")
        let keyword_token = scanner.scan()
        expect(keyword_token).toMatchObject({
            lexeme: "var",
            token: Scanner.VAR,
            line: 0,
        })
    })
})

describe("Test mutiple tokens in line", () => {
    it("should return correct tokens in line", () => {
        let scanner = new Scanner("let \tcounter=\n123\r ;")
        const let_token = scanner.scan()
        expect(let_token).toMatchObject({
            lexeme: "let",
            token: Scanner.LET,
            line: 0,
        })

        const identifier_token = scanner.scan()
        expect(identifier_token).toMatchObject({
            lexeme: "counter",
            token: Scanner.IDENTIFIER,
            line: 0,
        })

        const equal_token = scanner.scan()
        expect(equal_token).toMatchObject({
            lexeme: "=",
            token: Scanner.EQUAL,
            line: 0,
        })

        const number_token = scanner.scan()
        expect(number_token).toMatchObject({
            lexeme: "123",
            token: Scanner.NUMBER,
            line: 1,
        })

        const semicolon_token = scanner.scan()
        expect(semicolon_token).toMatchObject({
            lexeme: ";",
            token: Scanner.SEMICOLON,
            line: 1,
        })
    })
})

