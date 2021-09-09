const Input = (props: any) => {
  return (
    <input
      className={props.className}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      maxLength={props.maxLength}
    ></input>
  );
};

export default Input;
