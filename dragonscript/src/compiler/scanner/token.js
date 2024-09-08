export default class Scanner {
    static LEFT_PAREN = 0 //(
    static RIGHT_PAREN = 1 // )
    static LEFT_BRACE = 2 //{
    static RIGHT_BRACE = 3 //}
    static COMMA = 4 //,
    static DOT = 5 //.
    static MINUS = 6 // -
    static PLUS = 7 // +
    static SEMICOLON = 8 // ;
    static SLASH = 9 // /
    static START = 10 // *
    static BANG = 11 // !
    static BANG_EQUAL = 12 //!=
    static EQUAL = 13 // =
    static EQUAL_EQUAL = 14 // ==
    static GREATER = 15 // >
    static GREATER_EQUAL = 16 // >=
    static LESS = 17 // <
    static LESS_EQUAL = 18 // <=
    static OPERATOR_AND = 19 // &
    static OPERATOR_AND_AND = 20 // &&
    static OERPATOR_OR = 21 // |
    static OPERATOR_OR_OR = 22 // ||
    static QUESTION_MARK = 23 // ?
    static IDENTIFIER = 24 // x, y...
    static STRING = 25 // "hello"
    static NUMBER = 26 // 1,2,3...
    //key words
    static AND = 27 // "and"
    static CLASS = 28 // "class"
    static ELSE = 29 //"else"
    static FALSE = 30 //"false"
    static TRUE = 31 //"true"
    //func is key word for defining functionss
    static FUNC = 34 // "function"
    static FOR = 35 //"for"
    static IF = 36 //"if"
    /*
    nil is the same as None in python, null in js
    */
    static NIL = 37 //nil 
    static OR = 38
    static PRINT = 39 //print
    static RETURN = 40 // return
    static SUPER = 41 //super
    static THIS = 42 //this
    /*
    let and var both used for defining variable,
    their difference is just like they are in js
    */
    static LET = 43 //let 
    static VAR = 44
    static WHILE = 45
    static EOF = 46 // indicate end of input
    static COMMENT = 47
    static ERROR = 48 //indicate scanning error
    static CONTINUE = 49
    static BREAK = 50

    initKeywords = () => {
        this.key_words = {
            "let": Scanner.LET,
            "and": Scanner.AND,
            "or": Scanner.OR,
            "class": Scanner.CLASS,
            "if": Scanner.IF,
            "else": Scanner.ELSE,
            "true": Scanner.TRUE,
            "false": Scanner.FALSE,
            "for": Scanner.FOR,
            "while": Scanner.WHILE,
            "func": Scanner.FUNC,
            "nil": Scanner.NIL,
            "print": Scanner.PRINT,
            "return": Scanner.RETURN,
            "super": Scanner.SUPER,
            "this": Scanner.THIS,
            "var": Scanner.VAR,
            "continue": Scanner.CONTINUE,
            "break": Scanner.BREAK,
        }
    }

    constructor(source) {
        this.source = source
        this.current = 0
        this.line = 0
        this.initKeywords()
    }

    makeToken = (lexeme, token, line) => {
        return {
            lexeme: lexeme,
            token: token,
            line: line,
        }
    }

    match = (expected_char) => {
        if (this.current >= this.source.length) {
            return false
        }

        if (this.source[this.current] === expected_char) {
            this.current += 1
            return true
        }

        return false
    }

    peek = () => {
        //only return the current char 
        if (this.current >= this.source.length) {
            return '\0'
        }
        return this.source[this.current]
    }

    isDigit = (c) => {
        return c >= '0' && c <= '9'
    }

    peekNext = () => {
        if (this.current + 1 >= this.source.length) {
            return '\0'
        }
        return this.source[this.current + 1]
    }

    isAlpha = (c) => {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'
    }

    isAlphaNumberic = (c) => {
        return this.isAlpha(c) || this.isDigit(c)
    }

    isEndOfToken = (c) => {
        switch (c) {
            case ' ':
            case '\t':
            case '\r':
            case ';':
            case '\n':
            case '\0':
            case ')':
                return true
        }

        return false
    }


    scan = () => {
        while (this.current < this.source.length) {
            const c = this.source[this.current]
            switch (c) {
                case '(':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.LEFT_PAREN, this.line)
                case ')':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.RIGHT_PAREN, this.line)
                case '{':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.LEFT_BRACE, this.line)

                case '}':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.RIGHT_BRACE, this.line)
                case ',':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.COMMA, this.line)
                case '.':
                    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
                        return this.makeToken("leading decimal number string",
                            Scanner.ERROR, this.line)
                    } else {
                        this.current += 1
                        return this.makeToken("" + c, Scanner.DOT, this.line)
                    }

                case '-':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.MINUS, this.line)
                case '+':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.PLUS, this.line)
                case ';':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.SEMICOLON, this.line)
                case '*':
                    this.current += 1
                    return this.makeToken("" + c, Scanner.START, this.line)

                //check two char operator
                case '!':
                    var token_type = Scanner.BANG
                    var char = '!'
                    this.current += 1
                    if (this.match('=')) {
                        token_type = Scanner.BANG_EQUAL
                        char = '!='
                    }
                    return this.makeToken(char, token_type, this.line)
                case '=':
                    token_type = Scanner.EQUAL
                    char = '='
                    this.current += 1
                    if (this.match('=')) {
                        token_type = Scanner.EQUAL_EQUAL
                        char = '=='
                    }
                    return this.makeToken(char, token_type, this.line)
                case '<':
                    token_type = Scanner.LESS
                    char = '<'
                    this.current += 1
                    if (this.match('=')) {
                        token_type = Scanner.LESS_EQUAL
                        char = '<='
                    }
                    return this.makeToken(char, token_type, this.line)
                case '>':
                    token_type = Scanner.GREATER
                    char = '>'
                    this.current += 1
                    if (this.match('=')) {
                        token_type = Scanner.GREATER_EQUAL
                        char = '>='
                    }
                    return this.makeToken(char, token_type, this.line)
                case '/':
                    token_type = Scanner.SLASH
                    char = '/'
                    this.current += 1
                    if (this.match('/')) {
                        //encounter comment operator, ingonre all chars until the end of the line
                        char = ""
                        token_type = Scanner.COMMENT
                        while (true) {
                            const cur_char = this.peek()
                            if (cur_char === '\0' || cur_char === '\n') {
                                break
                            }
                            char += cur_char
                            this.current += 1
                        }
                    }
                    return this.makeToken(char, token_type, this.line)

                case '\n':
                    this.line += 1
                    this.current += 1
                    continue
                case '"':
                    char = ""
                    //past first "
                    this.current += 1
                    while (this.peek() !== '\0' && this.peek() !== '"') {
                        if (this.peek() === '\n') {
                            this.line += 1
                        } else {
                            char += this.peek()
                        }
                        this.current += 1
                    }
                    if (this.peek() !== '"') {
                        return this.makeToken("unterminated string", Scanner.ERROR, 0)
                    }
                    //pass second "
                    this.current += 1
                    return this.makeToken(char, Scanner.STRING, this.line)
                default:
                    if (this.isDigit(this.peek())) {
                        char = ""
                        while (this.isDigit(this.peek())) {
                            char += this.peek()
                            this.current += 1
                        }
                        //consume the decimal point
                        if (this.peek() === '.' && this.isDigit(this.peekNext())) {
                            char += "."
                            this.current += 1
                        } else {
                            //return what we got as number
                            return this.makeToken(char, Scanner.NUMBER, this.line)
                        }

                        while (this.isDigit(this.peek())) {
                            char += this.peek()
                            this.current += 1
                        }


                        return this.makeToken(char, Scanner.NUMBER, this.line)
                    } else if (this.isAlpha(this.peek())) {
                        char = ""
                        while (this.isAlphaNumberic(this.peek())) {
                            char += this.peek()
                            this.current += 1
                        }
                        if (this.key_words[char]) {
                            return this.makeToken(char, this.key_words[char], this.line)
                        }
                        return this.makeToken(char, Scanner.IDENTIFIER, this.line)
                    }

                    //skip unrecognize character
                    this.current += 1
                // console.log("Scanning unrecognize chara: ", c)
            }
        }

        if (this.current >= this.source.length) {
            return {
                lexeme: "",
                token: Scanner.EOF,
                line: 0,
            }
        }


        return {}
    }
}

