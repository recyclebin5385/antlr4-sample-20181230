(function(root) {
    // module.exportsがない環境でも使えるようにする
    var myModule = {};
    var oldMyModule = root.ParserSample1;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = myModule;
    } else {
        root.ParserSample1 = myModule;
    }

    myModule.noConflict = function() {
        root.ParserSample1 = oldMyModule;
        return myModule;
    };


    function ConstantValueContainer(value) {
        this.value = value;
    }

    ConstantValueContainer.prototype = {
        getValue: function() {
            return this.value;
        }
    }

    var antlr4 = require("antlr4");
    var ExpressionLexer = require("./ExpressionLexer").ExpressionLexer;
    var ExpressionParser = require("./ExpressionParser").ExpressionParser;
    var ExpressionVisitor = require("./ExpressionVisitor").ExpressionVisitor;

    var myVisitor = new ExpressionVisitor();

    myVisitor.visitOnlyChild = function(ctx) {
        return this.visit(ctx.children[0]);
    };

    myVisitor.visitBinaryExpression = function(ctx) {
        var left = this.visit(ctx.children[0]).getValue();
        var right = this.visit(ctx.children[2]).getValue();

        var value;
        switch(ctx.children[1].getText()) {
        case "+":
            value = left + right;
            break;

        case "-":
            value = left - right;
            break;

        case "*":
            value = left * right;
            break;

        case "/":
            value = left / right;
            break;

        case "%":
            value = left % right;
            break;

        default:
            throw "unknown operator";
        }

        return new ConstantValueContainer(value);
    };

    myVisitor.visitTop = myVisitor.visitOnlyChild;

    myVisitor.visitExpression = myVisitor.visitOnlyChild;

    myVisitor.visitAdditiveExpression = function(ctx) {
        switch(ctx.children.length) {
        case 1:
            return this.visitOnlyChild(ctx);

        case 3:
            return this.visitBinaryExpression(ctx);

        default:
            throw "unknown node count";
        }
    }

    myVisitor.visitMultiplicativeExpression = function(ctx) {
        switch(ctx.children.length) {
        case 1:
            return this.visitOnlyChild(ctx);

        case 3:
            return this.visitBinaryExpression(ctx);

        default:
            throw "unknown node count";
        }
    }

    myVisitor.visitClause = function(ctx) {
        switch(ctx.children.length) {
        case 1:
            return this.visitOnlyChild(ctx);

        case 2:
            var value = this.visit(ctx.children[1]).getValue();
            switch(ctx.children[0].getText()) {
            case "+":
                return this.visit(ctx.children[1]);

            case "-":
                return new ConstantValueContainer(0 - this.visit(ctx.children[1]).getValue());

            case "!":
                return new ConstantValueContainer(!Boolean(this.visit(ctx.children[1]).getValue()));

            default:
                throw "unknown operator";
            }

        case 3:
            return this.visit(ctx.children[1]);

        default:
            throw "unknown node count";
        }
    };

    myVisitor.visitLiteral = myVisitor.visitOnlyChild;

    myVisitor.visitDecimalLiteral = function(ctx) {
        return new ConstantValueContainer(Number(ctx.getText()));
    };

    myVisitor.visitBooleanLiteral = function(ctx) {
        return new ConstantValueContainer(ctx.getText() === "true");
    };

    myVisitor.visitNullLiteral = function(ctx) {
        return new ConstantValueContainer(null);
    };


    myModule.eval = function(expression) {
        var chars = new antlr4.InputStream(expression);
        var lexer = new ExpressionLexer(chars);
        var tokens  = new antlr4.CommonTokenStream(lexer);
        var parser = new ExpressionParser(tokens);
        parser.buildParseTrees = true;

        var tree = parser.top();

        return myVisitor.visitTop(tree).getValue();
    }

    return myModule;
})(this);