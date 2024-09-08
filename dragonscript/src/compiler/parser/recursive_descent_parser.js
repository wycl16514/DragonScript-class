import Scanner from '../scanner/token'
import { v4 as uuidv4 } from 'uuid'
export default class RecursiveDescentParser {
    constructor(expression) {
        this.source = expression
        this.scanner = new Scanner(expression)
        this.tokens = []
        this.current = -1
        this.parseTree = []
        this.advance()
        this.inMethod = [{ "inClass": false, "inMethod": 0, "isInit": false }]
    }

    checkThisInMethod = (token) => {
        if (token.token === Scanner.THIS) {
            if (!this.inMethod[this.inMethod.length - 1].inClass ||
                this.inMethod[this.inMethod.length - 1].inMethod <= 0) {
                throw new Error("this keyword need to be in class method")
            }
        }
    }

    getToken = () => {
        return this.tokens[this.current]
    }

    advance = () => {
        if (this.current + 1 >= this.tokens.length) {
            const token = this.scanner.scan()
            //we need to read the EOF token to know its end of the source
            this.tokens.push(token)
            this.current += 1
        } else {
            this.current += 1
        }
    }

    previous = () => {
        if (this.current > 0) {
            this.current -= 1
        }
    }

    addAcceptForNode = (parent, node) => {
        switch (node.name) {
            case "root":
                node.accept = (visitor) => {
                    visitor.visitRootNode(parent, node)
                }
                break
            case "program":
                node.accept = (visitor) => {
                    visitor.visitProgramNode(parent, node)
                }
                break
            case "block":
                node.accept = (visitor) => {
                    visitor.visitBlockNode(parent, node)
                }
                break
            //add class node
            case "class":
                node.accept = (visitor) => {
                    visitor.visitClassNode(parent, node)
                }
                break
            case "get":
                node.accept = (visitor) => {
                    visitor.visitGetNode(parent, node)
                }
                break
            case "decl_recursive":
                node.accept = (visitor) => {
                    visitor.visitDeclarationRecursiveNode(parent, node)
                }
                break
            case "var_decl":
                node.accept = (visitor) => {
                    visitor.visitVarDeclarationNode(parent, node)
                }
                break
            case "statement_recursive":
                node.accept = (visitor) => {
                    visitor.visitStatementRecursiveNode(parent, node)
                }
                break
            case "statement":
                node.accept = (visitor) => {
                    visitor.visitStatementNode(parent, node)
                }
                break
            case "continue":
                node.accept = (visitor) => {
                    visitor.visitContinueNode(parent, node)
                }
                break
            case "break":
                node.accept = (visitor) => {
                    visitor.visitBreakNode(parent, node)
                }
                break
            case "for":
                node.accept = (visitor) => {
                    visitor.visitForNode(parent, node)
                }
                break
            case "for_init":
                node.accept = (visitor) => {
                    visitor.visitForInitNode(parent, node)
                }
                break
            case "for_checking":
                node.accept = (visitor) => {
                    visitor.visitForCheckingNode(parent, node)
                }
                break
            case "for_changing":
                node.accept = (visitor) => {
                    visitor.visitForChangingNode(parent, node)
                }
                break
            case "while":
                node.accept = (visitor) => {
                    visitor.visitWhileNode(parent, node)
                }
                break
            case "if_stmt":
                node.accept = (visitor) => {
                    visitor.visitIfStmtNode(parent, node)
                }
                break
            case "else_stmt":
                node.accept = (visitor) => {
                    visitor.visitElseStmtNode(parent, node)
                }
                break
            case "print_stmt":
                node.accept = (visitor) => {
                    visitor.visitPrintStatementNode(parent, node)
                }
                break
            case "expression":
                node.accept = (visitor) => {
                    visitor.visitExpressionNode(parent, node)
                }
                break
            case "assignment":
                node.accept = (visitor) => {
                    visitor.visitAssignmentNode(parent, node)
                }
                break
            case "logic_or":
                node.accept = (visitor) => {
                    visitor.visitLogicOrNode(parent, node)
                }
                break
            case "logic_and":
                node.accept = (visitor) => {
                    visitor.visitLogicAndNode(parent, node)
                }
                break
            case "equality":
                node.accept = (visitor) => {
                    visitor.visitEqualityNode(parent, node)
                }
                break
            case "comparison":
                node.accept = (visitor) => {
                    visitor.visitComparisonNode(parent, node)
                }
                break
            case "equality_recursive":
                node.accept = (visitor) => {
                    visitor.visitEqualityRecursiveNode(parent, node)
                }
                break
            case "comparison_recursive":
                node.accept = (visitor) => {
                    visitor.visitComparisonRecursiveNode(parent, node)
                }
                break
            case "term":
                node.accept = (visitor) => {
                    visitor.visitTermNode(parent, node)
                }
                break
            case "term_recursive":
                node.accept = (visitor) => {
                    visitor.visitTermRecursiveNode(parent, node)
                }
                break
            case "factor":
                node.accept = (visitor) => {
                    visitor.visitFactorNode(parent, node)
                }
                break
            case "factor_recursive":
                node.accept = (visitor) => {
                    visitor.visitFactorRecursiveNode(parent, node)
                }
                break
            case "unary":
                node.accept = (visitor) => {
                    visitor.visitUnaryNode(parent, node)
                }
                break
            case "unary_recursive":
                node.accept = (visitor) => {
                    visitor.visitUnaryRecursiveNode(parent, node)
                }
                break
            case "call":
                node.accept = (visitor) => {
                    visitor.visitCallNode(parent, node)
                }
                break
            case "arguments":
                node.accept = (visitor) => {
                    visitor.visitArgumentsNode(parent, node)
                }
                break
            case "primary":
                node.accept = (visitor) => {
                    visitor.visitPrimaryNode(parent, node)
                }
                break
            case "func_decl":
                node.accept = (visitor) => {
                    visitor.visitFuncDeclNode(parent, node)
                }
                break
            case "parameters":
                node.accept = (visitor) => {
                    visitor.visitParametersNode(parent, node)
                }
                break
            case "return":
                node.accept = (visitor) => {
                    visitor.visitReturnNode(parent, node)
                }
        }
    }

