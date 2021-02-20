import React, { Component } from 'react';
import '../css/ScientificCalculator.css';
import PointTarget from 'react-point';

class AutoScalingText extends Component {
    state = {
        scale: 1,
    };

    componentDidUpdate() {
        const { scale } = this.state;
        const node = this.node;
        const parentNode = node.parentNode;
        const availableWidth = parentNode.offsetWidth;
        const actualWidth = node.offsetWidth;
        const actualScale = availableWidth / actualWidth;

        if (scale === actualScale) return;

        if (actualScale < 1) {
            this.setState({ scale: actualScale });
        } else if (scale < 1) {
            this.setState({ scale: 1 });
        }
    }

    render() {
        const { scale } = this.state;

        return (
            <div
                className='auto-scaling-text'
                style={{ transform: `scale(${scale}, ${scale})` }}
                ref={(node) => (this.node = node)}>
                {this.props.children}
            </div>
        );
    }
}

class CalculatorDisplay extends Component {
    render() {
        const { value, ...props } = this.props;
        const language = navigator.language || 'en-US';
        const escapedKeys = [' e ', 'E', '(', ')', 'r', 'o'];
        let isNumeric = true;

        escapedKeys.map((key) => {
            if (value.includes(key)) isNumeric = false;
        });

        const parsedValue = isNumeric ? parseFloat(value) : value;

        let formattedValue = parsedValue.toLocaleString(language, {
            useGrouping: true,
            maximumFractionDigits: 10,
        });

        return (
            <div {...props}>
                <AutoScalingText>{formattedValue}</AutoScalingText>
            </div>
        );
    }
}

class CalculatorKey extends Component {
    render() {
        const { onPress, className, ...props } = this.props;

        return (
            <PointTarget onPoint={onPress}>
                <button className={`calculator-key ${className}`} {...props} />
            </PointTarget>
        );
    }
}

const CalculatorOperations = {
    '/': (prevValue, nextValue) => prevValue / nextValue,
    '*': (prevValue, nextValue) => prevValue * nextValue,
    '+': (prevValue, nextValue) => prevValue + nextValue,
    '-': (prevValue, nextValue) => prevValue - nextValue,
    '=': (prevValue, nextValue) => nextValue,
    nthRoot: (prevValue, nextValue) => Math.pow(parseFloat(nextValue), 1 / prevValue),
    xPowY: (prevValue, nextValue) => Math.pow(parseFloat(prevValue), nextValue),
    logY: (prevValue, nextValue) => Math.log(parseFloat(nextValue)) / Math.log(parseFloat(prevValue)),
    yPowX: (prevValue, nextValue) => Math.pow(parseFloat(nextValue), prevValue),
};


class ScientificCalculator extends Component {
    state = {
        value: null,
        displayValue: '0',
        operator: null,
        waitingForOperand: false,
        done: false,
        shift: false,
        degree: false,
        isMemoryActive: false,
        isBracketsActive: false,
        isLeftBracket: false,
        isRightBracket: false,
        memory: {
            memory_plus: 0,
            memory_minus: 0,
            memory_recall: null,
        },
    };

    handleShiftClick = () => {
        this.setState((state) => {
            return {
                shift: !state.shift,
            };
        });
    };

    handleDegreeClick = () => {
        this.setState((state) => {
            return {
                degree: !state.degree,
            };
        });
    };

    clearAll() {
        this.setState({
            value: null,
            displayValue: '0',
            operator: null,
            waitingForOperand: false,
            done: false,
            isMemoryActive: false,
            isBracketsActive: false,
            isRightBracket: false,
            isDigit: false,
            isOperator: false,
        });
    }

    clearDisplay() {
        this.setState({
            displayValue: '0',
        });
    }

    clearLastChar() {
        const { displayValue } = this.state;

        this.setState({
            displayValue: displayValue.substring(0, displayValue.length - 1) || '0',
        });
    }

    toggleSign() {
        const { displayValue } = this.state;
        const newValue = parseFloat(displayValue) * -1;

        this.setState({
            displayValue: String(newValue),
        });
    }

