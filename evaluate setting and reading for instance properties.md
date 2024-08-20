In previous section, we enable our parser to understand code for getting and setting properties on given instance, from this section, we check how interpreter can exucte those code, we first give the test case:
```js
it("should execute code for setting and getting for different instance correctly", () => {
        let code =
            `
        class Bird {
            func fly(place ){
                print("The bird is flying at");
                print(place);
            }
        }
        var a = Bird();
        var b = Bird();
        print(a.feather);
        a.feather = "red";
        b.feather = "green";
        print(a.feather);
        print(b.feather);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(3)
        expect(console[0]).toEqual("NIL")
        expect(console[1]).toEqual("red")
        expect(console[2]).toEqual("green")
```
Run the case and make sure it fails. For different instances with the same class, it is understandable that, they can have they own properties without interference with each other. That is to say different 
instance may have the same property but aissign it with different values as shown on the test case. And we need to make sure that, the behavior for the same method should execute the same code, that is to say
if two instances call the fly method and input the same content for the place parameter, they should get the same result.

Therefore we need to enable different memory space for different instances but they should share the same code space. Since we are using parsing tree for code execution, and we attach env object on nodes of the
parsing tree which serve as memory space, then when interpreter executes codes like following:

```js
var a = Bird()
var b = Bird()
```
We need to map variable a and b to the root node of the class parsing tree, which is as following:




