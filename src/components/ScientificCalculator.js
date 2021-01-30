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
        let formattedValue = parseFloat(value).toLocaleString(language, {
            useGrouping: true,
            maximumFractionDigits: 10,
        });

        // Add back missing .0 in e.g. 12.0
        const match = value.match(/\.\d*?(0*)$/);

        if (match) formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

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
};

class ScientificCalculator extends Component {
    state = {
        value: null,
        displayValue: '0',
        operator: null,
        waitingForOperand: false,
        shift: false,
        degree: false,
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
        });
    }

    inputDot() {
        const { displayValue } = this.state;

        if (!/\./.test(displayValue)) {
            this.setState({
                displayValue: displayValue + '.',
                waitingForOperand: false,
            });
        }
    }

    inputDigit(digit) {
        const { displayValue, waitingForOperand } = this.state;

        if (waitingForOperand) {
            this.setState({
                displayValue: String(digit),
                waitingForOperand: false,
            });
        } else {
            const hasDot = displayValue.includes('.');
            const integer = displayValue.split('.')[0];

            if (!hasDot && integer.length >= 10) {
                return;
            }

            this.setState({
                displayValue: displayValue === '0' ? String(digit) : displayValue + digit,
            });
        }
    }

    performOperation(nextOperator) {
        const { value, displayValue, operator } = this.state;
        const inputValue = parseFloat(displayValue);

        if (value == null) {
            this.setState({
                value: inputValue,
            });
        } else if (operator) {
            const currentValue = value || 0;
            const newValue = CalculatorOperations[operator](currentValue, inputValue);

            this.setState({
                value: newValue,
                displayValue: String(newValue),
            });
        }

        this.setState({
            waitingForOperand: true,
            operator: nextOperator,
        });
    }



    multiplicativeInverse(){
        const { displayValue } = this.state;
        if (displayValue === '0') return this.setState({displayValue: 'Non a number'});
        const result = String(1/displayValue);
        this.setState({ displayValue: result});
    }

    exponential(){
        const { displayValue } = this.state;
        if (displayValue === '0') return this.setState({displayValue: '1'});
        const result = String(Math.exp(parseFloat(displayValue)));
        this.setState({ displayValue: result});
    }

    rand(){
        const { displayValue } = this.state;
        // if (displayValue != '0') return ;
        this.setState({displayValue: String(Math.random())});
    }

    sin() {
        const { displayValue } = this.state;
        const result = String(Math.sin(parseFloat(displayValue)* Math.PI/180));
        this.setState({displayValue: result});
    }


    cos() {
        const { displayValue } = this.state;
        const result = String(Math.cos(parseInt(displayValue)* Math.PI/180));
        this.setState({displayValue: result});
    }


    tan() {
        const { displayValue } = this.state;
        const result = String(Math.tan(parseFloat(displayValue)* Math.PI/180));
        this.setState({displayValue: result});
    }

    sinh() {
        const { displayValue } = this.state;
        const result = String(Math.sinh(parseFloat(displayValue)));
        this.setState({displayValue: result});
    }
    cosh() {
        const { displayValue } = this.state;
        const result = String(Math.cosh(parseFloat(displayValue)));
        this.setState({displayValue: result});
    }
    tanh() {
        const { displayValue } = this.state;
        const result = String(Math.tanh(parseFloat(displayValue)));
        this.setState({displayValue: result});
    }

    sinInverse() {
        const { displayValue } = this.state;
        const result = String(Math.asin(parseFloat(displayValue)));
        this.setState({displayValue: result});
    }
    cosInverse(){
        const { displayValue } = this.state;
        const result = String(Math.acos(parseFloat(displayValue)));
        this.setState({displayValue: result});
    }
    tanInverse(){
        const { displayValue } = this.state;
        const result = String(Math.atan(parseFloat(displayValue)));
        this.setState({displayValue: result});
    }

    sinhInverse(){}
    coshInverse(){}
    tanhInverse(){}
    
    



    






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
        }));
    }

    memoryPlus() {
        // let temp= this.state.memory.memory_plus
        let temp = parseFloat(this.state.displayValue) + this.state.memory.memory_plus;
        this.setState((prevState) => ({
            memory: {
                ...prevState.memory,
                memory_plus: temp,
            },
        }));
        console.log(this.state.memory.memory_plus);
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
        let temp = (this.state.memory.memory_plus - this.state.memory.memory_minus).toString();
        this.setState({
            displayValue: temp,
        });
    }

    pi() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(displayValue * Math.PI) });
    }

    exponent() {
        const { displayValue } = this.state;
        this.setState({ displayValue: String(displayValue * Math.exp(1)) });
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

            return this.setState({ displayValue: String(result) });
        } else if (parseInt(displayValue) < -1) {
            var resultNegative = 1;

            for (var j = -1; j >= parseInt(displayValue); j--) {
                resultNegative *= j;
            }

            return this.setState({ displayValue: String(resultNegative) });
        }
    }

    log10() {
        const { displayValue } = this.state;

        if (parseInt(displayValue) <= 0) {
            return this.setState({ displayValue: 'Not a Number' });
        }

        this.setState({ displayValue: String(Math.log10(parseInt(displayValue))) });
    }

    log2() {
        const { displayValue } = this.state;

        if (parseInt(displayValue) <= 0) {
            return this.setState({ displayValue: 'Not a Number' });
        }

        this.setState({ displayValue: String(Math.log2(parseInt(displayValue))) });
    }

    log() {
        const { displayValue } = this.state;

        if (parseInt(displayValue) <= 0) {
            return this.setState({ displayValue: 'Not a Number' });
        }

        this.setState({ displayValue: String(Math.log(parseInt(displayValue))) });
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
                        <div class='result'>
                            <p>
                                <CalculatorDisplay value={displayValue} />
                            </p>
                        </div>
                    </div>
                    <div className='button'>
                        <div className='align-center'>
                            <CalculatorKey className='memory blue-light-background'>{'('}</CalculatorKey>
                            <CalculatorKey className='blue-light-background'>{')'}</CalculatorKey>
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
                            <CalculatorKey className='blue-light-background translateY-3'>
                                x
                                <sup>
                                    <small>2</small>
                                </sup>
                            </CalculatorKey>
                            <CalculatorKey className='blue-light-background translateY-3'>
                                x
                                <sup>
                                    <small>3</small>
                                </sup>
                            </CalculatorKey>
                            <CalculatorKey className='blue-light-background translateY-3'>
                                x
                                <sup>
                                    <small>y</small>
                                </sup>
                            </CalculatorKey>
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background translateY-3' onPress={()=> this.exponential()}>
                                    e
                                    <sup>
                                        <small>x</small>
                                    </sup>
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background translateY-3'>
                                    y
                                    <sup>
                                        <small>x</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background translateY-3'>
                                    10
                                    <sup>
                                        <small>x</small>
                                    </sup>
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background translateY-3'>
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
                            <CalculatorKey className='blue-light-background translateY-1' onPress={() => this.multiplicativeInverse()}>1/x</CalculatorKey>
                            <CalculatorKey className='blue-light-background translateY-3'>
                                <sup>
                                    <small>2</small>
                                </sup>
                                √
                            </CalculatorKey>
                            <CalculatorKey className='blue-light-background translateY-3'>
                                <sup>
                                    <small>3</small>
                                </sup>
                                √
                            </CalculatorKey>
                            <CalculatorKey className='blue-light-background translateY-3'>
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
                                <CalculatorKey className='dark-blue-background translateY--1'>
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
                                <CalculatorKey className='blue-light-background' onPress={() => this.sin()}>sin</CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background' onPress={() => this.sinInverse()}>
                                    sin
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background' onPress={() => this.cos()}>cos</CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background' onPress={() => this.cosInverse()}>
                                    cos
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background'onPress={() => this.tan()}>tan</CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background'onPress={() => this.tanInverse()}>
                                    tan
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            <CalculatorKey
                                className={'blue-light-background ' + (this.state.shift && 'translateY--3')}
                                onPress={() => this.exponent()}>
                                e
                            </CalculatorKey>
                            <CalculatorKey
                                className={'blue-light-background ' + (this.state.shift && 'translateY--3')}>
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
                                        'blue-light-background ' +
                                        (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                    }
                                    onPress={this.handleDegreeClick}>
                                    Deg
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background translateY-3' onpress={() => this.sinh()}>
                                    sinh
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background' onpress={() => this.sinhInverse()}>
                                    sinh
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background translateY-3' onpress={() => this.cosh()}>
                                    cosh
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background' onpress={() => this.coshInverse()}>
                                    cosh
                                    <sup>
                                        <small>-1</small>
                                    </sup>
                                </CalculatorKey>
                            )}
                            {!this.state.shift ? (
                                <CalculatorKey className='blue-light-background translateY-3' onpress={() => this.tanh()}>
                                    tanh
                                </CalculatorKey>
                            ) : (
                                <CalculatorKey className='dark-blue-background' onpress={() => this.tanhInverse()}>
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
                                onPress={() => this.pi()}>
                                π
                            </CalculatorKey>
                            <CalculatorKey
                                className={
                                    'blue-light-background ' +
                                    (!this.state.shift ? 'translateY-3' : 'translateY--2')
                                }>
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
