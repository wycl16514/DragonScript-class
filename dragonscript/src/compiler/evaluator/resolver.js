import Scanner from "../scanner/token";

export default class Resolver {
    constructor() {
        //golbal env
        this.currentEnv = {
            previous: null,
            env: {},
        }

        this.globalEnv = this.currentEnv

        /*
        handle such case:
        var a = a+1;
        */
        this.scores = [{}]
    }

    declare = (name) => {
        if (this.scores.length === 0) {
            return
        }

        const score = this.scores[this.scores.length - 1]
        score[name] = false
    }

    define = (name) => {
        if (this.scores.length === 0) {
            return
        }

        const score = this.scores[this.scores.length - 1]
        score[name] = true
    }

    resolveLocal = (node) => {
        /*
        find the env object that contains the variable for the given node,
        and attach the env with node
        */
        let currentEnv = node.env
        const name = node.token.lexeme
        while (currentEnv) {
            //bug fix
            if (currentEnv.env.hasOwnProperty(name) ||
                (currentEnv.env["callMap"] && currentEnv.env["callMap"][name])) {
                node.env = currentEnv
                //bug fix
                return
            }
            //traverse backward to look up given variable
            currentEnv = currentEnv.previous
        }

        //check the given name is function or not
        if (node.env[name] || (node.env["callMap"] && node.env["callMap"][name])) {
            return
        }

        //given variable is undefined
        throw new Error(`undefined variable with name ${name}`)
    }

    visitChildren = (node) => {
        for (const child of node.children) {
            //attach the current env object to the node
            child["env"] = this.currentEnv
            child.accept(this)
        }
    }

    visitRootNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitProgramNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitDeclarationRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    //bug fix
    visitVarDeclarationNode = (parent, node) => {
        /*
        var a = "global";
        var a;
        prevent:
        var a = a + 1;
        */
        this.declare(node.attributes.value)
        this.visitChildren(node)
        this.define(node.attributes.value)

        const variableName = node.attributes.value
        if (node.token.lexeme === "let") {
            this.currentEnv.env[variableName] = ""
            node["env"] = this.currentEnv
        } else {
            //bug fix
            this.globalEnv.env[variableName] = ""
            node["env"] = this.globalEnv
        }
    }


    visitStatementRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitBlockNode = (parent, node) => {
        /*
        in block statement, create a new env for the current block
        */
        const blockEnv = {
            previous: this.currentEnv,
            env: {},
        }

        this.currentEnv = blockEnv
        node["env"] = this.currentEnv
        //need to check whether it is the function body or not
        //if it is then we need to append parameters of the funcion into the env obj
        if (node["func_params"]) {
            const paramsNode = node["func_params"]
            const paramsList = paramsNode.attributes.value
            for (const param of paramsList) {
                this.currentEnv.env[param] = ""
            }
        }

        for (const child of node.children) {
            child["env"] = this.currentEnv
            child.accept(this)
        }

        //when we out of the current block, switch back the env
        this.currentEnv = this.currentEnv.previous
    }

    visitStatementNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitIfStmtNode = (parent, node) => {
        /*
        resovle variables in if conditon, if body and the else body
        */
        const condition = node.children[0]
        condition.accept(this)
        const ifBlock = node.children[1]
        ifBlock.accept(this)
        const elseBlock = node.children[2]
        if (elseBlock) {
            elseBlock.accept(this)
        }
    }

    visitElseStmtNode = (parent, node) => {
        this.visitChildren(node)
    }

    //bug fix
    //visitPrintStatementNode
    visitPrintStatementNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitExpressionNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitAssignmentNode = (parent, node) => {
        //resolve the right side of =
        this.visitChildren(node)
    }

    visitLogicOrNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitLogicAndNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitContinueNode = (parent, node) => {

    }

    visitBreakNode = (parent, node) => {

    }

    visitWhileNode = (parent, node) => {
        const condition = node.children[0]
        condition.accept(this)
        const body = node.children[1]
        body.accept(this)
    }

    visitForNode = (parent, node) => {
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

        if (forChecking) {
            forChecking.accept(this)
        }

        if (forChanging) {
            forChanging.accept(this)
        }

        forBlock.accept(this)
    }

    visitForInitNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitForCheckingNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitForChangingNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitEqualityNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitComparisonNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitComparisonRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitClassNode = (parent, node) => {
        if (!node.env.callMap) {
            node.env["callMap"] = {}
        }
        node.env["callMap"][node.attributes.value] = "func"
        this.visitChildren(node)

        //sneak a this keyword to the env of class block 
        for (const child of node.children) {
            if (child.name === "block") {
                const env = child.env.env
                //disable resolver complaining about the this
                env["this"] = ""
            }
        }
    }

    visitGetNode = (parent, node) => {
        node.env[node.attributes.value] = ""
        this.visitChildren(node)
    }


    visitEqualityRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitTermNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitTermRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitFactorNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitFactorRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    //bug fix
    visitUnaryNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitUnaryRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitPrimaryNode = (parent, node) => {
        if (node.attributes.value === "grouping") {
            this.visitChildren(node)
            return
        }

        const token = node.token
        switch (token.token) {
            case Scanner.FUNC:
                /*
                var aa = func () {print(a);}
                */
                const func = node.children[0]
                func["env"] = node.env
                func.accept(this)
                break
            case Scanner.IDENTIFIER:
                const name = token.lexeme
                //seach which env contains the identifier
                //var a = a+1
                if (this.scores.length !== 0) {
                    const score = this.scores[this.scores.length - 1]
                    if (score[name] === false) {
                        throw new Error("can't have newly defined variable in its own initializer")
                    }
                }

                this.resolveLocal(node)
                break
            default:
                return
        }
    }

    visitCallNode = (parent, node) => {
        //resolve arguments in the call
        const args = node.children[0]
        this.visitChildren(args)
    }

    visitArgumentsNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitFuncDeclNode = (parent, node) => {

        if (!node.env["callMap"]) {
            node.env["callMap"] = {}
        }
        node.env["callMap"][node["func_name"]] = "func"
        const body = node.children[1]
        //attach the body of function with its parameters
        //resolve its parameters with env of body
        body["func_params"] = node.children[0]
        body.accept(this)
    }


    visitParametersNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitReturnNode = (parent, node) => {
        //return XXX
        if (node.children.length > 0) {
            this.visitChildren(node)
        }
    }
}