    inputPercent() {
        const { displayValue } = this.state;
        const currentValue = parseFloat(displayValue);

        if (currentValue === 0) return;

        const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
        const newValue = parseFloat(displayValue) / 100;

        this.setState({
            displayValue: String(newValue.toFixed(fixedDigits.length + 2)),
            done: true,
        });
    }

    inputDot() {
        const { displayValue, waitingForOperand, isRightBracket } = this.state;


        if ( isRightBracket === true){
            this.setState({displayValue: displayValue + '*'+'0.', isRightBracket: false});
        }
        else 
        if (waitingForOperand === true) {
            this.setState({ displayValue: '0.', waitingForOperand: false });
        } else if (!/\./.test(displayValue)) {
            this.setState({
                displayValue: displayValue + '.',
                waitingForOperand: false,
            });
        }
    }

    inputDigit(digit) {
        const { displayValue, waitingForOperand, done, isRightBracket } = this.state;

        if (waitingForOperand) {
            this.setState({
                displayValue: String(digit),
                waitingForOperand: false,
                isDigit: true,
                
            });
        } else {
            const hasDot = displayValue.includes('.');
            const integer = displayValue.split('.')[0];

            if (!hasDot && integer.length >= 10) return;

            if (done === true) {
                this.clearAll();
                this.setState({ displayValue: String(digit), 
                    isDigit: true,  
                    isOperator: false});
            } else if (isRightBracket === true){
                this.setState({
                    displayValue: displayValue+ '*' + digit, isRightBracket: false,
                    isDigit: true, 
                    isOperator: false
                });
                } else {
                this.setState({
                    displayValue: displayValue === '0' ? String(digit) : displayValue + digit,
                    isDigit: true, 
                    isOperator: false
                });
            }
        }
    }


    performOperation(nextOperator) {
        const { value, displayValue, operator, waitingForOperand, isMemoryActive, isbracketsActive, isRightBracket, isLeftBracket, isDigit, isOperator} = this.state;

        this.setState({ isOperator: true, isDigit: false,}); //left brackets with *( and (

        if (isRightBracket === false && nextOperator === '=' && isbracketsActive === true){
            // if (displayValue === '()') clearAll();
            return this.setState({ displayValue: 'Error', isbracketsActive: false, done: true});}

        if (isRightBracket === true) this.setState({isRightBracket:false});

        if (isbracketsActive === true && nextOperator === '='){
                // if (displayValue === '()') clearAll();
                this.setState({ displayValue: String(eval(displayValue)), isbracketsActive: false});
            
            
            
        }else if (isbracketsActive === true){
            
            if(isLeftBracket === true && isDigit === false && isOperator === true){
                if( nextOperator === '/' || nextOperator === '*'){
                this.setState({ displayValue: displayValue });
            }else this.setState({ displayValue: displayValue + nextOperator, isOperator: false})
        }
            
        } 
        else{

        const inputValue = parseFloat(displayValue);

        if (value == null) {
            this.setState({
                value: inputValue
            });
        } else if ((operator && waitingForOperand === false) || (operator && isMemoryActive === true)) {
            const currentValue = parseFloat(value) || 0;
            // if (operator === '=' && isbracketsActive === true){
            //     this.setState({ displayValue: String(Math.eval(displayValue))})
            // }else {
            const newValue = CalculatorOperations[operator](currentValue, inputValue);

            this.setState({
                value: newValue,
                displayValue: String(newValue),
                isMemoryActive: false,
                isRightBracket: false,
                // isDigit: true,
                
               
            });
        // }
        }

        this.setState({
            waitingForOperand: true,
            operator: nextOperator,
            // isDigit: true,
            
        });
        }

        // this.setState({ isOperator: true, isDigit: false,}); //left brackets with *( and (
    }


    
    


