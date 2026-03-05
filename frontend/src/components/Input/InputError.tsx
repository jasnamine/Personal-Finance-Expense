interface InputErrorProps {
  error?: string;
}

const InputError = ({ error }: InputErrorProps) => {
  if (!error) return null;

  return <p className="text-red-500 text-sm mt-1">{error}</p>;
};

export default InputError;
