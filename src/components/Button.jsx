import PropTypes from "prop-types";

const Button = ({ text, func }) => {
  return (
    <button
      onClick={func}
      className="px-8 mx-auto py-4 rounded-md border-[2px] bg-slate-950 border-blue-400 border-solid blueShadow duration-200"
      aria-label={text}
    >
      <p>{text}</p>
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
};

Button.defaultProps = {
  text: "Click Me",
  func: () => {},
};

export default Button;