    leftBracket() {
        const { displayValue, isDigit, isOperator } = this.state;

        
        this.setState({
            
            displayValue: displayValue === '0' ? '(' : isDigit === true && isOperator === false ? displayValue + '*(': displayValue + '('  ,
            isbracketsActive: true, isRightBracket: false, isLeftBracket: true, isDigit: false
        });

    }
    rightBracket() {
        const { displayValue, isLeftBracket, isDigit } = this.state;

        if (isLeftBracket && isDigit){
        this.setState({
            displayValue: displayValue === '0' ? ')' : displayValue + ')',
            isbracketsActive: true,
            isRightBracket: true,
        });
    }
    

    }



    multiplicativeInverse() {
        const { displayValue } = this.state;

        if (displayValue === '0') {
            this.setState({ displayValue: 'Not a number' });
        }

        const result = String(1 / displayValue);
        this.setState({ displayValue: result, done: true });
    }

    exponential() {
        const { displayValue } = this.state;

        if (displayValue === '0') {
            return this.setState({ displayValue: '1' });
        }

        const result = String(Math.exp(parseFloat(displayValue)));
        this.setState({ displayValue: result, done: true });
    }

    rand() {
        this.setState({ displayValue: String(Math.random()) });
    }

    sin() {
        const { displayValue, degree } = this.state;

        if (degree === false) {
            this.setState({ displayValue: String(Math.sin(displayValue)), done: true });
        } else {
            const result = String(Math.sin((parseFloat(displayValue) * Math.PI) / 180));
            this.setState({ displayValue: result, done: true });
        }
    }

    cos() {
        const { displayValue, degree } = this.state;

        if (degree === false) {
            this.setState({ displayValue: String(Math.cos(displayValue)), done: true });
        } else {
            const result = String(Math.cos((parseInt(displayValue) * Math.PI) / 180));
            this.setState({ displayValue: result, done: true });
        }
    }

    tan() {
        const { displayValue, degree } = this.state;

        if (degree === false) {
            this.setState({ displayValue: String(Math.tan(displayValue)), done: true });
        } else {
            if (displayValue === '90' || displayValue === '270') {
                this.setState({ displayValue: 'Not a number' });
            } else {
                const result = String(Math.tan((parseFloat(displayValue) * Math.PI) / 180));
                this.setState({ displayValue: result, done: true });
            }
        }
    }

    sinh() {
        const { displayValue } = this.state;
        const result = String(Math.sinh(parseFloat(displayValue)));
        this.setState({ displayValue: result, done: true });
    }

    cosh() {
        const { displayValue } = this.state;
        const result = String(Math.cosh(parseFloat(displayValue)));
        this.setState({ displayValue: result, done: true });
    }

    tanh() {
        const { displayValue } = this.state;
        const result = String(Math.tanh(parseFloat(displayValue)));
        this.setState({ displayValue: result, done: true });
    }

    sinInverse() {
        const { displayValue, degree } = this.state;

        if (degree === false) {
            this.setState({ displayValue: String(Math.asin(displayValue)), done: true });
        } else {
            const result = String((Math.asin(parseFloat(displayValue)) * 180) / Math.PI);
            this.setState({ displayValue: result, done: true });
        }
    }

    cosInverse() {
        const { displayValue, degree } = this.state;

        if (degree === false) {
            this.setState({ displayValue: String(Math.acos(displayValue)), done: true });
        } else {
            const result = String((Math.acos(parseFloat(displayValue)) * 180) / Math.PI);
            this.setState({ displayValue: result, done: true });
        }
    }

    tanInverse() {
        console.log('hello');   
        const { displayValue, degree } = this.state;

        if (degree === false) {
            this.setState({ displayValue: String(Math.atan(displayValue)), done: true });
        } else {
            const result = String((Math.atan(parseFloat(displayValue)) * 180) / Math.PI);
            this.setState({ displayValue: result, done: true });
        }
    }

    sinhInverse() {
        const { displayValue } = this.state;
        const result = String(Math.asinh(parseFloat(displayValue)));
        this.setState({ displayValue: result, done: true });
    }

    coshInverse() {
        const { displayValue } = this.state;
        const result = String(Math.acosh(parseFloat(displayValue)));
        this.setState({ displayValue: result, done: true });
    }

    tanhInverse() {
        const { displayValue } = this.state;
        const result = String(Math.atanh(parseFloat(displayValue)));
        this.setState({ displayValue: result, done: true });
    }

