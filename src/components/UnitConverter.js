import React, { Component } from 'react';
import '../css/UnitConverter.css';
import PointTarget from 'react-point';
import axios from 'axios';
import { HiSwitchVertical } from 'react-icons/hi';
import { IoMdReturnLeft } from 'react-icons/io';

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
                style={{ transform: `scale(${scale},${scale})` }}
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
        const escapedKeys = ['e'];
        let isNumeric = true;

        escapedKeys.forEach((key) => {
            if (value.includes(key)) isNumeric = false;
        });

        const parsedValue = isNumeric ? parseFloat(value) : value;

        let formattedValue = parsedValue.toLocaleString(language, {
            useGrouping: true,
            maximumFractionDigits: 10,
        });

        if (value.endsWith('.')) formattedValue += '.';

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

class SimpleCalculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            displayValue1: '0',
            displayValue2: '0',
            operator: null,
            waitingForOperand: false,
            selectedType: 'area',
            unit1: 'mm2',
            unit2: 'mm2',
            type: null,
            types: {
                area: ['mm2', 'cm2', 'm2', 'km2', 'in2', 'ft2'],
                length: ['mm', 'cm', 'km', 'm', 'in', 'ft', 'mi'],
                temperature: ['C', 'K', 'F', 'R'],
                volume: ['l', 'ml', 'kl', 'mm3', 'cm3', 'km3'],
                mass: ['mg', 'kg', 'g', 'oz', 'lb', 't'],
                data: ['b', 'Kb', 'Mb'],
                speed: ['m/s', 'km/h', 'm/h', 'knot', 'ft/s'],
                time: ['ms', 's', 'h', 'd', 'week', 'month', 'year'],
            },
        };
        this.changeSelectOptionHandler = this.changeSelectOptionHandler.bind(this);
    }

    changeSelectOptionHandler(event) {
        this.setState({
            selectedType: event.target.value,
            unit1: this.state.types[event.target.value][0],
            unit2: this.state.types[event.target.value][0],
            displayValue1: '0',
            displayValue2: '0',
        });
        event.preventDefault();
    }

    clearAll() {
        this.setState({
            value: null,
            displayValue1: '0',
            displayValue2: '0',
            operator: null,
            waitingForOperand: false,
        });
    }

    clearDisplay() {
        this.setState({
            displayValue1: '0',
            displayValue2: '0',
        });
    }

    clearLastChar() {
        const { displayValue1 } = this.state;
        this.setState({
            displayValue1: displayValue1.substring(0, displayValue1.length - 1) || '0',
        });
    }

    toggleSign() {
        const { displayValue1 } = this.state;
        const newValue = parseFloat(displayValue1) * -1;

        this.setState({
            displayValue1: String(newValue),
        });
    }

    inputDot() {
        const { displayValue1 } = this.state;

        if (!/\./.test(displayValue1)) {
            this.setState({
                displayValue1: displayValue1 + '.',
                waitingForOperand: false,
            });
        }
    }

    inputDigit(digit) {
        const { displayValue1, waitingForOperand } = this.state;

        if (waitingForOperand) {
            this.setState({
                displayValue1: String(digit),
                waitingForOperand: false,
            });
        } else {
            const hasDot = displayValue1.includes('.');
            const integer = displayValue1.split('.')[0];

            if (!hasDot && integer.length >= 10) return;

            this.setState({
                displayValue1: displayValue1 === '0' ? String(digit) : displayValue1 + digit,
            });
        }
    }

    handleKeyDown = (event) => {
        let { key } = event;

        if (/\d/.test(key)) {
            event.preventDefault();
            this.inputDigit(parseInt(key, 10));
        } else if (key === '.') {
            event.preventDefault();
            this.inputDot();
        } else if (key === 'Backspace') {
            event.preventDefault();
            this.clearLastChar();
        }
    };

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
        if (this.state.selectedType === '') {
            this.setState({
                selectedType: 'area',
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    render() {
        let options = null;
        const { displayValue1, displayValue2, unit1, unit2 } = this.state;
        const clearDisplay = displayValue1 !== '0';
        const clearText = clearDisplay ? 'C' : 'AC';

        const handleChange = (event) => {
            this.setState({
                unit1: event.target.value,
                displayValue2: '0',
            });
            event.preventDefault();
        };

        const handleChange2 = (event) => {
            this.setState({
                unit2: event.target.value,
                displayValue2: '0',
            });
            event.preventDefault();
        };

        const getResult = () => {
            axios
                .get(
                    `https://converter.doxxie.live/convert?from=${this.state.unit1}&to=${this.state.unit2}&amount=${this.state.displayValue1}`
                )
                .then((res) => {
                    this.setState({
                        displayValue2: res.data.converted,
                    });
                });
        };

        const getSwitch = () => {
            var displayTmp = displayValue1;
            var unitTmp = unit1;
            this.setState({
                displayValue1: displayValue2,
                displayValue2: displayTmp,
                unit1: unit2,
                unit2: unitTmp,
            });
        };

        this.state.type = this.state.types[this.state.selectedType];

        if (this.state.type) {
            options = this.state.type.map((el) => <option key={el}>{el}</option>);
        }

        return (
            <div id='unit-converter'>
                <div id='measurement'>
                    <button onClick={this.changeSelectOptionHandler} value='area'>
                        Area
                    </button>
                    <button onClick={this.changeSelectOptionHandler} value='length'>
                        Length
                    </button>
                    <button onClick={this.changeSelectOptionHandler} value='temperature'>
                        Temperature
                    </button>
                    <button onClick={this.changeSelectOptionHandler} value='volume'>
                        Volume
                    </button>
                    <button onClick={this.changeSelectOptionHandler} value='mass'>
                        Mass
                    </button>
                    <button onClick={this.changeSelectOptionHandler} value='data'>
                        Data
                    </button>
                    <button onClick={this.changeSelectOptionHandler} value='speed'>
                        Speed
                    </button>
                    <button onClick={this.changeSelectOptionHandler} value='time'>
                        Time
                    </button>
                </div>
                <div className='calculator-body'>
                    <div className='resultContainer'>
                        <div className='first-input'>
                            <select value={this.state.unit1} onChange={handleChange}>
                                {options}
                            </select>
                            <p>
                                <CalculatorDisplay value={displayValue1} />
                            </p>
                        </div>
                        <div className='second-input'>
                            <select value={this.state.unit2} onChange={handleChange2}>
                                {options}
                            </select>
                            <p>
                                <CalculatorDisplay value={displayValue2} />
                            </p>
                        </div>
                    </div>
                    <div className='unit-converter-btn'>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(7)}>
                            7
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(8)}>
                            8
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(9)}>
                            9
                        </CalculatorKey>
                        <CalculatorKey className='blue-light-background' onPress={() => this.clearLastChar()}>
                            <i class='fas fa-backspace'></i>
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(4)}>
                            4
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(5)}>
                            5
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(6)}>
                            6
                        </CalculatorKey>
                        <CalculatorKey
                            className='blue-light-background'
                            onPress={() => (clearDisplay ? this.clearDisplay() : this.clearAll())}>
                            {clearText}
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(1)}>
                            1
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(2)}>
                            2
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(3)}>
                            3
                        </CalculatorKey>
                        <CalculatorKey className='blue-light-background' onPress={getSwitch}>
                            <HiSwitchVertical className='switch-icon' />
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.toggleSign()}>
                            ±
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDigit(0)}>
                            0
                        </CalculatorKey>
                        <CalculatorKey className='blue-background' onPress={() => this.inputDot()}>
                            .
                        </CalculatorKey>
                        <CalculatorKey className='black-color yellow-background' onPress={getResult}>
                            <IoMdReturnLeft />
                        </CalculatorKey>
                    </div>
                </div>
            </div>
        );
    }
}

export default SimpleCalculator;
