import RecursiveDescentParser from "../parser/recursive_descent_parser"

export default class TreeAdjustVisitor {

    constructor() {
        this.parser = new RecursiveDescentParser("")
    }


    visitChildren = (node) => {
        for (const child of node.children) {
            child.accept(this)
        }
    }
    /*
    1. change the child of comparison from term to termRecursive
    2, change term to be the child of termRecursive
    3, remove termRecursive as child of the term
    */
    findNodeInChildren = (parent, child) => {
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i] === child) {
                return i
            }
        }

        return -1
    }

    interChangeParentChild = (parent, child) => {
        const grandfather = parent.parent
        let idx = this.findNodeInChildren(grandfather, parent)
        grandfather.children[idx] = child
        //child.children.push(parent)
        child.children.unshift(parent)

        idx = this.findNodeInChildren(parent, child)
        parent.children.splice(idx, 1)

        this.parser.addAcceptForNode(grandfather, child)
        this.parser.addAcceptForNode(child, parent)

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

    visitVarDeclarationNode = (parent, node) => {
        this.visitChildren(node)
    }


    visitStatementRecursiveNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitClassNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitPrintStatementNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitGetNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitStatementNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitIfStmtNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitElseStmtNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitLogicOrNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitLogicAndNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitWhileNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitContinueNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitBreakNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitForNode = (parent, node) => {
        this.visitChildren(node)
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



    visitBlockNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitExpressionNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitAssignmentNode = (parent, node) => {
        this.visitChildren(node)
    }

    visitEqualityNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitComparisonNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitEqualityRecursiveNode = (parent, node) => {
        this.visitChildren(node)

        this.interChangeParentChild(parent, node)
    }

    visitComparisonRecursiveNode = (parent, node) => {
        this.visitChildren(node)

        this.interChangeParentChild(parent, node)
    }

    visitTermNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitTermRecursiveNode = (parent, node) => {
        this.visitChildren(node)

        this.interChangeParentChild(parent, node)
    }

    visitFactorNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitFactorRecursiveNode = (parent, node) => {
        this.visitChildren(node)

        this.interChangeParentChild(parent, node)
    }

    visitUnaryNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitUnaryRecursiveNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitPrimaryNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitCallNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitArgumentsNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitFuncDeclNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitParametersNode = (parent, node) => {
        node.parent = parent
        this.visitChildren(node)
    }

    visitReturnNode = (parent, node) => {
        this.visitChildren(node)
    }
}