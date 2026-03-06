/* eslint-disable react/prop-types */

const Input = ({
  label,
  type = "text",
  placeholder,
  onChange,
  value,
  name,
  required = false,
}) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text font-bold text-sm text-[#1E1E1E]">
            {label}
          </span>
        </label>
      )}

      <input
        name={name}
        id={name}
        type={type}
        onChange={onChange}
        value={value}
        required={required}
        placeholder={placeholder}
        className="input bg-white w-full text-black border border-black focus:border-black rounded-md pr-12"
      />
    </div>
  );
};

export default Input;
