grammar Expression;

top
    : expression EOF
    ;

expression
    : additiveExpression
    ;

additiveExpression
    : additiveExpression additiveOperator multiplicativeExpression
    | multiplicativeExpression
    ;

multiplicativeExpression
    : multiplicativeExpression multiplicativeOperator clause
    | clause
    ;

clause
    : '(' expression ')'
    | unaryPrefixOperator clause
    | literal
    ;

unaryPrefixOperator
    : '+'
    | '-'
    | '!'
    ;

additiveOperator
    : '+'
    | '-'
    ;

multiplicativeOperator
    : '*'
    | '/'
    | '%'
    ;

literal
    : decimalLiteral
    | booleanLiteral
    | nullLiteral
    ;

decimalLiteral
    : Decimal
    ;

booleanLiteral
    : 'true'
    | 'false'
    ;

nullLiteral
    : 'null'
    ;

Decimal
    : [0-9]+ ('.' [0-9]*)? | '.' [0-9]+
    ;