    sqrt() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(Math.sqrt(parseFloat(displayValue))), done: true });
    }

    cbrt() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(Math.cbrt(parseFloat(displayValue))), done: true });
    }

    handleKeyDown = (event) => {
        let { key } = event;

        if (key === 'Enter') key = '=';

        if (/\d/.test(key)) {
            event.preventDefault();
            this.inputDigit(parseInt(key, 10));
        } else if (key in CalculatorOperations) {
            event.preventDefault();
            this.performOperation(key);
        } else if (key === '.') {
            event.preventDefault();
            this.inputDot();
        } else if (key === '%') {
            event.preventDefault();
            this.inputPercent();
        } else if (key === 'Backspace') {
            event.preventDefault();
            this.clearLastChar();
        } else if (key === 'Clear') {
            event.preventDefault();

            if (this.state.displayValue !== '0') {
                this.clearDisplay();
            } else {
                this.clearAll();
            }
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    memoryClear() {
        this.setState((prevState) => ({
            memory: {
                ...prevState.memory,
                memory_plus: 0,
                memory_minus: 0,
                memory_recall: null,
            },
            isMemoryActive: false,
        }));
    }

    memoryPlus() {
        let temp = parseFloat(this.state.displayValue) + this.state.memory.memory_plus;
        this.setState((prevState) => ({
            memory: {
                ...prevState.memory,
                memory_plus: temp,
            },
        }));
    }

    memoryMinus() {
        let temp = parseInt(this.state.displayValue) + this.state.memory.memory_minus;
        this.setState((prevState) => ({
            memory: {
                ...prevState.memory,
                memory_minus: temp,
            },
        }));
    }

    memoryRecall() {
        const { displayValue } = this.state;
        let temp = (this.state.memory.memory_plus - this.state.memory.memory_minus).toString();

        if (displayValue !== '0') {
            this.setState({
                displayValue: temp,
                isMemoryActive: true,
            });
        } else {
            this.setState({
                displayValue: temp,
                isMemoryActive: false,
                done: true,
            });
        }
    }

    factorial() {
        const { displayValue } = this.state;

        if (displayValue === '1' || displayValue === '-1') {
            return this.setState({ displayValue });
        } else if (parseInt(displayValue) > 1) {
            var result = 1;

            for (var i = 1; i <= parseInt(displayValue); ++i) {
                result *= i;
            }

            return this.setState({ displayValue: String(result), done: true });
        } else if (parseInt(displayValue) < -1) {
            var resultNegative = 1;

            for (var j = -1; j >= parseInt(displayValue); j--) {
                resultNegative *= j;
            }

            return this.setState({ displayValue: String(resultNegative), done: true });
        }
    }

    log10() {
        const { displayValue } = this.state;

        if (parseInt(displayValue) <= 0) {
            return this.setState({ displayValue: 'Not a Number' });
        }

        this.setState({ displayValue: String(Math.log10(parseFloat(displayValue))), done: true });
    }

    log2() {
        const { displayValue } = this.state;

        if (parseInt(displayValue) <= 0) {
            return this.setState({ displayValue: 'Not a Number' });
        }

        this.setState({ displayValue: String(Math.log2(parseFloat(displayValue))), done: true });
    }

    log() {
        const { displayValue } = this.state;

        if (parseInt(displayValue) <= 0) {
            return this.setState({ displayValue: 'Not a Number' });
        }

        this.setState({ displayValue: String(Math.log(parseFloat(displayValue))), done: true });
    }

    pow2() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(Math.pow(parseFloat(displayValue), 2)), done: true });
    }

    pow3() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(Math.pow(parseFloat(displayValue), 3)), done: true });
    }

    tenPowX() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(Math.pow(10, parseFloat(displayValue))), done: true });
    }

    twoPowX() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(Math.pow(2, parseFloat(displayValue))), done: true });
    }

    render() {
        const { displayValue } = this.state;
        const clearDisplay = displayValue !== '0';
        const clearText = clearDisplay ? 'C' : 'AC';

        return (
            <div id='scientific-calculator'>
                <h1 className='blue-color align-center scope-title'>
                    <span className='yellow-color'>{'[ '}</span>Scientific Claculator
                    <span className='yellow-color'>{' ]'}</span>
                </h1>
                <div className='calculator-body'>
                    <div>
                        <div className='result'>
                            <p>
                                <CalculatorDisplay value={displayValue} />
                            </p>
                        </div>
                    </div>
                    <div className='button'>
                        <div className='align-center'>
                            <CalculatorKey className='memory blue-light-background' onPress={() =>this.leftBracket()}>{'('}</CalculatorKey>
                            <CalculatorKey className='blue-light-background'onPress={() =>this.rightBracket()}>{')'}</CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background'
                                onPress={() => this.memoryClear()}>
                                MC
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background'
                                onPress={() => this.memoryPlus()}>
                                M+
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background'
                                onPress={() => this.memoryMinus()}>
                                M-
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background'
                                onPress={() => this.memoryRecall()}>
                                MR
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background'
                                onPress={() => (clearDisplay ? this.clearDisplay() : this.clearAll())}>
                                {clearText}
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background'
                                onPress={() => this.toggleSign()}>
                                ±
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background'
                                onPress={() => this.inputPercent()}>
                                %
                            </CalculatorKey>
                            <CalculatorKey className='operator' onPress={() => this.performOperation('/')}>
                                ÷
                            </CalculatorKey>
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY-3'
                                    onPress={this.handleShiftClick}>
                                    1
                                    <sup>
                                        <small>st</small>
                                    </sup>
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background translateY-3'
                                    onPress={this.handleShiftClick}>
                                    2
                                    <sup>
                                        <small>nd</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            <CalculatorKey
                                className='blue-light-background translateY-3'
                                onPress={() => this.pow2()}>
                                x
                                <sup>
                                    <small>2</small>
                                </sup>
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background translateY-3'
                                onPress={() => this.pow3()}>
                                x
                                <sup>
                                    <small>3</small>
                                </sup>
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background translateY-3'
                                onPress={() => this.performOperation('xPowY')}>
                                x
                                <sup>
                                    <small>y</small>
                                </sup>
                            </CalculatorKey>
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY-3'
                                    onPress={() => this.exponential()}>
                                    e
                                    <sup>
                                        <small>x</small>
                                    </sup>
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background translateY-3'
                                    onPress={() => this.performOperation('yPowX')}>
                                    y
                                    <sup>
                                        <small>x</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY-3'
                                    onPress={() => this.tenPowX()}>
                                    10
                                    <sup>
                                        <small>x</small>
                                    </sup>
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background translateY-3'
                                    onPress={() => this.twoPowX()}>
                                    2
                                    <sup>
                                        <small>x</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            <CalculatorKey className='number-btn' onPress={() => this.inputDigit(7)}>
                                7
                            </CalculatorKey>
                            <CalculatorKey className='number-btn' onPress={() => this.inputDigit(8)}>
                                8
                            </CalculatorKey>
                            <CalculatorKey className='number-btn' onPress={() => this.inputDigit(9)}>
                                9
                            </CalculatorKey>
                            <CalculatorKey className='operator' onPress={() => this.performOperation('*')}>
                                ×
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background translateY-1'
                                onPress={() => this.multiplicativeInverse()}>
                                1/x
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background translateY-3'
                                onPress={() => this.sqrt()}>
                                <sup>
                                    <small>2</small>
                                </sup>
                                √
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background translateY-3'
                                onPress={() => this.cbrt()}>
                                <sup>
                                    <small>3</small>
                                </sup>
                                √
                            </CalculatorKey>
                            <CalculatorKey
                                className='blue-light-background translateY-3'
                                onPress={() => this.performOperation('nthRoot')}>
                                <sup>
                                    <small>x</small>
                                </sup>
                                √
                            </CalculatorKey>
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY-1'
                                    onPress={() => this.log()}>
                                    ln
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background translateY--1'
                                    onPress={() => this.performOperation('logY')}>
                                    log
                                    <sub>
                                        <small>y</small>
                                    </sub>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY--1'
                                    onPress={() => this.log10()}>
                                    log
                                    <sub>
                                        <small>10</small>
                                    </sub>
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background translateY--1'
                                    onPress={() => this.log2()}>
                                    log
                                    <sub>
                                        <small>2</small>
                                    </sub>
                                </CalculatorKey>
                            )}
                            <CalculatorKey className='number-btn' onPress={() => this.inputDigit(4)}>
                                4
                            </CalculatorKey>
                            <CalculatorKey className='number-btn' onPress={() => this.inputDigit(5)}>
                                5
                            </CalculatorKey>
                            <CalculatorKey className='number-btn' onPress={() => this.inputDigit(6)}>
                                6
                            </CalculatorKey>
                            <CalculatorKey className='operator' onPress={() => this.performOperation('-')}>
                                −
                            </CalculatorKey>
                            <CalculatorKey
                                className={'blue-light-background ' + (this.state.shift && 'translateY--3')}
                                onPress={() => this.factorial()}>
                                x!
                            </CalculatorKey>
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background' onPress={() => this.sin()}>
                                    sin
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background'
                                    onPress={() => this.sinInverse()}>
                                    sin
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background' onPress={() => this.cos()}>
                                    cos
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background'
                                    onPress={() => this.cosInverse()}>
                                    cos
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background' onPress={() => this.tan()}>
                                    tan
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background'
                                    onPress={() => this.tanInverse()}>
                                    tan
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            <CalculatorKey
                                className={'blue-light-background ' + (this.state.shift && 'translateY--3')}
                                onPress={() => this.inputDigit(Math.exp(1))}>
                                e
                            </CalculatorKey>
                            <CalculatorKey
                                className={'blue-light-background ' + (this.state.shift && 'translateY--3')}
                                onPress={() => this.ee()}>
                                EE
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'number-btn ' + (!this.state.shift ? 'translateY-1' : 'translateY--2')
                                }
                                onPress={() => this.inputDigit(1)}>
                                1
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'number-btn ' + (!this.state.shift ? 'translateY-1' : 'translateY--2')
                                }
                                onPress={() => this.inputDigit(2)}>
                                2
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'number-btn ' + (!this.state.shift ? 'translateY-1' : 'translateY--2')
                                }
                                onPress={() => this.inputDigit(3)}>
                                3
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'operator ' + (!this.state.shift ? 'translateY-1' : 'translateY--2')
                                }
                                onPress={() => this.performOperation('+')}>
                                +
                            </CalculatorKey>
                            {!this.state.degree ? (
                                <CalculatorKey
                                    className={
                                        'blue-light-background ' +
                                        (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                    }
                                    onPress={this.handleDegreeClick}>
                                    Rad
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className={
                                        'dark-blue-background ' +
                                        (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                    }
                                    onPress={this.handleDegreeClick}>
                                    Deg
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY-3'
                                    onPress={() => this.sinh()}>
                                    sinh
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background'
                                    onPress={() => this.sinhInverse()}>
                                    sinh
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY-3'
                                    onPress={() => this.cosh()}>
                                    cosh
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background'
                                    onPress={() => this.coshInverse()}>
                                    cosh
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey
                                    className='blue-light-background translateY-3'
                                    onPress={() => this.tanh()}>
                                    tanh
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey
                                    className='dark-blue-background'
                                    onPress={() => this.tanhInverse()}>
                                    tanh
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            <CalculatorKey
                                className={
                                    'blue-light-background ' +
                                    (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                }
                                onPress={() => this.inputDigit(Math.PI)}>
                                π
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'blue-light-background ' +
                                    (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                }
                                onPress={() => this.rand()}>
                                Rand
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'number-btn zero-num ' +
                                    (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                }
                                onPress={() => this.inputDigit(0)}>
                                0
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'dot-btn ' + (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                }
                                onPress={() => this.inputDot()}>
                                .
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'operator ' + (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                }
                                onPress={() => this.performOperation('=')}>
                                =
                            </CalculatorKey>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ScientificCalculator;
