/*
   TextBox component
*/
type TextBoxProps = {
    name: string;
    id: string;
    placeholder: string;
 };
 
 
 const LoginTextBox = ({ name, id, placeholder }: TextBoxProps) => {
  return (
    <input type="text" name={name} id={id} placeholder={placeholder} />
  );
 }
 
 
 export default LoginTextBox;