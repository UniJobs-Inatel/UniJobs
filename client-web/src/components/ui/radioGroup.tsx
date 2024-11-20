interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  value: string;
}

const RadioButton = ({ label, name, value, ...props }: RadioButtonProps) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        {...props}
        type="radio"
        name={name}
        value={value}
        className="form-radio h-4 w-4  border-gray-300"
      />
      <span className=" ">{label}</span>
    </label>
  );
};

export { RadioButton };

