(function(root) {
    // module.exportsがない環境でも使えるようにする
    var moduleName = "ParserSample1";
    var myModule = {};
    var oldMyModule = root[moduleName];

    if (module !== undefined && module.exports) {
        module.exports = myModule;
    } else {
        root[moduleName] = myModule;
    }

    myModule.noConflict = function() {
        root[moduleName] = oldMyModule;
        return myModule;
    };


    function ConstantValueContainer(value) {
        this.value = value;
    }

    ConstantValueContainer.prototype = {
        getValue: function() {
            return this.value;
        }
    };

    var antlr4 = require("antlr4/index");
    var ExpressionLexer = require("./ExpressionLexer").ExpressionLexer;
    var ExpressionParser = require("./ExpressionParser").ExpressionParser;
    var ExpressionVisitor = require("./ExpressionVisitor").ExpressionVisitor;


    // Visitorを継承する
    function EvalVisitor() {
    }

    Object.setPrototypeOf(EvalVisitor.prototype, ExpressionVisitor.prototype);

    EvalVisitor.prototype.visitOnlyChild = function(ctx) {
        return this.visit(ctx.children[0]);
    };

    EvalVisitor.prototype.visitBinaryExpression = function(ctx) {
        var $this = this;

        return {
            getValue: function() {
                var left = $this.visit(ctx.children[0]).getValue();
                var right = $this.visit(ctx.children[2]).getValue();

                switch (ctx.children[1].getText()) {
                case "+":
                    return left + right;

                case "-":
                    return left - right;

                case "*":
                    return left * right;

                case "/":
                    return left / right;

                case "%":
                    return left % right;

                default:
                    throw "unknown operator";
                }
            }
        };
    };

    EvalVisitor.prototype.visitTop = EvalVisitor.prototype.visitOnlyChild;

    EvalVisitor.prototype.visitExpression = EvalVisitor.prototype.visitOnlyChild;

    EvalVisitor.prototype.visitAdditiveExpression = function(ctx) {
        switch (ctx.children.length) {
        case 1:
            return this.visitOnlyChild(ctx);

        case 3:
            return this.visitBinaryExpression(ctx);

        default:
            throw "unknown node count";
        }
    };

    EvalVisitor.prototype.visitMultiplicativeExpression = function(ctx) {
        switch (ctx.children.length) {
        case 1:
            return this.visitOnlyChild(ctx);

        case 3:
            return this.visitBinaryExpression(ctx);

        default:
            throw "unknown node count";
        }
    };

    EvalVisitor.prototype.visitClause = function(ctx) {
        var $this = this;

        switch (ctx.children.length) {
        case 1:
            return $this.visitOnlyChild(ctx);

        case 2:
            switch (ctx.children[0].getText()) {
            case "+":
                return $this.visit(ctx.children[1]);

            case "-":
                return {
                    getValue: function() {
                        return 0 - $this.visit(ctx.children[1]).getValue();
                    }
                };

            case "!":
                return {
                    getValue: function() {
                        return !Boolean($this.visit(ctx.children[1]).getValue());
                    }
                };

            default:
                throw "unknown operator";
            }
            break;

        case 3:
            return this.visit(ctx.children[1]);

        default:
            throw "unknown node count";
        }
    };

    EvalVisitor.prototype.visitLiteral = EvalVisitor.prototype.visitOnlyChild;

    EvalVisitor.prototype.visitDecimalLiteral = function(ctx) {
        return new ConstantValueContainer(Number(ctx.getText()));
    };

    EvalVisitor.prototype.visitBooleanLiteral = function(ctx) {
        return new ConstantValueContainer(ctx.getText() === "true");
    };

    EvalVisitor.prototype.visitNullLiteral = function(ctx) {
        return new ConstantValueContainer(null);
    };


    myModule.eval = function(expression) {
        var chars = new antlr4.InputStream(expression);
        var lexer = new ExpressionLexer(chars);
        var tokens  = new antlr4.CommonTokenStream(lexer);
        var parser = new ExpressionParser(tokens);
        parser.buildParseTrees = true;

        var tree = parser.top();

        return new EvalVisitor().visitTop(tree).getValue();
    };

    return myModule;
}(this));
