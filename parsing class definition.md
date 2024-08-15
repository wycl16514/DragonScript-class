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

        token = this.matchTokens([Scanner.FUNC])
        while (token) {
            //over keyword func
            this.advance()
            this.funcDecl(classNode)
            token = this.matchTokens([Scanner.FUNC])
        }

        token = this.matchTokens([Scanner.RIGHT_BRACE])
        if (!token) {
            throw new Error("class definiton missing }")
        }

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