    createParseTreeNode = (parent, name) => {
        const node = {
            name: name,
            children: [],
            attributes: "",
            uuid: uuidv4(),
        }

        this.addAcceptForNode(parent, node)

        return node
    }

    matchTokens = (tokens) => {
        const curToken = this.getToken()
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] === curToken.token) {
                return curToken
            }
        }

        return null
    }

    parse = () => {
        const treeNode = this.createParseTreeNode(null, "root")
        this.program(treeNode)
        return treeNode
    }

    /*
    expression -> assignment
    assignment -> equality assign_to
    assign_to -> EQUAL expression | EPSILON
    statement -> block | expression | print_stmt

    block -> LEFT_BRACE declaration_recursive RIGHT_BRACE
    
  
    */

    program = (parent) => {
        //program -> declaration_recursive
        const programNode = this.createParseTreeNode(parent, "program")
        this.declarationRecursive(programNode)
        parent.children.push(programNode)
    }


    declarationRecursive = (parent) => {
        if (this.matchTokens([Scanner.RIGHT_BRACE])) {
            return
        }

        const declNode = this.createParseTreeNode(parent, "decl_recursive")
        //declaration_recursive -> EOF | RIGHT_BRACE | var_decl declaration_recursive| statement declaration_recursive
        let token = this.matchTokens([Scanner.EOF])
        if (token) {
            //declaration_recursive -> EOF
            return
        }

        //error, move it to here
        parent.children.push(declNode)

        token = this.matchTokens([Scanner.FUNC])
        if (token) {
            //over the func 
            this.advance()
            //typo 
            this.funcDecl(declNode)
            /*
            exceed of the max stack size, home work, using loop to replace
            recursive call
            */
            return this.declarationRecursive(declNode)
        }

        //parsing class definition
        /*
        classDecl -> CLASS IDENTIFIER LEFT_BRACE method_recursive RIGHT_BRACE
        method_recursive -> EPSILON | func_decl method_recursive
        
        there are not class variables, we will handle variable of class like javascript
        let bird = Bird()
        bird.winds = "wind for bird"
        */
        token = this.matchTokens([Scanner.CLASS])
        if (token) {
            this.advance()
            this.classDecl(declNode)
            return this.declarationRecursive(declNode)
        }


        token = this.matchTokens([Scanner.VAR, Scanner.LET])
        if (token) {
            //declaration_recursive -> var_decl declaration_recursive
            this.varDecl(declNode)
        } else {
            //declaration_recursive -> statement declaration_recursive
            this.statement(declNode)
        }

        this.declarationRecursive(declNode)
    }

    classDecl = (parent) => {
        const classNode = this.createParseTreeNode(parent, "class")
        parent.children.push(classNode)
        let token = this.matchTokens([Scanner.IDENTIFIER])
        if (!token) {
            throw new Error("calss definiton missing name")
        }
        classNode.attributes = {
            value: token.lexeme
        }
        this.advance()

        this.inMethod.push({ "inClass": true, "inMethod": 0 })

        token = this.matchTokens([Scanner.LEFT_BRACE])
        if (!token) {
            throw new Error("class definition missing left brace")
        }
        this.advance()

        //should take here as a block
        this.block(classNode)
        if (!this.matchTokens([Scanner.RIGHT_BRACE])) {
            throw new Error("Missing right brace for block")
        }
        this.advance()
        this.inMethod.pop()
    }

    funcDecl = (parent) => {
        if (this.inMethod[this.inMethod.length - 1].inClass) {
            this.inMethod[this.inMethod.length - 1].inMethod += 1
        }
        const funcDeclNode = this.createParseTreeNode(parent, "func_decl")
        parent.children.push(funcDeclNode)
        /*
         func_decl -> FUNC(func) function
         function -> IDENTIFIER LEFT_PAREN parameters RIGHT_PAREN block
        */
        let token = this.matchTokens([Scanner.IDENTIFIER])
        if (token && token.lexeme) {
            //over function name
            this.advance()
            funcDeclNode["func_name"] = token.lexeme
            funcDeclNode.attributes = {
                value: token.lexeme
            }
        }

        if (this.inMethod[this.inMethod.length - 1].inClass) {
            if (funcDeclNode["func_name"] === "init") {
                this.inMethod[this.inMethod.length - 1].isInit = true
            } else {
                this.inMethod[this.inMethod.length - 1].isInit = false
            }
        }
        token = this.matchTokens([Scanner.LEFT_PAREN])
        if (!token) {
            throw new Error("function declaration missing left paren")
        }
        //over left paren
        this.advance()
        this.parameters(funcDeclNode)

        token = this.matchTokens([Scanner.RIGHT_PAREN])
        if (!token) {
            throw new Error("function declaration missing right paren")
        }

        //over the right paren
        this.advance()
        token = this.matchTokens([Scanner.LEFT_BRACE])
        if (!token) {
            throw new Error("function body should begin with left brace")
        }
        //go over the left brace
        this.advance()
        this.block(funcDeclNode)
        //skip over the right brace
        this.advance()

        if (this.inMethod[this.inMethod.length - 1].inClass) {
            this.inMethod[this.inMethod.length - 1].inMethod -= 1
        }
    }

    parameters = (parent) => {
        const parametersNode = this.createParseTreeNode(parent, "parameters")
        //error 
        parent.children.push(parametersNode)
        /*
        parameters -> identifier_list | EPSILON
        identifier_list -> IDENTIFIER identifier_list_recursive
        identifier_list_recursive -> COMMA identifier_list | EPSILON
        */
        const parameterList = []
        while (true) {
            let token = this.matchTokens([Scanner.IDENTIFIER])
            if (!token) {
                break
            }
            this.advance()
            parameterList.push(token.lexeme)
            token = this.matchTokens([Scanner.COMMA])
            if (!token) {
                break
            }
            this.advance()
        }

        parametersNode.attributes = {
            value: parameterList
        }
    }

    varDecl = (parent) => {
        //var_decl -> VAR IDENTIFIER assign_to SEMICOLON
        const varDeclNode = this.createParseTreeNode(parent, "var_decl")
        parent.children.push(varDeclNode)
        //remember the keyword is var or let
        varDeclNode.token = this.getToken()
        //go over the keyword
        this.advance()

        let token = this.matchTokens([Scanner.IDENTIFIER])
        if (token === null) {
            throw new Error("var declaration missing identifier name")
        }
        this.advance()
        varDeclNode.attributes = {
            value: token.lexeme,
        }
        //assign_to -> EQUAL expression | EPSILON
        token = this.matchTokens([Scanner.EQUAL])
        if (token) {
            this.advance()
            this.expression(varDeclNode)
        }

        token = this.matchTokens([Scanner.SEMICOLON])
        if (token === null) {
            throw new Error("variable declaration missing semicolon")
        }
        this.advance()
    }

    statementRecursive = (parent) => {
        //statement_recursive -> EOF | statement statement_recursive
        const statementRecursiveNode = this.createParseTreeNode(parent, "statement_recursive")
        parent.children.push(statementRecursiveNode)

        const token = this.matchTokens([Scanner.EOF])
        if (token) {
            statementRecursiveNode.attributes = {
                value: "EOF",
            }
            // eod of code
            return
        }

        this.statement(statementRecursiveNode)
        //loop back to statement after parsing the statment if there is not the end of file
        this.statementRecursive(statementRecursiveNode)
    }
    /*
    turing complete:
    1, we can write to some place or erase the cotent have written to
    2, our logic can "jump" means we should support looping and conditional executing
    if .. else 

    statement -> expression | ifStmt | printStmt | block
    ifStmt -> IF LEFT_PAREN expression RIGHT_PAREN block elseStmt
    elseStmt -> ELSE block | EPSILON

    add the whileStmt
    statement -> expression |ifStmt|printStmt|whileStmt|block
    whileStmt -> WHILE LEFT_PAREN expression RIGHT_PAREN block

    add the forStmt
     statement -> expression |ifStmt|printStmt|whileStmt| forStmt|block
     forStmt -> FOR LEFT_PAREN for_init for_checking for_changing RIGHT_PAREN block
     for_init -> var_decl SEMICOLON | expression SEMICOLON | SEMICOLON
     for_checking -> expression SEMICOLON | SEMICOLON
     for_changing -> expression | EPSILON
     add continue and break
     statement -> ...|block|continueStmt|breakStmt
     continueStmt -> CONTINUE SEMICOLN
     breakStmt -> BREAK SEMICOLON
    */

    statement = (parent) => {
        // statement -> expression SEMICOLON | print_statement
        const stmtNode = this.createParseTreeNode(parent, "statement")
        //statement -> print_statement
        let token = this.matchTokens([Scanner.PRINT])
        if (token) {
            this.advance()
            this.printStmt(stmtNode)
            parent.children.push(stmtNode)
            return
        }

        //get return keyword then parse return statement
        token = this.matchTokens([Scanner.RETURN])
        if (token) {
            this.advance()
            this.returnStmt(stmtNode)
            parent.children.push(stmtNode)
            return
        }

        //get if keyword then we goto if statement parsing
        token = this.matchTokens([Scanner.IF])
        if (token) {
            //go over the if token
            this.advance()
            this.ifStmt(stmtNode)
            parent.children.push(stmtNode)
            return
        }

        token = this.matchTokens([Scanner.WHILE])
        if (token) {
            this.advance()
            this.whileStmt(stmtNode)
            parent.children.push(stmtNode)
            return
        }

        //get for keyword, then goto parsing forStmt
        token = this.matchTokens([Scanner.FOR])
        if (token) {
            this.advance()
            this.forStmt(stmtNode)
            parent.children.push(stmtNode)
            return
        }

        //check continue or break
        token = this.matchTokens([Scanner.CONTINUE, Scanner.BREAK])
        if (token) {
            this.advance()
            if (token.token === Scanner.CONTINUE) {
                const continueNode = this.createParseTreeNode(stmtNode, "continue")
                stmtNode.children.push(continueNode)
            } else {
                const breakNode = this.createParseTreeNode(stmtNode, "break")
                stmtNode.children.push(breakNode)
            }
            token = this.matchTokens([Scanner.SEMICOLON])
            if (!token) {
                throw new Error("break or continue missing semicolon")
            }
            this.advance()
            parent.children.push(stmtNode)
            return
        }

        //block -> LEFT_BRACE declaration_recursive RIGHT_BRACE
        token = this.matchTokens([Scanner.LEFT_BRACE])
        if (token) {
            parent.children.push(stmtNode)
            //over the left brace
            this.advance()
            this.block(stmtNode)
            if (!this.matchTokens([Scanner.RIGHT_BRACE])) {
                throw new Error("Missing the right brace for block")
            }
            //over the right brace
            this.advance()
            return
        }

        //statement -> exression SEMI
        this.expression(stmtNode)
        token = this.matchTokens([Scanner.SEMICOLON])
        if (token === null) {
            throw new Error("statement miss matching SEMICOLON")
        }
        this.advance()
        parent.children.push(stmtNode)

    }

    matchSemicolon = () => {
        let token = this.matchTokens([Scanner.SEMICOLON])
        if (token) {
            //return_expr -> SEMICOLON
            this.advance()
            return true
        }

        return false
    }

    returnStmt = (parent) => {
        if (this.inMethod[this.inMethod.length - 1].inClass &&
            this.inMethod[this.inMethod.length - 1].isInit) {
            throw new Error("not allow to return anything in class constructor")
        }
        const returnNode = this.createParseTreeNode(parent, "return")
        parent.children.push(returnNode)
        if (this.matchSemicolon()) {
            return
        }

        //return_expr -> expression SEMICOLON
        this.expression(returnNode)
        if (!this.matchSemicolon()) {
            throw new Error("return statement missing semicolon")
        }
    }

    forStmt = (parent) => {
        /*
        forStmt -> FOR LEFT_PAREN for_init for_checking for_changing RIGHT_PAREN block
        for_init -> var_decl  | expression SEMICOLON | SEMICOLON
        for_checking -> expression SEMICOLON | SEMICOLON
        for_changing -> expression RIGHT_PAREN| RIGHT_PAREN
        */
        const forStmtNode = this.createParseTreeNode(parent, "for")
        parent.children.push(forStmtNode)

        let token = this.matchTokens([Scanner.LEFT_PAREN])
        if (!token) {
            throw new Error("for loop missing left paren")
        }
        this.advance()

        // check the initializer is only semicolon
        token = this.matchTokens([Scanner.SEMICOLON])
        if (!token) {
            const forInitNode = this.createParseTreeNode(forStmtNode, "for_init")
            forStmtNode.children.push(forInitNode)
            token = this.matchTokens([Scanner.VAR])
            if (token) {
                this.varDecl(forInitNode)
            } else {
                this.expression(forInitNode)
                token = this.matchTokens([Scanner.SEMICOLON])
                if (!token) {
                    throw new Error("for loop initializer missing semicolon")
                }
                this.advance()
            }
        } else {
            this.advance()
        }

        token = this.matchTokens([Scanner.SEMICOLON])
        if (!token) {
            const forCheckingNode = this.createParseTreeNode(forStmtNode, "for_checking")
            forStmtNode.children.push(forCheckingNode)
            this.expression(forCheckingNode)
            token = this.matchTokens([Scanner.SEMICOLON])
            if (!token) {
                throw new Error("for loop checking missing semicolon")
            }
            this.advance()
        } else {
            this.advance()
        }

        token = this.matchTokens([Scanner.RIGHT_PAREN])
        if (!token) {
            const forChanging = this.createParseTreeNode(forStmtNode, "for_changing")
            forStmtNode.children.push(forChanging)
            this.expression(forChanging)
            token = this.matchTokens([Scanner.RIGHT_PAREN])
            if (!token) {
                throw new Error("for loop missing right paren")
            }
            this.advance()
        } else {
            this.advance()
        }

        this.parseBlock(forStmtNode)
    }

    whileStmt = (parent) => {
        // whileStmt -> WHILE LEFT_PAREN expression RIGHT_PAREN block
        const whileNode = this.createParseTreeNode(parent, "while")
        parent.children.push(whileNode)
        let token = this.matchTokens([Scanner.LEFT_PAREN])
        if (!token) {
            throw new Error("condition for while loop missing left paren")
        }
        this.advance()
        this.expression(whileNode)
        token = this.matchTokens([Scanner.RIGHT_PAREN])
        if (!token) {
            throw new Error("condition for while loop missing right paren")
        }
        this.advance()
        this.parseBlock(whileNode)
    }

    parseBlock = (parent) => {
        //block -> LEFT_BRACE declaration_recursive RIGHT_BRACE
        let token = this.matchTokens([Scanner.LEFT_BRACE])
        if (token) {
            //over the left brace
            this.advance()
            this.block(parent)
            if (!this.matchTokens([Scanner.RIGHT_BRACE])) {
                throw new Error("Missing the right brace for block")
            }
            //over the right brace
            this.advance()
            return
        }
    }

    /*
     ifStmt -> IF LEFT_PAREN expression RIGHT_PAREN block elseStmt
     elseStmt -> ELSE block | EPSILON
    */
    ifStmt = (parent) => {
        const ifNode = this.createParseTreeNode(parent, "if_stmt")
        parent.children.push(ifNode)
        let token = this.matchTokens([Scanner.LEFT_PAREN])
        if (!token) {
            throw new Error("Missing left paren after if")
        }
        this.advance()

        this.expression(ifNode)

        token = this.matchTokens([Scanner.RIGHT_PAREN])
        if (!token) {
            throw new Error("Missing right paren after if")
        }
        this.advance()

        //parsing the block for  the condition is true
        this.parseBlock(ifNode)

        //check whether there is an else keyword
        token = this.matchTokens([Scanner.ELSE])
        if (token) {
            const elseNode = this.createParseTreeNode(ifNode, "else_stmt")
            ifNode.children.push(elseNode)
            //go over the else keyword
            this.advance()
            this.parseBlock(elseNode)
        }
    }

    block = (parent) => {
        //block -> LEFT_BRACE declaration_recursive RIGHT_BRACE
        const blockNode = this.createParseTreeNode(parent, "block")
        parent.children.push(blockNode)
        this.declarationRecursive(blockNode)
    }

    printStmt = (parent) => {
        //print_statement -> PRINT LEFT_PAREN expression RIGHT_PAREN SEMICOLON
        const printStmtNode = this.createParseTreeNode(parent, "print_stmt")
        let token = this.matchTokens([Scanner.LEFT_PAREN])
        if (token === null) {
            throw new Error("print statement missing left paren")
        }
        this.advance()

        this.expression(printStmtNode)

        token = this.matchTokens([Scanner.RIGHT_PAREN])
        if (token === null) {
            throw new Error("print statement missing right paren")
        }
        this.advance()

        token = this.matchTokens([Scanner.SEMICOLON])
        if (token === null) {
            throw new Error("print statement missing SEMICOLON")
        }
        this.advance()
        parent.children.push(printStmtNode)
    }

    expression = (parentNode) => {
        //expression -> assignemnt
        const exprNode = this.createParseTreeNode(parentNode, "expression")
        this.assignment(exprNode)
        parentNode.children.push(exprNode)
    }

    /*
    assignment -> equality assign_to | logic_or
    logic_or -> logic_and logic_or_recursive
    logic_or_recursive -> OR logic_and logic_or_recursive| EPSILON
    logic_and -> equality logic_and_recursive
    logic_and_recursive -> AND equality logic_and_recursive| EPSILON

    a > 0 or b > 1 and c > 2;
    */

    assignment = (parentNode) => {

        //this.equality(parentNode)
        this.logicOr(parentNode) //parsing left of =
        if (this.matchTokens([Scanner.EQUAL])) {
            let lastNode = parentNode
            while (lastNode.children.length > 0) {
                if (lastNode.children.length > 1) {
                    for (let child of lastNode.children) {
                        if (child.name === "get" || child.name === "call") {
                            lastNode = child
                            break
                        }
                    }
                } else {
                    lastNode = lastNode.children[0]
                }
            }
            let isLegalLeft = false
            let lexeme = ""
            if (lastNode.name === "get") {
                isLegalLeft = true
            } else if (lastNode.name === "primary" && lastNode.token.token === Scanner.IDENTIFIER) {
                isLegalLeft = true
                lexeme = lastNode.token.lexeme
            }

            if (isLegalLeft) {
                const assignmentNode = this.createParseTreeNode(parentNode, "assignment")
                assignmentNode.attributes = {
                    value: lexeme, //name of variable to be assigned to
                }

                if (lastNode.name === "get") {
                    assignmentNode["getter"] = lastNode
                }

                this.advance()
                parentNode.children.push(assignmentNode)
                this.expression(assignmentNode)
            } else {
                throw new Error("can only assign to defined identifier")
            }

        } else {
            //assign_to -> EPSILON
            return
        }
    }

    logicOr = (parent) => {
        /*
        logic_or -> logic_and logic_or_recursive
        logic_or_recursive -> OR logic_and logic_or_recursive| EPSILON
        */
        const logicOrNode = this.createParseTreeNode(parent, "logic_or")
        parent.children.push(logicOrNode)
        this.logicAnd(logicOrNode)
        while (true) {
            let token = this.matchTokens([Scanner.OR])
            if (!token) {
                break
            }
            this.advance()
            this.logicAnd(logicOrNode)
        }
    }

    logicAnd = (parent) => {
        /*
          logic_and -> equality logic_and_recursive
          logic_and_recursive -> AND equality logic_and_recursive| EPSILON
        */
        const logicAndNode = this.createParseTreeNode(parent, "logic_and")
        parent.children.push(logicAndNode)
        this.equality(logicAndNode)
        while (true) {
            let token = this.matchTokens([Scanner.AND])
            if (!token) {
                break
            }
            this.advance()
            this.equality(logicAndNode)
        }
    }

    equality = (parentNode) => {
        //equality -> comparison equality_recursive
        const equNode = this.createParseTreeNode(parentNode, "equality")
        this.comparison(equNode)
        this.equalityRecursive(equNode)
        parentNode.children.push(equNode)
    }

    comparison = (parentNode) => {
        //comparison -> term comparison_recursive
        const compaNode = this.createParseTreeNode(parentNode, "comparison")
        this.term(compaNode)
        this.comparisonRecursive(compaNode)
        parentNode.children.push(compaNode)
    }

    equalityRecursive = (parentNode) => {
        const opToken = this.matchTokens([Scanner.BANG_EQUAL, Scanner.EQUAL_EQUAL])
        if (!opToken) {
            //equality_recursive -> epsilon
            return
        }


        //equality_recursive -> (!= | ==) equlity
        const equalityRecursiveNode = this.createParseTreeNode(parentNode, "equality_recursive")
        equalityRecursiveNode.attributes = {
            value: opToken.lexeme,
        }
        equalityRecursiveNode.toekn = opToken
        parentNode.children.push(equalityRecursiveNode)
        this.advance()
        this.equality(equalityRecursiveNode)
    }

    comparisonRecursive = (parentNode) => {
        //comparison_recursive -> epsilon | (>|>=|<|<=)comparison
        const opToken = this.matchTokens([Scanner.GREATER_EQUAL, Scanner.GREATER,
        Scanner.LESS, Scanner.LESS_EQUAL])
        if (!opToken) {
            //comparison_recursive -> epsilon
            return
        }
        //comparison_recursive ->  (>|>=|<|<=)comparison
        const comparisonRecursiveNode = this.createParseTreeNode(parentNode, "comparison_recursive")
        comparisonRecursiveNode.attributes = {
            value: opToken.lexeme,
        }
        comparisonRecursiveNode.token = opToken
        parentNode.children.push(comparisonRecursiveNode)
        //scan over those operators
        this.advance()
        this.comparison(comparisonRecursiveNode)
    }

    term = (parentNode) => {
        //term -> factor term_recursive
        const term = this.createParseTreeNode(parentNode, "term")
        this.factor(term)
        this.termRecursive(term)
        parentNode.children.push(term)
    }

    termRecursive = (parentNode) => {
        //term_recursive -> epsilon | ("-" | "+") term
        const opToken = this.matchTokens([Scanner.MINUS, Scanner.PLUS])
        if (opToken === null) {
            //term_recursive -> epsilon
            return
        }
        //term_recursive ->   ("-" | "+") term
        const termRecursiveNode = this.createParseTreeNode(parentNode, "term_recursive")
        termRecursiveNode.attributes = {
            value: opToken.lexeme,
        }
        termRecursiveNode.token = opToken
        parentNode.children.push(termRecursiveNode)
        this.advance()
        this.term(termRecursiveNode)
    }

    factor = (parentNode) => {
        //factor -> unary factor_recursive
        const factor = this.createParseTreeNode(parentNode, "factor")
        this.unary(factor)
        this.factorRecursive(factor)
        parentNode.children.push(factor)
    }

    factorRecursive = (parentNode) => {
        //factor_recursive -> epsilon | ("*" | "/") factor
        const opToken = this.matchTokens([Scanner.START, Scanner.SLASH])
        if (opToken === null) {
            //factor_recursive -> epsilon
            return
        }

        //factor_recursive ->   ("*" | "/") factor
        const factorRecursiveNode = this.createParseTreeNode(parentNode, "factor_recursive")
        factorRecursiveNode.attributes = {
            value: opToken.lexeme,
        }
        factorRecursiveNode.token = opToken
        parentNode.children.push(factorRecursiveNode)
        this.advance()
        this.factor(factorRecursiveNode)
    }

    /*
      uary -> unary_recursive | call
      call -> primary(ID:getCallback) do_call
      do_call -> LEFT_PAREN("("") argument_list | EPSILON
      arguement_list -> arguments RIGHT_PAREN(")")
      arguments -> expression(1, 2, 3) argument_recursive
      argument_recursive -> COMMA(",", ",") arguments | ESPILON
      */

    unary = (parentNode) => {
        //unary -> unary_recursive | call
        const unaryNode = this.createParseTreeNode(parentNode, "unary")
        if (this.unaryRecursive(unaryNode) === false) {
            this.call(unaryNode)
        }
        parentNode.children.push(unaryNode)
    }

    call = (parent) => {
        //call -> primary do_call
        this.primary(parent)
        if (parent.children.length === 0 || !parent.children[0].token) {
            return
        }

        if ((parent.children[0].token && parent.children[0].token.token === Scanner.IDENTIFIER) ||
            parent.children[0].token.token == Scanner.THIS) {
            parent["call_name"] = parent.children[0].attributes.value
            if (this.matchTokens([Scanner.LEFT_PAREN, Scanner.DOT])) {
                parent.children = []
                parent.attributes = {
                    value: parent["call_name"]
                }
            }

            this.doCall(parent)
        }
    }

    doCall = (parent, isMethod = false) => {
        // do_call -> LEFT_PAREN( argument_list | EPSILON
        if (this.matchTokens([Scanner.LEFT_PAREN])) {
            //over the left paren
            this.advance()

            const callNode = this.createParseTreeNode(parent, "call")
            parent.children.push(callNode)
            let callName = "anonymous_call"

            if (parent.call_name) {
                callName = parent.call_name
            }
            callNode.attributes = {
                value: callName,
            }
            //error here
            this.argument_list(callNode)

            /*
            a.b().c = 1;
            */

            callNode["parent"] = parent
            callNode["method"] = isMethod
            parent = callNode
        }

        this.doGet(parent)
    }


    doGet = (parent) => {
        //a.b.c()       
        if (this.matchTokens([Scanner.DOT])) {
            //skip over the dot
            this.advance()
            const token = this.matchTokens([Scanner.IDENTIFIER])
            if (!token) {
                throw new Error("should follow identifer after dot operator")
            }
            this.advance()
            if (!this.matchTokens([Scanner.LEFT_PAREN])) {
                //field accessing
                const getNode = this.createParseTreeNode(parent, "get")
                getNode["parent"] = parent
                parent.children.push(getNode)
                getNode["call_name"] = token.lexeme
                getNode.attributes = {
                    value: token.lexeme
                }
                this.doCall(getNode, true)
            } else {
                parent["call_name"] = token.lexeme
                this.doCall(parent, true)
            }
        }
    }

    argument_list = (parent) => {
        //arguement_list -> arguments RIGHT_PAREN do_call
        this.arguments(parent)
        if (!this.matchTokens([Scanner.RIGHT_PAREN])) {
            throw new Error("function call missing ending right paren")
        }
        //over the right paren
        this.advance()
        //error here, foget following
        this.doCall(parent)
    }

    arguments = (parent) => {
        // arguments -> expression(1, 2, 3) argument_recursive
        // argument_recursive -> COMMA(",", ",") arguments | ESPILON
        const argumentsNode = this.createParseTreeNode(parent, "arguments")
        parent.children.push(argumentsNode)
        //check empty arguments
        if (this.matchTokens([Scanner.RIGHT_PAREN])) {
            return
        }

        while (true) {
            this.expression(argumentsNode)
            if (!this.matchTokens([Scanner.COMMA])) {
                return
            }
            //over the comma
            this.advance()
        }
    }



    unaryRecursive = (parentNode) => {
        //unary_recursive -> epsilon | ("!" | "-") unary
        const opToken = this.matchTokens([Scanner.BANG, Scanner.MINUS])
        if (opToken === null) {
            //unary_recursive -> epsilon
            return false
        }

        //unary_recursive -> ("!" | "-") unary
        const unaryRecursiveNode = this.createParseTreeNode(parentNode, "unary_recursive")
        unaryRecursiveNode.attributes = {
            value: opToken.lexeme,
        }
        unaryRecursiveNode.token = opToken
        this.advance()
        parentNode.children.push(unaryRecursiveNode)
        this.unary(unaryRecursiveNode)

        return true
    }


    primary = (parentNode) => {
        //primary -> NUMBER | STRING | true | false | nil | "(" expression ")"|IDENTIFIER|epsilon
        const token = this.matchTokens([Scanner.NUMBER, Scanner.STRING,
        Scanner.TRUE, Scanner.FALSE, Scanner.NIL, Scanner.LEFT_PAREN, Scanner.IDENTIFIER,
        Scanner.FUNC, Scanner.THIS])
        if (token === null) {
            //primary -> epsilon
            return false
        }

        this.checkThisInMethod(token)

        const primaryNode = this.createParseTreeNode(parentNode, "primary")
        if (token.token === Scanner.LEFT_PAREN) {
            //over the left paren
            this.advance()
            //primary -> ( expression )
            this.expression(primaryNode)
            if (!this.matchTokens([Scanner.RIGHT_PAREN])) {
                throw new Error("Missing match ) in expression")
            }
            primaryNode.attributes = {
                value: "grouping",
            }
            //over the right paren
            this.advance()
        }
        else if (token.token === Scanner.FUNC) {
            //assigning function
            //over the func keyword
            //bug fix 
            primaryNode.token = token
            this.advance()
            this.funcDecl(primaryNode)
        }
        else {
            //number, string, identifier come here
            primaryNode.attributes = {
                value: token.lexeme,
            }
            primaryNode.token = token
            //over number, string , identifier
            this.advance()
        }

        parentNode.children.push(primaryNode)



        return true
    }

}