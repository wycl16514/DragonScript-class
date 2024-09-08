import Scanner from "../scanner/token"
import RunTime from "../runtime/runtime"
import Resolver from "./resolver"
import RecursiveDescentParser from "../parser/recursive_descent_parser"

export default class Intepreter {
    constructor() {
        this.parser = new RecursiveDescentParser('')
        this.resolver = new Resolver()
        this.runTime = new RunTime(this.parser)
        //flags for break and continue
        this.isContinue = false
        this.isBreak = false

        this.inLoop = false

        this.isReturn = false

        this.inFunc = 0
    }

    attachEvalResult = (parent, node) => {
        parent.evalRes = node.evalRes
    }

    visitChildren = (node) => {
        for (const child of node.children) {
            child.accept(this)
        }
    }

    visitRootNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitProgramNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitDeclarationRecursiveNode = (parent, node) => {
        for (const child of node.children) {
            child.accept(this)
            /*
           if just execute break or continue, stop executing the 
           folowing statements,but the break or continue can only
           exeute for the block that is child of while or for
           */
            if (this.isContinue || this.isBreak) {
                if (!this.inLoop) {
                    throw new Error("break or continue can only happen in while or for loop")
                }
                break
            }

            if (this.isReturn) {
                this.isReturn = false
                break
            }
        }
        this.attachEvalResult(parent, node)
    }

    visitBlockNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }


    visitVarDeclarationNode = (parent, node) => {
        this.visitChildren(node)
        //var a;
        let assignedVal = node.evalRes
        const variableName = node.attributes.value

        //avoid name collision with function
        if (this.runTime.getFunction(variableName, node)) {
            throw new Error("variable name collision with defined function")
        }

        if (assignedVal === undefined) {
            //init value to null for unassigned variable
            assignedVal = {
                type: "NIL",
                value: "null",
            }
        }

        this.runTime.bindVariable(variableName, assignedVal, node)

        this.attachEvalResult(parent, node)
    }

    visitAssignmentNode = (parent, node) => {
        this.visitChildren(node)
        if (node.attributes) {
            const name = node.attributes.value
            const val = node.evalRes

            //check the name is function or not
            if (this.runTime.getFunction(name, node)) {
                throw new Error("can't assign value to function name")
            }

            this.runTime.bindVariable(name, val, node)
        }
        this.attachEvalResult(parent, node)
    }

    visitStatementRecursiveNode = (parent, node) => {
        this.visitChildren(node)
        if (node.evalRes) {
            this.attachEvalResult(parent, node)
        }
    }

    visitPrintStatementNode = (parent, node) => {
        this.visitChildren(node)
        const exprEval = node.children[0].evalRes
        node.evalRes = {
            type: "print",
            value: exprEval.value,
        }
        //put the print content to the console of runtime
        this.runTime.outputConsole(exprEval.value)
        this.attachEvalResult(parent, node)
    }

    visitStatementNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    isEvalToTrue = (evalRes) => {
        if (evalRes) {
            if (evalRes.type === "number") {
                return evalRes.value > 0;
            }
            if (evalRes.type === "boolean") {
                return evalRes.value
            }
        }


        return false
    }

    visitIfStmtNode = (parent, node) => {
        const condition = node.children[0]
        //evaluate the if condition
        condition.accept(this)
        if (this.isEvalToTrue(condition.evalRes)) {
            //condition is true then evalue the second child which is a block node
            const ifBlock = node.children[1]
            ifBlock.accept(this)
            node.evalRes = ifBlock.evalRes
        } else {
            //if there is else statement then evaluate it
            const elseBlock = node.children[2]
            if (elseBlock) {
                elseBlock.accept(this)
                node.evalRes = elseBlock.evalRes
            }
        }

        this.attachEvalResult(parent, node)
    }

    visitElseStmtNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitContinueNode = (parent, node) => {
        this.isContinue = true
    }

    visitBreakNode = (parent, node) => {
        this.isBreak = true
    }

    resetBreakContinue = () => {
        this.isBreak = false
        this.isContinue = false
    }

    visitWhileNode = (parent, node) => {
        this.inLoop = true

        const condition = node.children[0]
        const body = node.children[1]
        while (true) {
            condition.accept(this)
            if (!this.isEvalToTrue(condition.evalRes)) {
                break
            }
            body.accept(this)
            node.evalRes = body.evalRes
            const isBreak = this.isBreak
            this.resetBreakContinue()
            if (isBreak) {
                break
            }
        }

        this.inLoop = false
        this.attachEvalResult(parent, node)
    }

    visitForNode = (parent, node) => {
        this.inLoop = true

        let forInit = null
        let forChecking = null
        let forChanging = null
        let forBlock = null
        for (const child of node.children) {
            switch (child.name) {
                case "for_init":
                    forInit = child;
                    break
                case "for_checking":
                    forChecking = child
                    break
                case "for_changing":
                    forChanging = child
                    break
                case "block":
                    forBlock = child
                    break
            }
        }

        if (forInit) {
            forInit.accept(this)
        }

        while (true) {
            if (forChecking) {
                forChecking.accept(this)
                if (!this.isEvalToTrue(forChecking.evalRes)) {
                    break
                }
            }

            forBlock.accept(this)
            node.evalRes = forBlock.evalRes

            const isBreak = this.isBreak
            this.resetBreakContinue()
            if (isBreak) {
                break
            }

            if (forChanging) {
                forChanging.accept(this)
            }
        }

        this.inLoop = false
        this.attachEvalResult(parent, node)
    }

    visitForInitNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitForCheckingNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitForChangingNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitLogicOrNode = (parent, node) => {
        for (const child of node.children) {
            child.accept(this)
            node.evalRes = child.evalRes
            if (this.isEvalToTrue(node.evalRes)) {
                break
            }
        }
        this.attachEvalResult(parent, node)
    }

    visitLogicAndNode = (parent, node) => {
        for (const child of node.children) {
            child.accept(this)
            node.evalRes = child.evalRes
            if (!this.isEvalToTrue(node.evalRes)) {
                break
            }
        }

        this.attachEvalResult(parent, node)
    }

    visitExpressionNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitEqualityNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitComparisonNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitEqualityRecursiveNode = (parent, node) => {
        this.visitChildren(node)
        const leftRes = node.children[0].evalRes
        const rightRes = node.children[1].evalRes

        this.typeIncompatibleError(leftRes, rightRes, node.attributes.value)

        const type = "boolean"
        if (leftRes.type === "nil" && rightRes.type === "nil") {
            node.evalRes = {
                type: type,
                value: true
            }
        } else {
            if (leftRes.type !== rightRes.type) {
                //nil and class instance in futhure
                throw new Error("only support equality comparison for the same type")
            }
            switch (node.attributes.value) {
                case "==":
                    node.evalRes = {
                        type: type,
                        value: leftRes.value === rightRes.value
                    }
                    break
                case "!=":
                    node.evalRes = {
                        type: type,
                        value: leftRes.value !== rightRes.value
                    }
                    break
                default:
                    throw new Error(`equality recursive for unkonwn operator ${node.attributes.value}`)
            }
        }

        this.attachEvalResult(parent, node)
    }

    visitComparisonRecursiveNode = (parent, node) => {
        this.visitChildren(node)
        const leftRes = node.children[0].evalRes
        const rightRes = node.children[1].evalRes

        this.typeIncompatibleError(leftRes, rightRes, node.attributes.value)

        const type = "boolean"
        switch (node.attributes.value) {
            case "<=":
                node.evalRes = {
                    type: type,
                    value: leftRes.value <= rightRes.value
                }
                break
            case "<":
                node.evalRes = {
                    type: type,
                    value: leftRes.value < rightRes.value
                }
                break
            case ">":
                node.evalRes = {
                    type: type,
                    value: leftRes.value > rightRes.value
                }
                break
            case ">=":
                node.evalRes = {
                    type: type,
                    value: leftRes.value >= rightRes.value
                }
                break
            default:
                throw new Error(`comparison recursive for unknown operator: ${node.attributes.value}`)
        }
        this.attachEvalResult(parent, node)
    }

    visitTermNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    typeIncompatibleError = (leftRes, rightRes, op) => {
        switch (op) {
            case "==":
            case "!=":
                if (leftRes.type !== rightRes.type) {
                    throw new Error(`binary operation on different type for ${leftRes.type} and ${rightRes.type} for operation ${op}`)
                }
                break
            case "*":
                if (leftRes.type !== "number" && rightRes.type !== "number") {
                    throw new Error(`binary operation on different type for ${leftRes.type} and ${rightRes.type} for operation ${op}`)
                }
                break
            case "-":
            case "/":
            case ">":
            case ">=":
            case "<":
            case "<=":
                if (leftRes.type !== "number" || rightRes.type !== "number") {
                    throw new Error(`binary operation on different type for ${leftRes.type} and ${rightRes.type} for operation ${op}`)
                }
                break
        }
    }

    visitTermRecursiveNode = (parent, node) => {
        this.visitChildren(node)

        const leftRes = node.children[0].evalRes
        const rightRes = node.children[1].evalRes
        this.typeIncompatibleError(leftRes, rightRes, node.attributes.value)

        let type = "number"
        switch (node.attributes.value) {
            case "+":
                if (leftRes.type === "number" && rightRes.type === "string") {
                    type = "string"
                    leftRes.value = leftRes.value.toString()
                }
                if (leftRes.type === "string" && rightRes.type === "number") {
                    type = "string"
                    rightRes.value = rightRes.value.toString()
                }
                if (leftRes.type === "string" || rightRes.type === "string") {
                    type = "string"
                }

                node.evalRes = {
                    type: type,
                    value: leftRes.value + rightRes.value
                }
                break
            case "-":
                node.evalRes = {
                    type: type,
                    value: leftRes.value - rightRes.value
                }
                break
            default:
                throw new Error(`unknown operator for term_recursive: ${node.attributes.value}`)
        }

        this.attachEvalResult(parent, node)
    }

    visitFactorNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitFactorRecursiveNode = (parent, node) => {
        this.visitChildren(node)
        const leftRes = node.children[0].evalRes
        const rightRes = node.children[1].evalRes

        this.typeIncompatibleError(leftRes, rightRes, node.attributes.value)

        let type = "number"
        switch (node.attributes.value) {
            case "*":
                if (leftRes.type === "number" && rightRes.type === "string") {
                    type = "string"
                    node.evalRes = {
                        type: type,
                        value: rightRes.value.repeat(leftRes.value)
                    }
                } else if (leftRes.type === "string" && rightRes.type === "number") {
                    type = "string"
                    node.evalRes = {
                        type: type,
                        value: leftRes.value.repeat(rightRes.value)
                    }
                } else {
                    node.evalRes = {
                        type: type,
                        value: leftRes.value * rightRes.value
                    }
                }

                break
            case "/":
                node.evalRes = {
                    type: type,
                    value: leftRes.value / rightRes.value
                }
                break
            default:
                throw new Error(`unknown operator for factor_recursive: ${node.attributes.value}`)
        }

        this.attachEvalResult(parent, node)
    }

    visitUnaryNode = (parent, node) => {
        this.visitChildren(node)
        this.attachEvalResult(parent, node)
    }

    visitUnaryRecursiveNode = (parent, node) => {
        this.visitChildren(node)
        if (node.attributes.value === "-") {
            node.evalRes.value = -node.evalRes.value
        }
        if (node.attributes.value === "!") {
            if (node.evalRes.type === "NIL") {
                node.evalRes = {
                    type: "boolean",
                    value: true,
                }
            }
            else if (node.evalRes.type === "boolean") {
                if (node.evalRes.value === false) {
                    node.evalRes.value = true
                } else {
                    node.evalRes.value = false
                }
            } else {
                node.evalRes = {
                    type: "boolean",
                    value: false,
                }
            }
        }
        this.attachEvalResult(parent, node)
    }

    visitPrimaryNode = (parent, node) => {
        /*
        if the primary node is grouping, then we need to evaluae its child(expression)
        */
        if (node.attributes.value === "grouping") {
            this.visitChildren(node)
            this.attachEvalResult(parent, node)
            return
        }

        const token = node.token
        let type = undefined
        let value = undefined
        switch (token.token) {
            case Scanner.FUNC:
                type = "func"
                value = node.children[0] //root of function declaration
                break
            case Scanner.IDENTIFIER:
                const name = token.lexeme
                //buf fix
                /*
                when evaluate an identifier, we first check its a function name
                or not, if it is not a function name, then we query its value 
                from enviroment
                */
                const func = this.runTime.getFunction(name, node)
                if (func && func.type === "func") {
                    type = "func"
                    value = name
                }
                else {
                    const val = this.runTime.getVariable(name, node)
                    type = val.type
                    value = val.value
                }

                break
            case Scanner.NUMBER:
                type = "number"
                if (token.lexeme.indexOf(".") === -1) {
                    value = parseInt(token.lexeme)
                } else {
                    value = parseFloat(token.lexeme)
                }
                break
            case Scanner.STRING:
                type = "string"
                value = token.lexeme
                break
            case Scanner.TRUE:
                type = "boolean"
                value = true
                break
            case Scanner.FALSE:
                type = "boolean"
                value = false
                break
            case Scanner.NIL:
                type = "NIL"
                value = null
                break
        }

        parent.evalRes = {
            type: type,
            value: value,
        }
    }

    visitClassNode = (parent, node) => {
        const name = node.attributes.value
        this.runTime.addFunction(name, {
            type: "func",
            value: node,
        })

        //add methods to the class env
        this.visitChildren(node)
    }

    fillCallParames = (funcRoot, callNode) => {
        const args = callNode.children[0]
        if (args.children.length !== funcRoot.children[0].attributes.value.length) {
            throw new Error("arguments in calling mismatch parameters in declaration")
        }
        /*
        check the function being call need parameters or not, if needed,
        evaluate the arguments and fill in arguments to the local env
        for the function being call
        */
        if (funcRoot.children[0].attributes.value &&
            //bug fix
            funcRoot.children[0].attributes.value.length) {
            const args = callNode.children[0]
            this.visitChildren(args)
            //get name of each parameter
            let paraNames = funcRoot.children[0].attributes.value
            //bug fix
            const body = funcRoot.children[1]
            for (let i = 0; i < paraNames.length; i++) {
                this.runTime.bindVariable(paraNames[i], args.children[i].evalRes, body)
            }
        }
    }

    searchNode = (node, name, callback) => {
        if (node.name === name) {
            const res = callback(node)
            if (res) {
                return node
            }

            return undefined
        }

        for (let child of node.children) {
            const resNode = this.searchNode(child, name, callback)
            if (resNode) {
                return resNode
            }
        }

        return undefined
    }

    initClass = (classNode, callNode) => {
        const body = classNode.children[0]
        let initNode = undefined
        const callback = (node) => {
            if (node.attributes.value === "init") {
                return true
            }
            return false
        }

        initNode = this.searchNode(body, "func_decl", callback)
        if (initNode) {
            this.inFunc += 1

            this.fillCallParames(initNode, callNode)
            initNode.children[1].accept(this)

            this.inFunc -= 1
        }
    }

    handleClassCall = (parent, node) => {
        const callName = node.attributes.value
        if (callName === "anonymous_call") {
            return false
        }

        //if chain call, node would be empty
        const rootNode = this.runTime.getFunction(callName, node)
        if (!rootNode || rootNode.name !== "class") {
            return false
        }

        node.evalRes = {
            type: "class",
            value: `An instance of class ${node.attributes.value}`,
            instance: this.runTime.copyParsingNodes(parent, rootNode),
        }

        /*
        coping env objects on the node, but env object is saving methods node from the 
        original parsing tree, we want the env object to contains methods node from the
        copied tree
        */
        node.evalRes.instance.accept(this.resolver)
        node.evalRes.instance.accept(this)

        this.initClass(node.evalRes.instance, node)

        this.attachEvalResult(parent, node)
        return true
    }

    visitGetNode = (parent, node) => {
        const name = node.attributes.value
        const res = this.runTime.getVariable(name, node)
        node.evalRes = res
        this.attachEvalResult(parent, node)
    }

    visitCallNode = (parent, node) => {
        if (this.handleClassCall(parent, node)) {
            return
        }

        //get the name of the function
        const callName = node.attributes.value
        let funcRoot = undefined
        if (callName !== "anonymous_call") {
            funcRoot = this.runTime.getFunction(callName, node)
        } else {
            funcRoot = this.runTime.getAnonymousCall()
        }
        if (!funcRoot) {
            const val = this.runTime.getVariable(callName, node)
            if (val.type !== "func") {
                throw new Error("can not call on variable never assigned with function")
            }
            funcRoot = val.value
        }
        if (funcRoot) {
            //this.runTime.addCallMap()

            this.inFunc += 1

            //fill in the value for parameters
            this.fillCallParames(funcRoot, node)
            //evaluate the body of the function
            funcRoot.children[1].accept(this)

            let evalRes = funcRoot.evalRes
            if (!evalRes["is_return"]) {
                //there is not return in the body of function
                evalRes = {
                    type: "NIL",
                    value: "null",
                }
            }
            node.evalRes = evalRes
            //if the returned object is function then add it to run time
            if (evalRes.type === "func") {
                this.runTime.addAnonymousCall(evalRes.value)
            }

            //bug fix
            //this.runTime.removeCallMap()

            this.inFunc -= 1
            this.visitChildren(node)
            this.attachEvalResult(parent, node)
        }



        this.attachEvalResult(parent, node)
    }

    visitArgumentsNode = (parent, node) => {
        //evaluate the value for each argument
        //func addA(b);var b = 2; addA(b)
        this.visitChildren(node)
    }

    visitFuncDeclNode = (parent, node) => {
        let collisionWithVar = false
        try {
            this.runTime.getVariable(node["func_name"], node)
            collisionWithVar = true
        } catch (e) {
            //if there is not name collision with variabe
            //getVariable will throw exeception
        }
        if (!collisionWithVar) {
            if (this.runTime.getFunction(node["func_name"], node)) {
                throw new Error("Function already defined")
            }
            //add the function name and the node to call map
            this.runTime.addFunction(node["func_name"], {
                type: "func",
                value: node,
            })
        } else {
            throw new Error("function name collision with defined variable")
        }

        node.evalRes = {
            type: "func",
            value: node,
        }
        this.attachEvalResult(parent, node)
    }

    visitParametersNode = (parent, node) => {
        //do nothing
    }

    visitReturnNode = (parent, node) => {
        if (this.inFunc <= 0) {
            throw new Error("return only allowed in function body")
        }
        this.isReturn = true
        if (node.children.length > 0) {
            this.visitChildren(node)
        } else {
            node.evalRes = {
                type: "NIL",
                value: "null",
            }
        }

        node.evalRes["is_return"] = true
        this.attachEvalResult(parent, node)
    }
}