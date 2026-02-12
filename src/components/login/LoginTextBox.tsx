/*
   TextBox component
*/
type TextBoxProps = {
    name: string;
    id: string;
 };
 
 
 const LoginTextBox = ({ name, id }: TextBoxProps) => {
  return (
    <input type="text" name={name} id={id}/>
  );
 }
 
 
 export default LoginTextBox;