import React, { Component } from "react";
import "../css/SimpleCalculator.css";
import PointTarget from "react-point";

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
        className="auto-scaling-text"
        style={{ transform: `scale(${scale},${scale})` }}
        ref={(node) => (this.node = node)}
      >
        {this.props.children}
      </div>
    );
  }
}

class CalculatorDisplay extends Component {
  render() {
    const { value, ...props } = this.props;
    const language = navigator.language || "en-US";

    let formattedValue = parseFloat(value).toLocaleString(language, {
      useGrouping: true,
      maximumFractionDigits: 6,
    });

    // Add back missing .0 in e.g. 12.0
    const match = value.match(/\.\d*?(0*)$/);

    if (match) formattedValue += /[1-9]/.test(match[0]) ? match[1] : match[0];

    if (formattedValue === "∞" || formattedValue === "NaN")
      formattedValue = "Error";

    return (
      <div {...props} className="calculator-display">
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
  "/": (prevValue, nextValue) => prevValue / nextValue,
  "*": (prevValue, nextValue) => prevValue * nextValue,
  "+": (prevValue, nextValue) => prevValue + nextValue,
  "-": (prevValue, nextValue) => prevValue - nextValue,
  "=": (prevValue, nextValue) => nextValue,
};

class SimpleCalculator extends Component {
  state = {
    value: null,
    displayValue: "0",
    operator: null,
    waitingForOperand: false,
    done: false,
    isMemoryActive: false,
    memory: {
      memory_plus: 0,
      memory_minus: 0,
      memory_recall: null,
    },
    isDot: false,
  };

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
    // let temp= this.state.memory.memory_plus
    let temp =
      parseFloat(this.state.displayValue) + this.state.memory.memory_plus;
    this.setState((prevState) => ({
      memory: {
        ...prevState.memory,
        memory_plus: temp,
      },
      isMemoryActive: true,
      // done: true,
    }));
  }

  memoryMinus() {
    let temp =
      parseInt(this.state.displayValue) + this.state.memory.memory_minus;
    this.setState((prevState) => ({
      memory: {
        ...prevState.memory,
        memory_minus: temp,
      },
      isMemoryActive: true,
      // done: true,
    }));
  }

  memoryRecall() {
    const { displayValue, isMemoryActive, done } = this.state;
    let temp = (
      this.state.memory.memory_plus - this.state.memory.memory_minus
    ).toString();

    if (isMemoryActive === true) {
      this.setState({
          displayValue: temp,
          isMemoryActive: true,
          // done: true,
      });
    } else {
      this.setState({
          displayValue: temp,
          isMemoryActive: false,
          // done: false,
      });
    }


    console.log('memory: ' + isMemoryActive)
    console.log('done: ' + done)
  }

  clearAll() {
    this.setState({
        value: null,
        displayValue: '0',
        operator: null,
        waitingForOperand: false,
        done: false,
        isMemoryActive: false,
        isDot: false,
    });
  }

  clearDisplay() {
    this.setState({
      displayValue: "0",
    });
  }

  clearLastChar() {
    const { displayValue } = this.state;

    this.setState({
      displayValue: displayValue.substring(0, displayValue.length - 1) || "0",
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

    const fixedDigits = displayValue.replace(/^-?\d*\.?/, "");
    const newValue = parseFloat(displayValue) / 100;

    this.setState({
      displayValue: String(newValue.toFixed(fixedDigits.length + 2)),
      done: true,
    });
  }

  inputDot() {
    const { displayValue, waitingForOperand, done, isMemoryActive, isDot } = this.state;

    this.setState({ isDot: true });

    if (waitingForOperand === true || isMemoryActive === true) {
      this.setState({ displayValue: "0.", waitingForOperand: false});
    } else if (isDot === true) {
      this.setState({
          displayValue: displayValue + '.',
          waitingForOperand: false,
          isDot: true,
      });
    } else if (isMemoryActive === true) {
      this.setState({ displayValue: '0.', waitingForOperand: false, isDot: true });
    } else if (!/\./.test(displayValue)) {
      this.setState({
        displayValue: displayValue + ".",
        waitingForOperand: false,
        isDot: true,
      });
    }

    console.log(isDot)
  }

  inputDigit(digit) {
    const { displayValue, waitingForOperand, done, isDot } = this.state;

    if (waitingForOperand) {
      this.setState({
        displayValue: String(digit),
        waitingForOperand: false,
      });
    } else {
      const hasDot = displayValue.includes(".");
      const integer = displayValue.split(".")[0];

      if (!hasDot && integer.length >= 10) return;

      if (done === true) {
        this.clearAll();
        this.setState({ displayValue: String(digit) });
      } else if (isDot === true) {
        this.setState({ displayValue: displayValue + digit, });
      } else {
        this.setState({
          displayValue:
            displayValue === "0" ? String(digit) : displayValue + digit,
        });
      }
    }
  }

  performOperation(nextOperator) {
    const {
      value,
      displayValue,
      operator,
      waitingForOperand,
      isMemoryActive,
    } = this.state;
    const inputValue = parseFloat(displayValue);

    if (value == null) {
      this.setState({
        value: inputValue,
      });
    } else if (
      (operator && waitingForOperand === false) ||
      (operator && isMemoryActive === true)
    ) {
      const currentValue = parseFloat(value) || 0;
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

  handleKeyDown = (event) => {
    let { key } = event;

    if (key === "Enter") key = "=";

    if (/\d/.test(key)) {
      event.preventDefault();
      this.inputDigit(parseInt(key, 10));
    } else if (key in CalculatorOperations) {
      event.preventDefault();
      this.performOperation(key);
    } else if (key === ".") {
      event.preventDefault();
      this.inputDot();
    } else if (key === "%") {
      event.preventDefault();
      this.inputPercent();
    } else if (key === "Backspace") {
      event.preventDefault();
      this.clearLastChar();

      if (this.state.displayValue !== "0") {
        this.clearDisplay();
      } else {
        this.clearAll();
      }
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render() {
    const { displayValue } = this.state;
    const clearDisplay = displayValue !== "0";
    const clearText = clearDisplay ? "C" : "AC";

    return (
      <div id="simple-calculator">
        <h1 className="blue-color align-center scope-title">
          <span className="yellow-color">{"[ "}</span>Simple Calculator
          <span className="yellow-color">{" ]"}</span>
        </h1>
        <div className="calculator-body">
          <div className="resultContainer">
            <div className="result">
              <p>
                <CalculatorDisplay value={displayValue} />
              </p>
            </div>
          </div>
          <div className="button">
            <div className="align-center">
              <CalculatorKey
                className="memory blue-light-background"
                onPress={() => this.memoryClear()}
              >
                MC
              </CalculatorKey>
              <CalculatorKey
                className="memory blue-light-background"
                onPress={() => this.memoryPlus()}
              >
                M+
              </CalculatorKey>
              <CalculatorKey
                className="memory blue-light-background"
                onPress={() => this.memoryMinus()}
              >
                M-
              </CalculatorKey>
              <CalculatorKey
                className="memory blue-light-background"
                onPress={() => this.memoryRecall()}
              >
                MR
              </CalculatorKey>
              <CalculatorKey
                className="blue-light-background clear-btn"
                onPress={() =>
                  clearDisplay ? this.clearDisplay() : this.clearAll()
                }
              >
                {clearText}
              </CalculatorKey>
              <CalculatorKey
                className="blue-light-background"
                onPress={() => this.toggleSign()}
              >
                ±
              </CalculatorKey>
              <CalculatorKey
                className="blue-light-background"
                onPress={() => this.inputPercent()}
              >
                %
              </CalculatorKey>
              <CalculatorKey
                className="operator black-color yellow-background"
                onPress={() => this.performOperation("/")}
              >
                ÷
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(7)}
              >
                7
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(8)}
              >
                8
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(9)}
              >
                9
              </CalculatorKey>
              <CalculatorKey
                className="operator black-color yellow-background"
                onPress={() => this.performOperation("*")}
              >
                ×
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(4)}
              >
                4
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(5)}
              >
                5
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(6)}
              >
                6
              </CalculatorKey>
              <CalculatorKey
                className="operator black-color yellow-background"
                onPress={() => this.performOperation("-")}
              >
                −
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(1)}
              >
                1
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(2)}
              >
                2
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDigit(3)}
              >
                3
              </CalculatorKey>
              <CalculatorKey
                className="operator black-color yellow-background"
                onPress={() => this.performOperation("+")}
              >
                +
              </CalculatorKey>
              <CalculatorKey
                className="zero-num blue-background"
                onPress={() => this.inputDigit(0)}
              >
                0
              </CalculatorKey>
              <CalculatorKey
                className="blue-background"
                onPress={() => this.inputDot()}
              >
                .
              </CalculatorKey>
              <CalculatorKey
                className="operator black-color yellow-background"
                onPress={() => this.performOperation("=")}
              >
                =
              </CalculatorKey>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SimpleCalculator;
