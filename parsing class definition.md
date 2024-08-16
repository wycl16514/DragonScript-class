From this section we will add class capability to our language. It will be a large section, we need to do alot of things to enable class in a language. The first thing we need to do is enable the parser to understand the class
syntax, and we add following grammar for class definiton:

```js
declaratoin -> classDecl | ...
classDecl -> CLASS IDENTIFIER LEFT_BRACE method_recursive RIGHT_BRACE
method_recursive -> EPISLON | func_decl
```

In plain language, a class definition is begin with class keyword, then followed by name of the class, then by "{" , and inside the body of class, we have method declaration, which is the same as function we handle before, 
an example for class definiton is like following:

```js
class Bird {
   func fly(place) {
      print("the bird is flying at");
      print(place);
   }
}
```

Let's add the testing case for class parsing first:
```js
describe("Testing class", () => {
    it("should enable parser understand class definition", () => {
        let code = `
            class Bird {
                func fly(place ){
                    print("The bird is flying at");
                    print(place);
                }
            }
            `

        let codeToParse = () => {
            const parser = new RecursiveDescentParser(code)
            const root = parser.parse()
        }

        expect(codeToParse).not.toThrow()
    })
})
```
Run the test and make sure it fails.
We don't define variables inside the body of class and just like js we will allow add fields to class dynamically. Let's add the test case first and we add code to enable parser understand the class definition:

```js
 declarationRecursive = (parent) => {
    ...
     //parsing class definition
        token = this.matchTokens([Scanner.CLASS])
        if (token) {
            this.advance()
            this.classDecl(declNode)
            return this.declarationRecursive(declNode)
        }
    ....
}

 classDecl = (parent) => {
        const classNode = this.createParseTreeNode(parent, "class")
        parent.children.push(classNode)
        let token = this.matchTokens([Scanner.IDENTIFIER])
        classNode.attributes = {
            value: token.lexeme
        }
        this.advance()

        token = this.matchTokens([Scanner.LEFT_BRACE])
        if (!token) {
            throw new Error("class declaration missing left brace")
        }
        this.advance()

        this.block(classNode)
        //bug here, match and skip over right brace
        if (!this.matchTokens([Scanner.RIGHT_BRACE])) {
            throw new Error("Missing right brace for block")
        }
        //over the right brace
        this.advance()
    }

 addAcceptForNode = (parent, node) => {
        switch (node.name) {
        ...
        //add class node 
            case "class":
                node.accept = (visitor) => {
                    visitor.visitClassNode(parent, node)
                }
                break
        ....
        }
}
```
Then we need to add classNode for tree visitor and resolver:
```js
//visit class node
    visitClassNode = (parent, node) => {
        this.visitChildren(node)
    }
```
After aboved code, in the console we input following command:
```js
recursiveparsetree class Bird{func fly(place) {print("bird is flying");}} 
```
And we get the parsing tree like following:
![截屏2024-08-15 23 19 15](https://github.com/user-attachments/assets/d25f10ad-25ea-4c6b-8d8e-47be05963480)

Then run the test again and make sure the newly added test case can be passed. Now we have enabled the parsing of class definition, we need way to create instance for the given class, we adopt the python 
approach, that is by using the class name as function name to create a instance, let's write the test case first:

```js
    it("should create class instance by using the class name as function call", () => {
        let code = `
        class Bird {
            func fly(place ){
                print("The bird is flying at");
                print(place);
            }
        }
        var bird = Bird();
        print(bird);
        `

        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual("A instance of class Bird")
    })

```
As you can see from the case aboved, we create Bird instance by calling a Bird function, and variable bird is some kind of object and can be printed! Run the case and make sure it fail, Since our interpreter 
can only handle function call, and there is not a function declaration with name Bird. In order to make the case passed, in Interpreter, we will treat class definition as function declaration, these two are 
quit the same, class is actuall a function without parameters, therefore we will handle class definition and its instance creation just like function declaration and call, and we first go to resolver.js,
add the following code:
```js
 //add visitClassNode
    visitClassNode = (parent, node) => {
        //record class name as type of function
        //prevent resolveLocal not found error
        node.env[node.attributes.value] = "func"
        this.visitChildren(node)
    }
```
Then go to interpreter.js add the folloiwng code:
```js
    visitClassNode = (parent, node) => {
        /*
        treat class declaration like function declaraton
        */
        const name = node.attributes.value
        //add the function name and node to call map
        this.runTime.addFunction(name, node)
    }


    handleClassCall = (parent, node) => {
        const callName = node.attributes.values
        if (callName === "anonymous_call") {
            return false
        }

        //if chain call, node would be null
        node = this.runTime.getFunction(callName)
        if (!node || node.name !== "class") {
            return false
        }

        node.evalRes = {
            type: "class",
            value: `An instance of class ${node.attributes.value}`,
            instance: node,
        }

        this.attachEvalResult(parent, node)
        return true
    }

visitCallNode = (parent, node) => {
        //check the call is class instance init or not
        if (this.handleClassCall(parent, node)) {
            return
        }
        ....
}
```
Then run the test again and make sure the case can be passed.
