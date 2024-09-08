import clone from "clone"

export default class RunTime {
    constructor(parser) {
        this.parser = parser
        //console is a string buffer to receive output from print statement
        this.console = []

        this.returned_call = undefined
    }

    getAnonymousCall = () => {
        const functRoot = this.returned_call
        this.returned_call = undefined
        return functRoot
    }

    addAnonymousCall = (funcRoot) => {
        this.returned_call = funcRoot
    }

    getInstanceEnv = (node) => {
        /*
        we need to get the instance, then get the class root node, get the 
        block node from the class parsing tree, get the env from the block node,
        query the root node for the given method
        a.b()
        */
        const instanceName = node.parent.attributes.value
        const classInstance = node.parent.env.env[instanceName]
        const classNode = classInstance.instance
        let body = undefined
        for (let node of classNode.children) {
            if (node.name === "block") {
                body = node
                break
            }
        }

        return body.env.env
    }

    getFunction = (funcName, node) => {
        let res = undefined
        if (node["method"]) {
            const instanceEnv = this.getInstanceEnv(node)
            res = instanceEnv[funcName]
        } else {
            const env = node.env.env
            res = env[funcName]
        }

        if (res && res["type"] === "func") {
            return res.value
        }

        return undefined
    }

    addFunction = (funcName, funcNode) => {
        const env = funcNode.value.env.env
        env[funcName] = funcNode
    }

    bindVariable = (name, value, node) => {
        if (node["getter"]) {
            /*
            a.b = 1;
            */
            const left = node["getter"]
            const parent = left["parent"]
            const instanceName = parent.attributes.value
            const fieldName = left.attributes.value
            if (instanceName === "this") {
                //this is inside a function, env of the node is the env of function
                const blockEnv = parent.env.previous.env
                blockEnv[fieldName] = value
                return
            } else {
                const env = parent.env.env
                if (!env[instanceName]) {
                    throw new Error(`instance of ${instanceName} is not exist`)
                }
                const classNode = env[instanceName].instance
                let body = undefined
                for (let node of classNode.children) {
                    if (node.name === "block") {
                        body = node
                        break
                    }
                }

                const classEnv = body.env.env

                classEnv[fieldName] = value
                return
            }

        }

        let currentEnv = node.env
        while (currentEnv) {
            //bug fix
            if (currentEnv.env.hasOwnProperty(name)) {
                break
            }

            //traverse backward to look up given variable
            currentEnv = currentEnv.previous
        }

        currentEnv.env[name] = value
    }

    getVariable = (name, node) => {
        if (node.name === "get") {
            /*
            a.b
            */
            const parent = node["parent"]
            if (parent.attributes.value === "this") {
                /*
                class A{
                    func b() {
                        return this.c;
                    }
                }
                */
                const env = parent.env.previous.env
                return env[node.attributes.value]
            } else {
                const instanceName = parent.attributes.value
                const field = node.attributes.value
                const classNode = parent.env.env[instanceName].instance
                let body = undefined
                for (let node of classNode.children) {
                    if (node.name === "block") {
                        body = node
                        break
                    }
                }

                const instanceEnv = body.env.env
                if (!instanceEnv[field]) {
                    return {
                        type: "NIL",
                        value: "null",
                    }
                }

                return instanceEnv[field]
            }
        }

        const env = node["env"].env
        if (!env[name]) {
            throw new Error(`undefined variable with name ${name}`)
        }

        return env[name]
    }

    copyParsingNodes = (parent, root) => {
        /*
        make a copy of the parsing tree with given root, need to copy
        the env obj attaching to nodes of the tree, and need to adjust
        its previous field to the newly created env obj
        */
        const children = root.children

        root.children = []
        const clonedRoot = clone(root)
        root.children = children

        this.clonedRoot = clonedRoot
        //for debugging purpose
        clonedRoot["debug"] = true
        clonedRoot["env"]["debug"] = true
        this.parser.addAcceptForNode(parent, clonedRoot)

        this.cloneField(clonedRoot, ["parent", "getter"])
        this.cloneChildren(clonedRoot, root)

        delete this.clonedRoot

        return clonedRoot
    }

    findClonedNodeByID = (node, uuid) => {
        //depth first search
        if (node.uuid === uuid) {
            return node
        }

        for (let child of node.children) {
            const res = this.findClonedNodeByID(child, uuid)
            if (res) {
                return res
            }
        }

        return undefined
    }

    cloneField = (clonedNode, fieldNames) => {
        for (const fieldName of fieldNames) {
            if (clonedNode.hasOwnProperty(fieldName)) {
                const uuid = clonedNode[fieldName].uuid
                const node = this.findClonedNodeByID(this.clonedRoot, uuid)
                if (!node) {
                    throw new Error(`fail to copy field with name ${fieldName}`)
                }
                clonedNode[fieldName] = node
            }
        }
    }



    cloneChildren = (node, originNode) => {
        node.children = []
        for (const child of originNode.children) {
            const children = child.children
            child.children = []

            const clonedChild = clone(child)
            if (clonedChild.hasOwnProperty("env")) {
                clonedChild["env"]["debug"] = true
            }

            child.children = children
            node.children.push(clonedChild)
            this.parser.addAcceptForNode(node, clonedChild)
            this.cloneField(clonedChild, ["parent", "getter"])

            if (child.name === "block") {
                clonedChild["env"].previous = node["env"]
            }

            this.cloneChildren(clonedChild, child)
        }
    }

    outputConsole = (content) => {
        this.console.push(content)
    }
}