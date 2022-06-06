import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "ADD_DIGIT",
  DEL_DIGIT: "DEL_DIGIT",
  CHOOSE_OPERATION: "CHOOSE_OPERATION",
  EVALUATE: "EVALUATE",
  CLEAR: "CLEAR",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return { ...state, currentNum: payload.digit, overwrite: false };
      }

      if (payload.digit === "0" && state.currentNum === "0") return state;

      if (state.currentNum === undefined && payload.digit === ".")
        return { ...state, currentNum: "0." };

      if (payload.digit === "." && state.currentNum.includes(".")) return state;

      return {
        ...state,
        currentNum: `${state.currentNum || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentNum == null && state.prevNum == null) return state;
      if (state.currentNum == null) {
        return { ...state, operation: payload.operation };
      }

      if (state.prevNum == null) {
        return {
          ...state,
          operation: payload.operation,
          prevNum: state.currentNum,
          currentNum: null,
        };
      }
      return {
        ...state,
        operation: payload.operation,
        prevNum: evaluate(state),
        currentNum: null,
      };

    case ACTIONS.DEL_DIGIT:
      if (state.overwrite) {
        return { ...state, currentNum: null, overwrite: false };
      }

      if (state.currentNum == null) return state;

      if (state.currentNum.length === 1) return { ...state, currentNum: null };
      return { ...state, currentNum: state.currentNum.slice(0, -1) };

    case ACTIONS.EVALUATE:
      if (
        state.currentNum == null ||
        state.prevNum == null ||
        state.operation == null
      )
        return state;
      return {
        ...state,
        currentNum: evaluate(state),
        prevNum: null,
        operation: null,
        overwrite: true,
      };

    default:
      return state;
  }
};

const evaluate = ({ currentNum, prevNum, operation }) => {
  const current = parseFloat(currentNum);
  const prev = parseFloat(prevNum);

  if (isNaN(current) || isNaN(prev)) return "";
  let computation = "";
  computation =
    operation === "+"
      ? prev + current
      : operation === "-"
      ? prev - current
      : operation === "*"
      ? prev * current
      : prev / current;

  return computation.toString();
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatNumber = (num) => {
  if (num == null) return;
  const [integer, decimal] = num.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
};

function App() {
  const [{ currentNum, prevNum, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-number">
          {formatNumber(prevNum)} {operation}
        </div>
        <div className="current-number">{formatNumber(currentNum)}</div>
      </div>
      <button
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        className="span-two"
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DEL_DIGIT })}>DEL</button>

      <OperationButton dispatch={dispatch} operation="÷" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />

      <OperationButton dispatch={dispatch} operation="*" />

      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />

      <OperationButton dispatch={dispatch} operation="+" />

      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />

      <OperationButton dispatch={dispatch} operation="-" />

      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />

      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
