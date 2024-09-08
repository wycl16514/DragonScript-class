import Scanner from '../../scanner/token'
/*
1+2;
stmt -> expr SEMI
expr -> expr PLUS expr
expr -> NUM (1)
expr -> NUM(2)
*/
export default class ArithmeticParser {
    constructor(expression) {
        this.expression = expression
        //this scanner will used to get all tokens from the expression
        this.init_scanner = new Scanner(expression)
        //this scanner will used in the parsing process
        this.scanner = new Scanner(expression)
        //save all tokens for expression
        this.tokens = []
        this.getExprTokens()
        this.parseTrees = []
    }

    createParseTreeNode = (name) => {
        return {
            name: name,
            children: [],
            attributes: "",
        }
    }

    getExprTokens = () => {
        while (true) {
            const token_obj = this.init_scanner.scan()
            if (token_obj.token !== Scanner.EOF) {
                this.tokens.push(token_obj)
            } else {
                break
            }
        }
    }

    matchToken = (token) => {
        const cur_token = this.scanner.scan()
        if (cur_token.token !== token) {
            throw new Error(`token mismatch, expected: ${token}, got: ${cur_token.token}`)
        }

        return cur_token
    }

    /*
    stmt -> expr SEMICOLON
    stmt() {
        expr()
        matchToken(Scanner.SEMICOLON)
    }

    expr -> expr PLUS expr
    expr -> NUM
    expr () {
        expr()
        matchToken(Scanner.PLUS)
        expr()
    }
    */
    parse = () => {
        const treeRoot = this.createParseTreeNode("root")
        this.parseTrees = []
        //stmt -> expr SEMICOLN
        const res = this.stmt()
        treeRoot.children = this.parseTrees
        return {
            parseResult: res,
            parseTree: treeRoot,
        }
    }

    stmt = () => {
        //stmt -> expr SEMICOLN
        let res = ""
        let tokens = []
        for (let i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i].token !== Scanner.SEMICOLON) {
                tokens.push(this.tokens[i])
            } else {
                //send them to parse
                const stmtNode = this.createParseTreeNode("stmt")
                res += this.expr(tokens, stmtNode)
                this.matchToken(Scanner.SEMICOLON)
                tokens = []
                res += ";"
                const semiNode = this.createParseTreeNode("SEMI")
                semiNode.attributes = {
                    value: ";"
                }
                stmtNode.children.push(semiNode)
                this.parseTrees.push(stmtNode)
            }
        }

        return res
    }

    expr = (tokens, parentNode) => {
        const exprNode = this.createParseTreeNode("expr")
        parentNode.children.push(exprNode)
        /*
        expr -> NUM
        expr -> expr PLUS NUM
        expr -> expr START NUM
        1, if input tokens has only element, choose expr -> NUM
        2, if input tokens has more than one element, iterate over all input tokens, 
        if there is one PLUS, choose expr-> expr PLUS expr
        3, if input tokens has more than one element, iterate over all input tokens,
        if there is START, choose expr -> expr START expr
        */
        if (tokens.length === 1) {
            //expr -> NUM
            const token_obj = this.matchToken(Scanner.NUMBER)

            const numNode = this.createParseTreeNode("NUM")
            numNode.attributes = {
                value: token_obj.lexeme,
            }
            exprNode.children.push(numNode)

            return parseInt(token_obj.lexeme)
        }


        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].token === Scanner.PLUS) {
                const pluseNode = this.createParseTreeNode("+")
                exprNode.children.push(pluseNode)
                //expr -> expr PLUS expr
                const left = this.expr(tokens.slice(0, i), pluseNode)
                this.matchToken(Scanner.PLUS)
                const right = this.expr(tokens.slice(i + 1, tokens.length), pluseNode)
                return left + right
            }
        }

        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].token === Scanner.START) {
                const mulNode = this.createParseTreeNode("*")
                exprNode.children.push(mulNode)
                //expr -> expr START expr
                const left = this.expr(tokens.slice(0, i), mulNode)
                this.matchToken(Scanner.START)
                const right = this.expr(tokens.slice(i + 1, tokens.length), mulNode)
                return left * right
            }
        }



        throw new Error(`error for input: ${this.expression}`)
    }
}